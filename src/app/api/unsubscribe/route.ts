import { NextRequest } from "next/server";
import { verifyUnsubscribeSignature } from "@/lib/emails";
import { unsubscribeContact } from "@/lib/hubspot";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function page(title: string, body: string): Response {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title} - My Horse Farm</title></head>
<body style="margin:0;padding:40px 20px;font-family:Arial,sans-serif;background:#f4f4f4;text-align:center;">
<div style="max-width:480px;margin:0 auto;background:#fff;padding:40px;border-radius:8px;">
<img src="https://www.myhorsefarm.com/logo.png" alt="My Horse Farm" style="width:80px;margin-bottom:20px;" />
${body}
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

// GET: Show confirmation page (prevents auto-unsubscribe from email pre-fetch)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  const sig = searchParams.get("sig") || "";

  if (!email || !sig || !verifyUnsubscribeSignature(email, sig)) {
    return page("Invalid Link", "<h2>Invalid unsubscribe link</h2><p>This link is expired or invalid.</p>");
  }

  const safeEmail = escapeHtml(email);
  const safeSig = escapeHtml(sig);

  return page(
    "Unsubscribe",
    `<h2 style="color:#333;margin:0 0 15px;">Unsubscribe</h2>
<p style="color:#666;">Click below to unsubscribe <strong>${safeEmail}</strong> from My Horse Farm marketing emails.</p>
<form method="POST" action="/api/unsubscribe">
<input type="hidden" name="email" value="${safeEmail}" />
<input type="hidden" name="sig" value="${safeSig}" />
<button type="submit" style="background:#d4a843;color:#fff;border:none;padding:14px 32px;border-radius:5px;cursor:pointer;font-size:16px;font-weight:bold;">
Confirm Unsubscribe
</button>
</form>`,
  );
}

// POST: Process unsubscription
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = (formData.get("email") as string) || "";
  const sig = (formData.get("sig") as string) || "";

  if (!email || !sig || !verifyUnsubscribeSignature(email, sig)) {
    return page("Error", "<h2>Invalid request</h2><p>This link is expired or invalid.</p>");
  }

  try {
    await unsubscribeContact(email);
  } catch {
    // Still show success – the contact may already be unsubscribed
  }

  return page(
    "Unsubscribed",
    `<h2 style="color:#2d5016;margin:0 0 15px;">You\u2019ve been unsubscribed</h2>
<p style="color:#666;">You will no longer receive marketing emails from My Horse Farm.</p>
<p style="margin-top:25px;"><a href="https://www.myhorsefarm.com" style="color:#2d5016;font-weight:bold;">Return to website</a></p>`,
  );
}
