import { createHmac, timingSafeEqual } from "crypto";

const PORTAL_SECRET = () => {
  const secret = process.env.PORTAL_SECRET;
  if (!secret) throw new Error("PORTAL_SECRET not configured");
  return secret;
};
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type CustomerType = "recurring" | "quote" | "booking";

interface PortalPayload {
  email: string;
  customerId: string;
  customerType: CustomerType;
  expiresAt: number;
}

export function createPortalToken(email: string, customerId: string, customerType: CustomerType = "recurring"): string {
  const payload: PortalPayload = {
    email,
    customerId,
    customerType,
    expiresAt: Date.now() + EXPIRY_MS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", PORTAL_SECRET()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyPortalToken(
  token: string,
): { email: string; customerId: string; customerType: CustomerType } | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = createHmac("sha256", PORTAL_SECRET()).update(data).digest("base64url");
  const expectedBuf = Buffer.from(expected);
  const sigBuf = Buffer.from(sig);
  if (expectedBuf.length !== sigBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, sigBuf)) return null;

  try {
    const payload: PortalPayload = JSON.parse(
      Buffer.from(data, "base64url").toString(),
    );
    if (Date.now() > payload.expiresAt) return null;
    return {
      email: payload.email,
      customerId: payload.customerId,
      customerType: payload.customerType || "recurring",
    };
  } catch {
    return null;
  }
}

export function createPortalUrl(email: string, customerId: string, customerType: CustomerType = "recurring"): string {
  const token = createPortalToken(email, customerId, customerType);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  return `${base}/portal?token=${encodeURIComponent(token)}`;
}
