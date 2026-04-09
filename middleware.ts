import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin routes: require Bearer ADMIN_SECRET ---
  if (pathname.startsWith("/api/admin")) {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }
    const auth = request.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = auth.slice(7);
    if (!timingSafeCompare(token, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // --- Cron routes: require Bearer CRON_SECRET ---
  if (pathname.startsWith("/api/cron")) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }
    const auth = request.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = auth.slice(7);
    if (!timingSafeCompare(token, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // --- Crew routes: require x-crew-pin header (route handles PIN validation) ---
  if (pathname.startsWith("/api/crew")) {
    const pin = request.headers.get("x-crew-pin");
    if (!pin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/cron/:path*", "/api/crew/:path*"],
};
