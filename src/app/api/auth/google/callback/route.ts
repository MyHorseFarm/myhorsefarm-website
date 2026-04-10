import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Google OAuth callback — exchanges auth code for refresh token.
 * Only accessible with ADMIN_SECRET for security.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;">
        <h1 style="color:red;">Authorization Failed</h1>
        <p>Error: ${error}</p>
        <p>Please try again.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;">
        <h1>No code received</h1>
        <p>Please try the authorization again.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  // Exchange code for tokens
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${siteUrl}/api/auth/google/callback`,
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;">
          <h1 style="color:red;">Token Exchange Failed</h1>
          <p>${tokens.error}: ${tokens.error_description || ""}</p>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } },
      );
    }

    // Get user email
    let email = "unknown";
    if (tokens.access_token) {
      try {
        const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const profile = await profileRes.json();
        email = profile.email || "unknown";
      } catch { /* non-fatal */ }
    }

    // Log the refresh token server-side only — never expose in HTML
    if (tokens.refresh_token) {
      console.log(
        `[GOOGLE-AUTH] Refresh token for ${email} — check Vercel logs to retrieve it. Token starts with: ${tokens.refresh_token.slice(0, 8)}...`,
      );
      console.log(`[GOOGLE-AUTH] GMAIL_REFRESH_TOKEN=...${tokens.refresh_token.slice(-4)}`);
    }

    return new NextResponse(
      `<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;">
        <h1 style="color:#2d6a30;">Authorization Successful!</h1>
        <p>Account: <strong>${email}</strong></p>
        <p>Scopes: ${tokens.scope || "N/A"}</p>
        <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:20px 0;">
          <p style="margin:0 0 8px;font-weight:bold;">&#10003; Refresh token saved to server logs.</p>
          <p style="color:#666;font-size:14px;">Check your Vercel function logs to retrieve the <code>GMAIL_REFRESH_TOKEN</code> value.</p>
        </div>
        <p style="color:#666;font-size:14px;">You can close this tab now.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  } catch (err) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;">
        <h1 style="color:red;">Error</h1>
        <p>${String(err)}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }
}
