import { NextResponse } from "next/server";
import { createSquareCustomer, saveCardOnFile } from "@/lib/square";
import { supabase } from "@/lib/supabase";
import {
  findContactByEmail,
  findContactByPhone,
  createContact,
  updateContactProperties,
  createContactNote,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  enrollmentConfirmationEmail,
  enrollmentNotificationEmail,
} from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, billingAddress, notes, contractType, nonce, signatureData, utm_params } = body;

    // Contract setup
    const validContracts = ["month_to_month", "6_month", "annual"];
    const contract = validContracts.includes(contractType) ? contractType : "month_to_month";
    const discountMap: Record<string, number> = { month_to_month: 0, "6_month": 5, annual: 10 };
    const discount = discountMap[contract] || 0;
    const contractStart = new Date().toISOString().split("T")[0];
    let contractEnd: string | null = null;
    if (contract === "6_month") {
      const end = new Date();
      end.setMonth(end.getMonth() + 6);
      contractEnd = end.toISOString().split("T")[0];
    } else if (contract === "annual") {
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);
      contractEnd = end.toISOString().split("T")[0];
    }

    if (!name || !nonce) {
      return NextResponse.json(
        { error: "Name and card token are required" },
        { status: 400 },
      );
    }

    // Split name into given/family for Square
    const parts = name.trim().split(/\s+/);
    const givenName = parts[0];
    const familyName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    // Build note for Square (include billing address if different)
    const squareNote = [notes, billingAddress ? `Billing: ${billingAddress}` : ""]
      .filter(Boolean)
      .join(" | ") || undefined;

    // 1. Create customer in Square
    const { customerId } = await createSquareCustomer(
      givenName,
      familyName,
      email || undefined,
      phone || undefined,
      squareNote,
    );

    // 2. Save card on file using the nonce from Web Payments SDK
    const cardResult = await saveCardOnFile(nonce, customerId, name);
    const last4 = cardResult.last4 ?? "****";
    const cardBrand = cardResult.cardBrand ?? "Card";

    // 3. Supabase upsert — check for existing row by email first
    const dbNotes = [notes, billingAddress ? `Billing address: ${billingAddress}` : ""]
      .filter(Boolean)
      .join(" | ") || null;

    if (email) {
      const { data: existing } = await supabase
        .from("recurring_customers")
        .select("id")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        const { error: dbError } = await supabase
          .from("recurring_customers")
          .update({
            name,
            phone: phone || null,
            address: address || null,
            square_customer_id: customerId,
            notes: dbNotes,
            signature_data: signatureData || null,
            active: true,
            contract_type: contract,
            contract_start_date: contractStart,
            contract_end_date: contractEnd,
            contract_discount_pct: discount,
            auto_renew: true,
            ...(utm_params ? { utm_params } : {}),
          })
          .eq("id", existing.id);

        if (dbError) console.error("Supabase update error:", dbError);
      } else {
        const { error: dbError } = await supabase
          .from("recurring_customers")
          .insert({
            name,
            email: email.toLowerCase().trim(),
            phone: phone || null,
            address: address || null,
            square_customer_id: customerId,
            notes: dbNotes,
            signature_data: signatureData || null,
            active: true,
            contract_type: contract,
            contract_start_date: contractStart,
            contract_end_date: contractEnd,
            contract_discount_pct: discount,
            auto_renew: true,
            ...(utm_params ? { utm_params } : {}),
          });

        if (dbError) console.error("Supabase insert error:", dbError);
      }
    } else {
      // No email — just insert (can't dedup without email)
      const { error: dbError } = await supabase
        .from("recurring_customers")
        .insert({
          name,
          email: null,
          phone: phone || null,
          address: address || null,
          square_customer_id: customerId,
          notes: dbNotes,
          signature_data: signatureData || null,
          active: true,
          contract_type: contract,
          contract_start_date: contractStart,
          contract_end_date: contractEnd,
          contract_discount_pct: discount,
          auto_renew: true,
          ...(utm_params ? { utm_params } : {}),
        });

      if (dbError) console.error("Supabase insert error:", dbError);
    }

    // 4. HubSpot sync (non-fatal)
    try {
      let contactId: string | null = null;

      // Find existing contact by email, then phone
      if (email) {
        const existing = await findContactByEmail(email);
        if (existing) contactId = existing.id;
      }
      if (!contactId && phone) {
        const existing = await findContactByPhone(phone);
        if (existing) contactId = existing.id;
      }

      if (contactId) {
        // Update existing contact with any new info
        const updates: Record<string, string> = {};
        if (phone) updates.phone = phone;
        if (address) updates.address = address;
        if (givenName) updates.firstname = givenName;
        if (familyName) updates.lastname = familyName;
        if (Object.keys(updates).length > 0) {
          await updateContactProperties(contactId, updates);
        }
      } else if (email) {
        // Create new contact
        const contact = await createContact(
          email,
          givenName,
          familyName,
          phone || null,
        );
        contactId = contact.id;

        // Update address if provided
        if (address) {
          await updateContactProperties(contactId, { address });
        }
      }

      // Add enrollment note
      if (contactId) {
        await createContactNote(
          contactId,
          `[ENROLL:CARD-ON-FILE] ${name} enrolled with ${cardBrand} ending ${last4}`,
        );
      }
    } catch (hubspotErr) {
      console.error("HubSpot sync error (non-fatal):", hubspotErr);
    }

    // 5. Send emails (non-fatal)
    try {
      // Customer confirmation
      if (email) {
        const unsubUrl = createUnsubscribeUrl(email);
        const confirmation = enrollmentConfirmationEmail(
          givenName,
          cardBrand,
          last4,
          address || "",
          unsubUrl,
        );
        await sendEmail(email, confirmation.subject, confirmation.html);
      }

      // Admin notification
      const adminEmail = process.env.RESEND_FROM_EMAIL || "info@myhorsefarm.com";
      const notification = enrollmentNotificationEmail(
        name,
        email || "",
        phone || "",
        address || "",
        billingAddress || "",
        cardBrand,
        last4,
      );
      await sendEmail(adminEmail, notification.subject, notification.html);
    } catch (emailErr) {
      console.error("Email send error (non-fatal):", emailErr);
    }

    // Set segment cookie for retargeting
    const res = NextResponse.json({
      success: true,
      cardLast4: last4,
      cardBrand: cardBrand,
    });
    res.cookies.set("mhf_segment", "recurring", {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    console.error("Enrollment error:", err);
    const message = err instanceof Error ? err.message : "Enrollment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
