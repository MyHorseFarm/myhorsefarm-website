import { createHmac, timingSafeEqual } from "crypto";

/**
 * General-purpose URL signing utility for protecting resource links
 * (quotes, invoices, bookings) against IDOR attacks.
 */

function getSecret(): string {
  return process.env.URL_SIGNING_SECRET || process.env.ADMIN_SECRET!;
}

/**
 * Generate an HMAC-SHA256 token for a resource.
 * @param resourceType - e.g. "quote", "invoice", "booking"
 * @param resourceId   - the UUID or ID of the resource
 */
export function generateSignedToken(
  resourceType: string,
  resourceId: string,
): string {
  return createHmac("sha256", getSecret())
    .update(`${resourceType}:${resourceId}`)
    .digest("hex");
}

/**
 * Verify an HMAC-SHA256 token for a resource using timing-safe comparison.
 * @param resourceType - e.g. "quote", "invoice", "booking"
 * @param resourceId   - the UUID or ID of the resource
 * @param token        - the token to verify
 */
export function verifySignedToken(
  resourceType: string,
  resourceId: string,
  token: string,
): boolean {
  const expected = createHmac("sha256", getSecret())
    .update(`${resourceType}:${resourceId}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected);
  const tokenBuf = Buffer.from(token);
  if (expectedBuf.length !== tokenBuf.length) return false;
  return timingSafeEqual(expectedBuf, tokenBuf);
}

/**
 * Build a signed URL for a resource.
 * @param path         - e.g. "/quote/abc-123" or "/api/invoice/abc-123"
 * @param resourceType - e.g. "quote", "invoice"
 * @param resourceId   - the UUID or ID of the resource
 */
export function buildSignedUrl(
  path: string,
  resourceType: string,
  resourceId: string,
): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  const token = generateSignedToken(resourceType, resourceId);
  return `${base}${path}?token=${token}`;
}
