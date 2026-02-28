import { supabase } from "./supabase";
import type { ServicePricing, PricingBreakdown } from "./types";

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
 * Returns a breakdown showing base price and any adjustments.
 */
export function calculateQuote(
  service: ServicePricing,
  details: Record<string, unknown>,
): PricingBreakdown {
  const adjustments: { label: string; amount: number }[] = [];
  let base = 0;

  switch (service.unit) {
    case "per_load": {
      // e.g. Manure removal: $350 per 40-yard load
      const loads = Number(details.loads) || 1;
      base = service.base_rate * loads;
      break;
    }

    case "per_can": {
      // e.g. Trash bin service: $25 per can
      const cans = Number(details.cans) || 1;
      base = service.base_rate * cans;
      break;
    }

    case "per_ton": {
      const tons = Math.min(Number(details.estimated_tons) || 1, 10); // Max 10 tons per truck
      base = service.base_rate * tons;
      break;
    }

    case "per_yard": {
      const yards = Number(details.yards) || 1;
      base = service.base_rate * yards;
      break;
    }

    case "per_sqft": {
      const sqft = Number(details.sqft) || 1;
      base = service.base_rate * sqft;
      break;
    }

    case "flat":
    default: {
      base = service.base_rate;
      break;
    }
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
  } as ServicePricing;

  const breakdown = calculateQuote(service, details);
  return { estimated: breakdown.total, isRange: false };
}
