// ---------------------------------------------------------------------------
// Database row types (mirror Supabase tables)
// ---------------------------------------------------------------------------

export interface ServicePricing {
  id: string;
  service_key: string;
  display_name: string;
  description: string;
  unit: "per_load" | "per_can" | "per_ton" | "per_yard" | "flat" | "per_sqft";
  base_rate: number;
  minimum_charge: number | null;
  requires_site_visit: boolean;
  is_recurring: boolean;
  frequency_options: string[] | null;
  active: boolean;
}

export interface ScheduleSettings {
  id: string;
  max_jobs_per_day: number;
  work_days: number[]; // 0=Sun..6=Sat
  blocked_dates: string[];
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  status: "pending" | "accepted" | "expired" | "declined" | "pending_site_visit";
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  service_key: string;
  property_details: Record<string, unknown>;
  estimated_amount: number;
  pricing_breakdown: PricingBreakdown;
  requires_site_visit: boolean;
  source: "form" | "chatbot";
  chat_session_id: string | null;
  hubspot_contact_id: string | null;
  hubspot_deal_id: string | null;
  expires_at: string;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  quote_id: string | null;
  status: "confirmed" | "completed" | "cancelled";
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  service_key: string;
  scheduled_date: string;
  time_slot: "morning" | "afternoon";
  hubspot_deal_id: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  messages: ChatMessage[];
  status: "active" | "resolved" | "handed_off";
  extracted_service: string | null;
  extracted_location: string | null;
  extracted_details: Record<string, unknown> | null;
  quote_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Pricing calculation types
// ---------------------------------------------------------------------------

export interface PricingBreakdown {
  base: number;
  adjustments: PricingAdjustment[];
  total: number;
}

export interface PricingAdjustment {
  label: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// API request/response types
// ---------------------------------------------------------------------------

export interface QuoteRequest {
  service_key: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  property_details: Record<string, unknown>;
  source?: "form" | "chatbot";
  chat_session_id?: string;
}

export interface BookingRequest {
  quote_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  service_key: string;
  scheduled_date: string;
  time_slot: "morning" | "afternoon";
}

export interface AvailabilityDay {
  date: string;
  day_of_week: number;
  slots_available: number;
  max_slots: number;
  status: "available" | "limited" | "full";
}
