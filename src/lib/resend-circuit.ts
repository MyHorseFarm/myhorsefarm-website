// Circuit breaker for Resend provider hard failures (e.g. 403 domain not verified).
// In-memory, per-lambda. Short-circuits doomed sends during cooldown so we stop
// burning retries and rate limit on provider-level misconfiguration.

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitSnapshot {
  state: CircuitState;
  reason: string | null;
  openedAt: string | null;
  cooldownUntil: string | null;
  lastStatusCode: number | null;
  lastErrorMessage: string | null;
  failureCount: number;
  cooldownMs: number;
}

const COOLDOWN_MS = parseInt(
  process.env.EMAIL_CIRCUIT_COOLDOWN_MS || `${15 * 60 * 1000}`,
);

let state: CircuitState = "CLOSED";
let openedAt: number | null = null;
let cooldownUntil: number | null = null;
let reason: string | null = null;
let lastStatusCode: number | null = null;
let lastErrorMessage: string | null = null;
let failureCount = 0;

function toIso(ms: number | null): string | null {
  return ms == null ? null : new Date(ms).toISOString();
}

// Resend error shapes we've seen: { statusCode: 403, name, message }.
// Hard failures = provider-level misconfiguration that won't fix itself:
// 403 (auth/domain), or messages explicitly about unverified domains.
export function isHardProviderFailure(err: unknown): {
  hard: boolean;
  statusCode: number | null;
  message: string;
} {
  const e = (err || {}) as { statusCode?: number; name?: string; message?: string };
  const statusCode = typeof e.statusCode === "number" ? e.statusCode : null;
  const message = typeof e.message === "string" ? e.message : String(err ?? "");
  const lower = message.toLowerCase();
  const mentionsDomainVerification =
    (lower.includes("not verified") || lower.includes("verify")) &&
    lower.includes("domain");
  const hard = statusCode === 403 || mentionsDomainVerification;
  return { hard, statusCode, message };
}

export function isBlocked(now: number = Date.now()): boolean {
  if (state === "CLOSED") return false;
  if (state === "OPEN") {
    if (cooldownUntil != null && now >= cooldownUntil) {
      // Cooldown elapsed — allow a single probe.
      state = "HALF_OPEN";
      return false;
    }
    return true;
  }
  // HALF_OPEN: let the probe through.
  return false;
}

export function recordFailure(err: unknown): void {
  const { hard, statusCode, message } = isHardProviderFailure(err);
  if (!hard) return;
  failureCount += 1;
  lastStatusCode = statusCode;
  lastErrorMessage = message.slice(0, 500);
  reason = statusCode === 403 ? "resend_403_hard_failure" : "resend_domain_not_verified";
  state = "OPEN";
  openedAt = Date.now();
  cooldownUntil = openedAt + COOLDOWN_MS;
  console.error(
    `[EMAIL:CIRCUIT] OPEN reason=${reason} statusCode=${statusCode ?? "n/a"} cooldownUntil=${toIso(cooldownUntil)} message=${lastErrorMessage}`,
  );
}

export function recordSuccess(): void {
  if (state === "CLOSED") return;
  console.log(
    `[EMAIL:CIRCUIT] CLOSED prior_state=${state} prior_reason=${reason ?? "n/a"}`,
  );
  state = "CLOSED";
  openedAt = null;
  cooldownUntil = null;
  reason = null;
  lastStatusCode = null;
  lastErrorMessage = null;
  failureCount = 0;
}

export function snapshot(): CircuitSnapshot {
  return {
    state,
    reason,
    openedAt: toIso(openedAt),
    cooldownUntil: toIso(cooldownUntil),
    lastStatusCode,
    lastErrorMessage,
    failureCount,
    cooldownMs: COOLDOWN_MS,
  };
}

// Test-only: reset module state between runs.
export function _resetForTests(): void {
  state = "CLOSED";
  openedAt = null;
  cooldownUntil = null;
  reason = null;
  lastStatusCode = null;
  lastErrorMessage = null;
  failureCount = 0;
}
