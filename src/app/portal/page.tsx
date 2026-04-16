"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Types — Recurring customer (existing)
// ---------------------------------------------------------------------------

interface RecurringCustomerInfo {
  name: string;
  email: string;
  address: string | null;
  service: string;
  rate: number;
  frequency: string | null;
  active: boolean;
  auto_charge: boolean;
  contract_type: string;
  contract_end_date: string | null;
  contract_discount_pct: number;
}

interface ServiceLog {
  id: string;
  service_date: string;
  bins_collected: number;
  bin_rate: number;
  total_amount: number;
  status: string;
  crew_member: string | null;
  photo_url: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  service_date: string | null;
}

interface RecurringData {
  customerType: "recurring";
  customer: RecurringCustomerInfo;
  logs: ServiceLog[];
  invoices: Invoice[];
  upcoming: string[];
}

// ---------------------------------------------------------------------------
// Types — Quote / Booking customers
// ---------------------------------------------------------------------------

interface PortalQuote {
  id: string;
  quote_number: string;
  status: string;
  customer_name?: string;
  service_key: string;
  estimated_amount: number;
  pricing_breakdown: { base: number; adjustments: { label: string; amount: number }[]; total: number } | null;
  created_at: string;
  expires_at: string;
}

interface PortalBooking {
  id: string;
  booking_number: string;
  status: string;
  customer_name?: string;
  service_key: string;
  scheduled_date: string;
  time_slot: string;
  created_at: string;
}

interface QuoteBookingCustomerInfo {
  name: string;
  email: string;
}

interface QuoteData {
  customerType: "quote";
  customer: QuoteBookingCustomerInfo;
  quotes: PortalQuote[];
  bookings: PortalBooking[];
}

interface BookingData {
  customerType: "booking";
  customer: QuoteBookingCustomerInfo;
  bookings: PortalBooking[];
  quotes: PortalQuote[];
}

type PortalData = RecurringData | QuoteData | BookingData;

// ---------------------------------------------------------------------------
// Page wrapper
// ---------------------------------------------------------------------------

export default function PortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <PortalContent />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------

function PortalContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Subscription management state (recurring only)
  const [subAction, setSubAction] = useState<"pause" | "cancel" | null>(null);
  const [cancelStep, setCancelStep] = useState<1 | 2 | 3>(1);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState("");

  const fetchData = useCallback(async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portal/data", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setToken(null);
          sessionStorage.removeItem("portal_token");
          setError("Your link has expired. Please request a new one.");
          return;
        }
        throw new Error("Failed to load");
      }
      const json = await res.json();
      setData(json);
      trackEvent("portal_login", { customer_name: json.customer?.name });
    } catch {
      setError("Failed to load portal data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      sessionStorage.setItem("portal_token", urlToken);
      fetchData(urlToken);
      return;
    }
    const saved = sessionStorage.getItem("portal_token");
    if (saved) {
      setToken(saved);
      fetchData(saved);
    }
  }, [searchParams, fetchData]);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  // ---- Login form ----
  if (!token && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-900">Customer Portal</h1>
            <p className="text-gray-500 text-sm mt-1">My Horse Farm</p>
          </div>
          {sent ? (
            <div className="text-center">
              <p className="text-green-700 font-medium mb-2">Check your email!</p>
              <p className="text-sm text-gray-500">
                If we have your email on file, we sent a login link. Check your inbox (and spam folder).
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestLink}>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <label className="block text-sm font-medium mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="you@example.com"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700"
              >
                Send Login Link
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ---- Loading ----
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">Loading your portal...</p>
      </div>
    );
  }

  // ---- Error ----
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <p className="text-red-600 mb-4">{error || "Unable to load portal."}</p>
          <button
            onClick={() => { setToken(null); sessionStorage.removeItem("portal_token"); setError(""); }}
            className="text-green-800 underline text-sm"
          >
            Request a new link
          </button>
        </div>
      </div>
    );
  }

  // ---- Recurring customer dashboard ----
  if (data.customerType === "recurring") {
    return (
      <RecurringDashboard
        data={data}
        token={token}
        fetchData={fetchData}
        subAction={subAction}
        setSubAction={setSubAction}
        cancelStep={cancelStep}
        setCancelStep={setCancelStep}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        cancelFeedback={cancelFeedback}
        setCancelFeedback={setCancelFeedback}
        subLoading={subLoading}
        setSubLoading={setSubLoading}
        subMessage={subMessage}
        setSubMessage={setSubMessage}
      />
    );
  }

  // ---- Quote / Booking customer dashboard ----
  return <QuoteBookingDashboard data={data} />;
}

// ---------------------------------------------------------------------------
// Recurring customer dashboard (existing behavior)
// ---------------------------------------------------------------------------

