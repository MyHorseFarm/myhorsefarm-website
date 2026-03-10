import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    // Compare against self to keep constant time, then return false
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Simple in-memory rate limiter for auth endpoints.
 * Tracks failed attempts by IP and blocks after threshold.
 */
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const record = failedAttempts.get(ip);
  if (!record) return false;
  if (Date.now() > record.resetAt) {
    failedAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const record = failedAttempts.get(ip);
  if (!record || Date.now() > record.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    record.count++;
  }
}

function clearAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

/**
 * Check admin Bearer token authentication.
 * Returns null if authorized, or an error Response if not.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again later." },
      { status: 429 },
    );
  }

  const auth = request.headers.get("authorization");
  const expected = process.env.ADMIN_SECRET;

  if (!auth || !expected) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.replace(/^Bearer\s+/i, "");

  if (!safeCompare(token, expected)) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  clearAttempts(ip);
  return null;
}

/**
 * Check crew PIN authentication.
 * Returns null if authorized, or an error Response if not.
 */
export function requireCrew(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again later." },
      { status: 429 },
    );
  }

  const pin = request.headers.get("x-crew-pin");
  const expected = process.env.CREW_PIN;

  if (!pin || !expected) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  if (!safeCompare(pin, expected)) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  clearAttempts(ip);
  return null;
}
