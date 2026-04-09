import { supabase } from "@/lib/supabase";

/**
 * Supabase-based rate limiter that works across serverless instances.
 * Uses atomic upsert with raw SQL increment to prevent race conditions.
 * Falls back to allowing requests if Supabase is unavailable.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const windowStart = new Date(
      Date.now() - windowSeconds * 1000,
    ).toISOString();

    // Atomic upsert: insert with count=1 or increment count if within window.
    // If the window has expired, reset count to 1 and update window_start.
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_start: windowStart,
    });

    if (error) {
      // If the RPC doesn't exist yet, fall back to non-atomic approach
      if (error.message.includes("check_rate_limit")) {
        return checkRateLimitFallback(key, limit, windowSeconds);
      }
      console.warn("Rate limit check failed, allowing request:", error.message);
      return { allowed: true, remaining: limit };
    }

    const count = data as number;
    const allowed = count <= limit;
    return { allowed, remaining: Math.max(0, limit - count) };
  } catch (err) {
    // Rate limiting should never break the app
    console.warn("Rate limiter error, allowing request:", err);
    return { allowed: true, remaining: limit };
  }
}

/**
 * Fallback non-atomic rate limiter (used if the RPC doesn't exist yet).
 */
async function checkRateLimitFallback(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);

    const { data, error } = await supabase
      .from("rate_limits")
      .select("count, window_start")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.warn("Rate limit fallback failed, allowing request:", error.message);
      return { allowed: true, remaining: limit };
    }

    if (!data || new Date(data.window_start) < windowStart) {
      await supabase.from("rate_limits").upsert(
        { key, count: 1, window_start: now.toISOString() },
        { onConflict: "key" },
      );
      return { allowed: true, remaining: limit - 1 };
    }

    if (data.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    await supabase
      .from("rate_limits")
      .update({ count: data.count + 1 })
      .eq("key", key);

    return { allowed: true, remaining: limit - data.count - 1 };
  } catch (err) {
    console.warn("Rate limiter fallback error, allowing request:", err);
    return { allowed: true, remaining: limit };
  }
}

/**
 * Convenience wrapper using IP + route as the rate limit key.
 */
export async function rateLimit(
  ip: string,
  route: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `${route}:${ip}`;
  return checkRateLimit(key, limit, windowSeconds);
}