function RecurringDashboard({
  data,
  token,
  fetchData,
  subAction,
  setSubAction,
  cancelStep,
  setCancelStep,
  cancelReason,
  setCancelReason,
  cancelFeedback,
  setCancelFeedback,
  subLoading,
  setSubLoading,
  subMessage,
  setSubMessage,
}: {
  data: RecurringData;
  token: string | null;
  fetchData: (t: string) => Promise<void>;
  subAction: "pause" | "cancel" | null;
  setSubAction: (a: "pause" | "cancel" | null) => void;
  cancelStep: 1 | 2 | 3;
  setCancelStep: (s: 1 | 2 | 3) => void;
  cancelReason: string;
  setCancelReason: (r: string) => void;
  cancelFeedback: string;
  setCancelFeedback: (f: string) => void;
  subLoading: boolean;
  setSubLoading: (l: boolean) => void;
  subMessage: string;
  setSubMessage: (m: string) => void;
}) {
  const c = data.customer;
  const isPaused = c.active && !c.auto_charge;
  const isCancelled = !c.active;

  const handleSubscriptionAction = async (action: "pause" | "resume" | "cancel", reason?: string, feedback?: string) => {
    const t = token || sessionStorage.getItem("portal_token");
    if (!t) return;
    setSubLoading(true);
    setSubMessage("");
    try {
      const res = await fetch("/api/portal/subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason, feedback }),
      });
      if (!res.ok) throw new Error("Failed");
      const msgs: Record<string, string> = {
        pause: "Service paused. You can resume anytime.",
        resume: "Service resumed! Next service coming soon.",
        cancel: "Service cancelled. We're sorry to see you go.",
      };
      setSubMessage(msgs[action] || "Updated.");
      trackEvent(`subscription_${action}`, { reason });
      setSubAction(null);
      setCancelStep(1);
      fetchData(t);
    } catch {
      setSubMessage("Something went wrong. Please try again or call (561) 576-7667.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-900">Welcome, {c.name.split(" ")[0]}</h1>
          <p className="text-sm text-gray-500">
            {(c.service || "").replace(/_/g, " ")}
            {c.frequency && ` \u00b7 ${c.frequency}`}
            {c.contract_type !== "month_to_month" && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                {c.contract_type === "annual" ? "Annual" : "6-Month"} ({c.contract_discount_pct}% off)
              </span>
            )}
          </p>
        </div>

        {/* Upcoming services */}
        {data.upcoming.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-sm font-semibold mb-3">Upcoming Services</h2>
            <div className="flex flex-wrap gap-2">
              {data.upcoming.map((date) => (
                <span
                  key={date}
                  className="bg-green-50 text-green-800 text-xs px-3 py-1.5 rounded font-medium"
                >
                  {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Management */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-sm font-semibold mb-3">Manage Subscription</h2>
          {subMessage && (
            <div className="text-sm bg-green-50 text-green-800 px-3 py-2 rounded mb-3">{subMessage}</div>
          )}
          {isCancelled ? (
            <div className="text-sm text-gray-500">
              Your service is cancelled. Want to come back?{" "}
              <a href="/enroll" className="text-green-800 underline font-medium">Re-enroll here</a> or call (561) 576-7667.
            </div>
          ) : subAction === "cancel" ? (
            <div>
              {cancelStep === 1 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">We&rsquo;re sorry to hear that. Can you tell us why?</p>
                  {["Too expensive", "Don't need the service anymore", "Switching to another provider", "Service quality", "Other"].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setCancelReason(r); setCancelStep(2); }}
                      className="block w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100 border mb-1"
                    >
                      {r}
                    </button>
                  ))}
                  <button onClick={() => setSubAction(null)} className="text-xs text-gray-400 mt-2">Never mind</button>
                </div>
              )}
              {cancelStep === 2 && (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-green-800 mb-1">Before you go — how about 10% off?</p>
                    <p className="text-xs text-green-700">Switch to an annual plan and save 10% on every service. That&rsquo;s real money back in your pocket.</p>
                    <button
                      onClick={() => { setSubAction(null); setCancelStep(1); setSubMessage("Great! Call us at (561) 576-7667 to switch to annual."); }}
                      className="mt-2 bg-green-800 text-white text-xs px-4 py-1.5 rounded font-semibold"
                    >
                      Switch to Annual (Save 10%)
                    </button>
                  </div>
                  <button
                    onClick={() => setCancelStep(3)}
                    className="text-xs text-gray-400 underline"
                  >
                    No thanks, continue cancellation
                  </button>
                </div>
              )}
              {cancelStep === 3 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Any feedback for us? (optional)</p>
                  <textarea
                    value={cancelFeedback}
                    onChange={(e) => setCancelFeedback(e.target.value)}
                    rows={2}
                    className="w-full border rounded px-3 py-2 text-sm mb-3"
                    placeholder="What could we do better?"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubscriptionAction("cancel", cancelReason, cancelFeedback)}
                      disabled={subLoading}
                      className="bg-red-600 text-white text-sm px-4 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {subLoading ? "Cancelling..." : "Confirm Cancellation"}
                    </button>
                    <button onClick={() => { setSubAction(null); setCancelStep(1); }} className="text-sm text-gray-400">
                      Keep my service
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {isPaused ? (
                <button
                  onClick={() => handleSubscriptionAction("resume")}
                  disabled={subLoading}
                  className="bg-green-800 text-white text-sm px-4 py-2 rounded font-semibold disabled:opacity-50"
                >
                  {subLoading ? "Resuming..." : "Resume Service"}
                </button>
              ) : (
                <button
                  onClick={() => handleSubscriptionAction("pause", "Customer requested pause")}
                  disabled={subLoading}
                  className="bg-amber-500 text-white text-sm px-4 py-2 rounded font-semibold disabled:opacity-50"
                >
                  {subLoading ? "Pausing..." : "Pause Service"}
                </button>
              )}
              <button
                onClick={() => setSubAction("cancel")}
                className="text-sm text-red-500 hover:text-red-700 px-4 py-2"
              >
                Cancel Service
              </button>
              {isPaused && (
                <span className="text-xs text-amber-600 self-center">Service is currently paused</span>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Service History */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-semibold mb-3">
              Service History ({data.logs.length})
            </h2>
            {data.logs.length === 0 ? (
              <p className="text-xs text-gray-400">No service logs yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.logs.map((log) => (
                  <div key={log.id} className="border rounded p-3 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{log.service_date}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          log.status === "charged"
                            ? "bg-green-100 text-green-800"
                            : log.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      {log.bins_collected} x ${Number(log.bin_rate).toFixed(2)} = ${Number(log.total_amount).toFixed(2)}
                    </p>
                    {log.photo_url && (
                      <a href={log.photo_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1">
                        <img src={log.photo_url} alt="Service" className="w-12 h-12 object-cover rounded border" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-semibold mb-3">
              Invoices ({data.invoices.length})
            </h2>
            {data.invoices.length === 0 ? (
              <p className="text-xs text-gray-400">No invoices yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.invoices.map((inv) => (
                  <div key={inv.id} className="border rounded p-3 text-sm flex justify-between items-center">
                    <div>
                      <a
                        href={`/api/invoice/${inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline font-medium"
                      >
                        {inv.invoice_number}
                      </a>
                      {inv.service_date && (
                        <span className="text-gray-400 text-xs ml-2">{inv.service_date}</span>
                      )}
                    </div>
                    <span className="font-medium">${Number(inv.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat with Us */}
        <div className="text-center mt-6">
          <a
            href="/quote"
            className="inline-block bg-green-800 text-white text-sm px-6 py-2.5 rounded font-semibold hover:bg-green-700"
          >
            Request New Service
          </a>
        </div>

        <PortalFooter />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quote / Booking customer dashboard
// ---------------------------------------------------------------------------

function QuoteBookingDashboard({ data }: { data: QuoteData | BookingData }) {
  const name = data.customer.name.split(" ")[0];
  const quotes = data.quotes || [];
  const bookings = data.bookings || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-900">Welcome, {name}</h1>
          <p className="text-sm text-gray-500">
            Here is an overview of your quotes and bookings with My Horse Farm.
          </p>
        </div>

        {/* Bookings */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-sm font-semibold mb-3">Your Bookings ({bookings.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bookings.map((b) => (
                <div key={b.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{b.booking_number}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        {(b.service_key || "").replace(/_/g, " ")}
                      </span>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(b.scheduled_date + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" "}&middot; {b.time_slot === "morning" ? "Morning (8am-12pm)" : "Afternoon (12pm-5pm)"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quotes */}
        {quotes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-sm font-semibold mb-3">Your Quotes ({quotes.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {quotes.map((q) => (
                <div key={q.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{q.quote_number}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        {(q.service_key || "").replace(/_/g, " ")}
                      </span>
                    </div>
                    <StatusBadge status={q.status} />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600 text-xs">
                      {new Date(q.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <span className="font-medium text-green-800">
                      ${Number(q.estimated_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {quotes.length === 0 && bookings.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 mb-6 text-center">
            <p className="text-gray-500 text-sm">No quotes or bookings found.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <a
            href="/quote"
            className="inline-block bg-green-800 text-white text-sm px-6 py-2.5 rounded font-semibold hover:bg-green-700"
          >
            Request New Service
          </a>
          <a
            href="tel:+15615767667"
            className="inline-block border border-green-800 text-green-800 text-sm px-6 py-2.5 rounded font-semibold hover:bg-green-50"
          >
            Call (561) 576-7667
          </a>
        </div>

        <PortalFooter />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-blue-100 text-blue-800",
    booked: "bg-green-100 text-green-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-500",
    declined: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
    pending_site_visit: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PortalFooter() {
  return (
    <div className="text-center mt-8 text-xs text-gray-400">
      <p>My Horse Farm &middot; (561) 576-7667 &middot; myhorsefarm.com</p>
    </div>
  );
}
