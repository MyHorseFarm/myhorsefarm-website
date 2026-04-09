import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSquareCustomer, saveCardOnFile } from "@/lib/square";
import { verifySignedToken } from "@/lib/url-signing";
import {
  findContactByEmail,
  updateContactProperties,
  createContactNote,
} from "@/lib/hubspot";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Require valid token
  const token = request.nextUrl.searchParams.get("token");
  if (!token || !verifySignedToken("quote", id, token)) {
    return NextResponse.json(
      { error: "Invalid or missing token" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const {
      gate_code,
      num_horses,
      num_stalls,
      property_size,
      access_instructions,
      billing_address,
      notes,
      nonce,
      signature_data,
    } = body as {
      gate_code?: string;
      num_horses?: number;
      num_stalls?: number;
      property_size?: string;
      access_instructions?: string;
      billing_address?: string;
      notes?: string;
      nonce: string;
      signature_data: string;
    };

    if (!nonce || !signature_data) {
      return NextResponse.json(
        { error: "Card token (nonce) and signature are required" },
        { status: 400 },
      );
    }

    // Fetch quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.status !== "accepted") {
      return NextResponse.json(
        { error: `Quote must be accepted first (status: ${quote.status})` },
        { status: 400 },
      );
    }

    // Split customer name into given/family for Square
    const nameParts = quote.customer_name.trim().split(/\s+/);
    const givenName = nameParts[0];
    const familyName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Build Square note
    const squareNote = [
      notes,
      billing_address ? `Billing: ${billing_address}` : "",
      gate_code ? `Gate: ${gate_code}` : "",
    ]
      .filter(Boolean)
      .join(" | ") || undefined;

    // 1. Create Square customer
    const { customerId } = await createSquareCustomer(
      givenName,
      familyName,
      quote.customer_email || undefined,
      quote.customer_phone || undefined,
      squareNote,
    );

    // 2. Save card on file
    const cardResult = await saveCardOnFile(nonce, customerId, quote.customer_name);
    const last4 = cardResult.last4 ?? "****";
    const cardBrand = cardResult.cardBrand ?? "Card";

    // 3. Upsert recurring_customer — check by email first
    const farmFields = {
      gate_code: gate_code || null,
      num_horses: num_horses ?? null,
      num_stalls: num_stalls ?? null,
      property_size: property_size || null,
      access_instructions: access_instructions || null,
      billing_address: billing_address || null,
    };

    let recurringCustomerId: string;

    if (quote.customer_email) {
      const { data: existing } = await supabase
        .from("recurring_customers")
        .select("id")
        .eq("email", quote.customer_email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        // Update existing customer
        const { error: updateError } = await supabase
          .from("recurring_customers")
          .update({
            name: quote.customer_name,
            phone: quote.customer_phone || null,
            address: quote.customer_location || null,
            square_customer_id: customerId,
            notes: notes || null,
            signature_data,
            active: true,
            ...farmFields,
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Supabase update error:", updateError);
          throw new Error(`Database update failed: ${updateError.message}`);
        }
        recurringCustomerId = existing.id;
      } else {
        // Insert new customer
        const { data: inserted, error: insertError } = await supabase
          .from("recurring_customers")
          .insert({
            name: quote.customer_name,
            email: quote.customer_email.toLowerCase().trim(),
            phone: quote.customer_phone || null,
            address: quote.customer_location || null,
            square_customer_id: customerId,
            notes: notes || null,
            signature_data,
            active: true,
            ...farmFields,
          })
          .select("id")
          .single();

        if (insertError || !inserted) {
          console.error("Supabase insert error:", insertError);
          throw new Error(`Database insert failed: ${insertError?.message}`);
        }
        recurringCustomerId = inserted.id;
      }
    } else {
      // No email — insert without dedup
      const { data: inserted, error: insertError } = await supabase
        .from("recurring_customers")
        .insert({
          name: quote.customer_name,
          email: null,
          phone: quote.customer_phone || null,
          address: quote.customer_location || null,
          square_customer_id: customerId,
          notes: notes || null,
          signature_data,
          active: true,
          ...farmFields,
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        console.error("Supabase insert error:", insertError);
        throw new Error(`Database insert failed: ${insertError?.message}`);
      }
      recurringCustomerId = inserted.id;
    }

    // 4. Update quote with recurring_customer_id
    await supabase
      .from("quotes")
      .update({ recurring_customer_id: recurringCustomerId })
      .eq("id", id);

    // 5. HubSpot sync (non-fatal)
    try {
      if (quote.customer_email) {
        const contact = await findContactByEmail(quote.customer_email);
        if (contact) {
          const updates: Record<string, string> = {};
          if (billing_address) updates.address = billing_address;
          if (quote.customer_phone) updates.phone = quote.customer_phone;
          if (givenName) updates.firstname = givenName;
          if (familyName) updates.lastname = familyName;

          if (Object.keys(updates).length > 0) {
            await updateContactProperties(contact.id, updates);
          }

          const farmNoteLines = [
            `[PROFILE:${quote.quote_number}] Customer profile saved`,
            gate_code ? `Gate code: ${gate_code}` : null,
            num_horses ? `Horses: ${num_horses}` : null,
            num_stalls ? `Stalls: ${num_stalls}` : null,
            property_size ? `Property size: ${property_size}` : null,
            access_instructions ? `Access: ${access_instructions}` : null,
            `Card on file: ${cardBrand} ending ${last4}`,
          ]
            .filter(Boolean)
            .join("\n");

          await createContactNote(contact.id, farmNoteLines);
        }
      }
    } catch (hubspotErr) {
      console.error("HubSpot sync error (non-fatal):", hubspotErr);
    }

    return NextResponse.json({
      ok: true,
      recurring_customer_id: recurringCustomerId,
      card_last4: last4,
      card_brand: cardBrand,
    });
  } catch (err) {
    console.error("Profile save error:", err);
    const message = err instanceof Error ? err.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
