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
  peak_rate: number | null;
  peak_start_month: number | null;
  peak_end_month: number | null;
  premium_rate_multiplier: number | null;
  premium_description: string | null;
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
  status: "pending" | "accepted" | "booked" | "expired" | "declined" | "pending_site_visit";
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  service_key: string;
  property_details: Record<string, unknown>;
  estimated_amount: number;
  pricing_breakdown: PricingBreakdown;
  requires_site_visit: boolean;
  source: "form" | "chatbot" | "landing_page";
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
  /** Base64 data URI for user-uploaded photos (not persisted — stored as "[Photo attached]") */
  has_photo?: boolean;
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
  source?: "form" | "chatbot" | "landing_page";
  chat_session_id?: string;
  referral_code?: string;
  service_tier?: "standard" | "premium";
  utm_params?: Record<string, string>;
  event_id?: string;
  fbc?: string;
  fbp?: string;
}

// ---------------------------------------------------------------------------
// Referral type (mirrors referrals table)
// ---------------------------------------------------------------------------

export interface Referral {
  id: string;
  referrer_customer_id: string | null;
  referrer_name: string;
  referrer_email: string;
  referral_code: string;
  referee_name: string | null;
  referee_email: string | null;
  referee_quote_id: string | null;
  status: "pending" | "signed_up" | "completed" | "rewarded";
  referrer_reward_amount: number;
  referee_discount_amount: number;
  referrer_reward_applied: boolean;
  created_at: string;
  completed_at: string | null;
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
  utm_params?: Record<string, string>;
  event_id?: string;
  fbc?: string;
  fbp?: string;
}

export interface AvailabilityDay {
  date: string;
  day_of_week: number;
  slots_available: number;
  max_slots: number;
  status: "available" | "limited" | "full";
}

// ---------------------------------------------------------------------------
// Recurring customer type (mirrors recurring_customers table)
// ---------------------------------------------------------------------------

export interface RecurringCustomer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  square_customer_id: string | null;
  default_service: string;
  default_bin_rate: number;
  notes: string | null;
  signature_data: string | null;
  active: boolean;
  auto_charge: boolean;
  charge_frequency: "daily" | "weekly" | "biweekly" | "monthly" | null;
  next_charge_date: string | null;
  default_bins: number;
  contract_type: "month_to_month" | "6_month" | "annual";
  contract_start_date: string | null;
  contract_end_date: string | null;
  contract_discount_pct: number;
  auto_renew: boolean;
  sms_opted_in: boolean;
  last_review_request_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Crew member type (mirrors crew_members table)
// ---------------------------------------------------------------------------

export interface CrewMember {
  id: string;
  name: string;
  pin: string;
  phone: string | null;
  email: string | null;
  active: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Invoice type (mirrors invoices table)
// ---------------------------------------------------------------------------

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string | null;
  service_log_id: string | null;
  customer_name: string;
  customer_email: string | null;
  amount: number;
  service_description: string | null;
  service_date: string | null;
  sent_at: string | null;
  created_at: string;
}
