import { supabase } from "./supabase";
import type { ServicePricing, PricingBreakdown } from "./types";

/**
 * Check if the current month falls within the peak season range.
 * Handles wrap-around (e.g., Oct–Apr where start > end).
 */
export function isPeakSeason(
  peakStart: number | null,
  peakEnd: number | null,
  month?: number,
): boolean {
  if (peakStart == null || peakEnd == null) return false;
  const m = month ?? new Date().getMonth() + 1; // 1-based
  if (peakStart <= peakEnd) {
    return m >= peakStart && m <= peakEnd;
  }
  // Wrap-around: e.g. Oct(10) to Apr(4)
  return m >= peakStart || m <= peakEnd;
}

/**
 * Get the effective rate for a service (peak or base).
 */
export function getEffectiveRate(service: ServicePricing): number {
  if (
    service.peak_rate != null &&
    isPeakSeason(service.peak_start_month, service.peak_end_month)
  ) {
    return service.peak_rate;
  }
  return service.base_rate;
}

export async function getActiveServices(): Promise<ServicePricing[]> {
  const { data, error } = await supabase
    .from("service_pricing")
    .select("*")
    .eq("active", true)
    .order("display_name");

  if (error) throw new Error(`Supabase: ${error.message}`);
  return data as ServicePricing[];
}

export async function getServiceByKey(
  serviceKey: string,
): Promise<ServicePricing | null> {
  const { data, error } = await supabase
    .from("service_pricing")
    .select("*")
    .eq("service_key", serviceKey)
    .eq("active", true)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(`Supabase: ${error.message}`);
  return (data as ServicePricing) ?? null;
}

/**
 * Server-side authoritative price calculation.
 * Uses peak rate when current month is in peak season.
 * Returns a breakdown showing base price and any adjustments.
 */
export function calculateQuote(
  service: ServicePricing,
  details: Record<string, unknown>,
): PricingBreakdown {
  const adjustments: { label: string; amount: number }[] = [];
  const rate = getEffectiveRate(service);
  const usingPeak = rate !== service.base_rate;
  let base = 0;

  switch (service.unit) {
    case "per_load": {
      const loads = Number(details.loads) || 1;
      base = rate * loads;
      break;
    }

    case "per_can": {
      const cans = Number(details.cans) || 1;
      base = rate * cans;
      break;
    }

    case "per_ton": {
      const tons = Math.min(Number(details.estimated_tons) || 1, 10);
      base = rate * tons;
      break;
    }

    case "per_yard": {
      const yards = Number(details.yards) || 1;
      base = rate * yards;
      break;
    }

    case "per_sqft": {
      const sqft = Number(details.sqft) || 1;
      base = rate * sqft;
      break;
    }

    case "flat":
    default: {
      base = rate;
      break;
    }
  }

  if (usingPeak) {
    adjustments.push({
      label: "Peak season rate (in effect)",
      amount: 0, // informational — already reflected in base
    });
  }

  // Apply minimum charge
  if (service.minimum_charge && base < service.minimum_charge) {
    adjustments.push({
      label: "Minimum charge applied",
      amount: service.minimum_charge - base,
    });
    base = service.minimum_charge;
  }

  const total = base + adjustments.reduce((sum, a) => sum + a.amount, 0);

  return {
    base: Math.round(base * 100) / 100,
    adjustments: adjustments.map((a) => ({
      ...a,
      amount: Math.round(a.amount * 100) / 100,
    })),
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Client-side preview calculation (uses same logic but accepts service data directly).
 */
export function calculatePreview(
  baseRate: number,
  unit: ServicePricing["unit"],
  minimumCharge: number | null,
  details: Record<string, unknown>,
): { estimated: number; isRange: boolean; low?: number; high?: number } {
  const service = {
    base_rate: baseRate,
    unit,
    minimum_charge: minimumCharge,
    peak_rate: null,
    peak_start_month: null,
    peak_end_month: null,
  } as ServicePricing;

  const breakdown = calculateQuote(service, details);
  return { estimated: breakdown.total, isRange: false };
}
