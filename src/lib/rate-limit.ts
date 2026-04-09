import { supabase } from "@/lib/supabase";

/**
 * Supabase-based rate limiter that works across serverless instances.
 * Falls back to allowing requests if Supabase is unavailable.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);

    // Upsert: increment count if within window, reset if expired
    const { data, error } = await supabase
      .from("rate_limits")
      .select("count, window_start")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.warn("Rate limit check failed, allowing request:", error.message);
      return { allowed: true, remaining: limit };
    }

    if (!data || new Date(data.window_start) < windowStart) {
      // No record or expired window — reset
      await supabase.from("rate_limits").upsert(
        { key, count: 1, window_start: now.toISOString() },
        { onConflict: "key" },
      );
      return { allowed: true, remaining: limit - 1 };
    }

    if (data.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    // Increment
    await supabase
      .from("rate_limits")
      .update({ count: data.count + 1 })
      .eq("key", key);

    return { allowed: true, remaining: limit - data.count - 1 };
  } catch (err) {
    // Rate limiting should never break the app
    console.warn("Rate limiter error, allowing request:", err);
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
