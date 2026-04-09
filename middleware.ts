import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

function timingSafeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
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
