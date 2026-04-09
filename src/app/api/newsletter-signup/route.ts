import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = await rateLimit(ip, "newsletter-signup", 5, 3600);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    // Create or update HubSpot contact with marketing subscription
    const token = process.env.HUBSPOT_API_TOKEN;
    if (token) {
      try {
        await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              email,
              hs_lead_status: "NEW",
              lifecyclestage: "subscriber",
            },
          }),
        }).then(async (res) => {
          // If contact already exists (409), update them instead
          if (res.status === 409) {
            const conflict = await res.json();
            const existingId = conflict?.message?.match(/Existing ID: (\d+)/)?.[1];
            if (existingId) {
              await fetch(
                `https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    properties: {
                      hs_lead_status: "NEW",
                    },
                  }),
                },
              );
            }
          }
        });
      } catch (err) {
        // Log but do not block the user experience
        console.error("[newsletter-signup] HubSpot error:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}
