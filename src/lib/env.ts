/**
 * Environment variable validation utilities.
 * Use requireEnv() for lazy validation — only throws when the var is actually needed.
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Check your .env.local file or Vercel environment settings.`,
    );
  }
  return value;
}

// Lazy getters — only validate when accessed
export const getHubSpotToken = () => requireEnv("HUBSPOT_API_TOKEN");
export const getSquareToken = () => requireEnv("SQUARE_ACCESS_TOKEN");
export const getSupabaseUrl = () => requireEnv("SUPABASE_URL");
export const getSupabaseKey = () => requireEnv("SUPABASE_SERVICE_ROLE_KEY");
export const getAnthropicKey = () => requireEnv("ANTHROPIC_API_KEY");
export const getResendKey = () => requireEnv("RESEND_API_KEY");
export const getCronSecret = () => requireEnv("CRON_SECRET");
export const getAdminSecret = () => requireEnv("ADMIN_SECRET");
