"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

interface PortalCustomer {
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

interface PortalData {
  customer: PortalCustomer;
  logs: ServiceLog[];
  invoices: Invoice[];
  upcoming: string[];
}

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

function PortalContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

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
    // Check URL for token first
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      sessionStorage.setItem("portal_token", urlToken);
      fetchData(urlToken);
      return;
    }
    // Check sessionStorage
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
      await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  // Login form state
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
                If you have an active account, we sent a login link to your email.
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">Loading your portal...</p>
      </div>
    );
  }

  // Error state
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

  const [subAction, setSubAction] = useState<"pause" | "cancel" | null>(null);
  const [cancelStep, setCancelStep] = useState<1 | 2 | 3>(1);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState("");

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
      // Refresh data
      fetchData(t);
    } catch {
      setSubMessage("Something went wrong. Please try again or call (561) 576-7667.");
    } finally {
      setSubLoading(false);
    }
  };

  // Authenticated dashboard
  const c = data.customer;
  const isPaused = c.active && !c.auto_charge;
  const isCancelled = !c.active;

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

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>My Horse Farm &middot; (561) 576-7667 &middot; myhorsefarm.com</p>
        </div>
      </div>
    </div>
  );
}
