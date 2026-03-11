import { NextResponse } from "next/server";
import { createSquareCustomer, saveCardOnFile } from "@/lib/square";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, billingAddress, notes, nonce, signatureData } = body;

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
    const { last4, cardBrand } = await saveCardOnFile(nonce, customerId, name);

    // 3. Insert into Supabase recurring_customers
    const { error: dbError } = await supabase
      .from("recurring_customers")
      .insert({
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        square_customer_id: customerId,
        notes: [notes, billingAddress ? `Billing address: ${billingAddress}` : ""]
          .filter(Boolean)
          .join(" | ") || null,
        signature_data: signatureData || null,
        active: true,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Customer + card already created in Square — don't fail entirely
    }

    return NextResponse.json({
      success: true,
      cardLast4: last4,
      cardBrand: cardBrand,
    });
  } catch (err) {
    console.error("Enrollment error:", err);
    const message = err instanceof Error ? err.message : "Enrollment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
