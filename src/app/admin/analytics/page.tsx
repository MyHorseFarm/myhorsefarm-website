"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";
import { csvFromArray, downloadCsv } from "@/lib/csv-export";

interface SupabaseSummary {
  totalRevenue: number;
  chargedCount: number;
  failedCount: number;
  pendingCount: number;
  totalCustomers: number;
  activeCustomers: number;
  autoChargeCustomers: number;
  totalQuotes: number;
  quotesAccepted: number;
  quoteConversion: number;
  totalBookings: number;
  invoiceTotal: number;
}

interface AnalyticsData {
  summary: SupabaseSummary;
  revenueByDay: Record<string, number>;
  revenueByCrew: Record<string, number>;
  serviceBreakdown: Record<string, number>;
}

interface SquarePayment {
  id: string;
  status: string;
  amountCents: number;
  currency: string;
  customerId: string | null;
  orderId: string | null;
  receiptUrl: string | null;
  note: string | null;
  createdAt: string;
  refundedAmountCents: number;
  sourceType: string | null;
  last4: string | null;
  cardBrand: string | null;
  customerName: string;
  service: string;
}

const SERVICE_LABELS: Record<string, string> = {
  trash_bin_service: "Trash Bin Service",
  manure_removal: "Manure Removal",
  junk_removal: "Junk Removal",
  fill_dirt: "Fill Dirt Delivery",
  dumpster_rental: "Dumpster Rental",
  sod_installation: "Sod Installation",
  farm_repairs: "Farm Repairs",
  millings_asphalt: "Millings Asphalt",
};

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  APPROVED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-200 text-gray-600",
};

function fmt(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDollars(dollars: number): string {
  return "$" + dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return sign + pct.toFixed(1) + "%";
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function dateStr(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AnalyticsPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState(30);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [payments, setPayments] = useState<SquarePayment[]>([]);
  const [prevPayments, setPrevPayments] = useState<SquarePayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 15;
  const [refundTarget, setRefundTarget] = useState<SquarePayment | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refunding, setRefunding] = useState(false);
  const [refundMsg, setRefundMsg] = useState("");

  const hdrs = useCallback((t?: string) => adminHeaders(t || token || undefined), [token]);

  const fetchAnalytics = useCallback(async (days: number, authToken?: string) => {
    try {
      const res = await fetch(`/api/admin/analytics?range=\${days}`, { headers: hdrs(authToken) });
      if (!res.ok) throw new Error("Unauthorized");
      const json = await res.json();
      setAnalytics(json);
      setAuthed(true);
    } catch { setError("Failed to load analytics"); }
  }, [hdrs]);

  const fetchPayments = useCallback(async (from: string, to: string, authToken?: string) => {
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams({ from, to });
      const res = await fetch(`/api/admin/payments?\${params}`, { headers: hdrs(authToken) });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setPayments(json.payments || []);
    } catch { setPayments([]); } finally { setPaymentsLoading(false); }
  }, [hdrs]);

  const fetchPrevPayments = useCallback(async (days: number, authToken?: string) => {
    try {
      const from = daysAgo(days * 2);
      const to = daysAgo(days);
      const params = new URLSearchParams({ from, to });
      const res = await fetch(`/api/admin/payments?\${params}`, { headers: hdrs(authToken) });
      if (!res.ok) return;
      const json = await res.json();
      setPrevPayments(json.payments || []);
    } catch { setPrevPayments([]); }
  }, [hdrs]);

  const loadAll = useCallback(async (days: number, authToken?: string) => {
    setLoading(true);
    setError("");
    const from = daysAgo(days);
    const to = new Date().toISOString();
    await Promise.all([fetchAnalytics(days, authToken), fetchPayments(from, to, authToken), fetchPrevPayments(days, authToken)]);
    setLoading(false);
  }, [fetchAnalytics, fetchPayments, fetchPrevPayments]);

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) { setToken(saved); loadAll(range, saved); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setError(""); setAdminToken(token); await loadAll(range, token); };
  const handleRangeChange = (days: number) => { setRange(days); setShowCustom(false); setPage(0); if (authed) loadAll(days); };
  const handleCustomRange = () => { if (!customFrom || !customTo) return; setPage(0); fetchPayments(new Date(customFrom).toISOString(), new Date(customTo + "T23:59:59").toISOString()); };

  const handleRefund = async () => {
    if (!refundTarget || !refundAmount) return;
    setRefunding(true); setRefundMsg("");
    try {
      const res = await fetch("/api/admin/payments", { method: "POST", headers: hdrs(), body: JSON.stringify({ paymentId: refundTarget.id, amount: parseFloat(refundAmount), reason: refundReason || "Admin refund" }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Refund failed");
      setRefundMsg("Refund " + json.refundId + " processed - " + json.status);
      fetchPayments(daysAgo(range), new Date().toISOString());
    } catch (err) { setRefundMsg(err instanceof Error ? err.message : "Refund failed"); } finally { setRefunding(false); }
  };

  const filteredPayments = payments.filter((p) => search ? p.customerName.toLowerCase().includes(search.toLowerCase()) || p.service.toLowerCase().includes(search.toLowerCase()) : true);
  const pagedPayments = filteredPayments.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const completedPayments = payments.filter((p) => p.status === "COMPLETED" || p.status === "APPROVED");
  const totalRevenue = completedPayments.reduce((s, p) => s + p.amountCents, 0);
  const totalCount = payments.length;
  const avgPayment = completedPayments.length ? totalRevenue / completedPayments.length : 0;
  const totalRefunds = payments.reduce((s, p) => s + p.refundedAmountCents, 0);
  const prevCompleted = prevPayments.filter((p) => p.status === "COMPLETED" || p.status === "APPROVED");
  const prevRevenue = prevCompleted.reduce((s, p) => s + p.amountCents, 0);
  const prevCount = prevPayments.length;
  const prevAvg = prevCompleted.length ? prevRevenue / prevCompleted.length : 0;
  const prevRefunds = prevPayments.reduce((s, p) => s + p.refundedAmountCents, 0);

  const revByDay: Record<string, number> = {};
  for (const p of completedPayments) { const d = p.createdAt.split("T")[0]; revByDay[d] = (revByDay[d] || 0) + p.amountCents; }
  const sortedDays = Object.entries(revByDay).sort(([a], [b]) => a.localeCompare(b));
  const maxDayRev = Math.max(...sortedDays.map(([, v]) => v), 1);

  const revByService: Record<string, number> = {};
  for (const p of completedPayments) { const svc = p.service || "Other"; revByService[svc] = (revByService[svc] || 0) + p.amountCents; }
  const serviceEntries = Object.entries(revByService).sort(([, a], [, b]) => b - a);
  const maxSvcRev = Math.max(...serviceEntries.map(([, v]) => v), 1);
  const crewEntries = Object.entries(analytics?.revenueByCrew ?? {}).sort(([, a], [, b]) => b - a);

  const exportCSV = () => {
    const rows = filteredPayments.map((p) => ({ date: dateStr(p.createdAt), customer: p.customerName, amount: (p.amountCents / 100).toFixed(2), status: p.status, service: p.service, refunded: (p.refundedAmountCents / 100).toFixed(2), receipt: p.receiptUrl || "" }));
    const csv = csvFromArray(rows, [{ key: "date", label: "Date" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }, { key: "service", label: "Service" }, { key: "refunded", label: "Refunded" }, { key: "receipt", label: "Receipt URL" }]);
    downloadCsv(csv, "payments-" + range + "d.csv");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <input type="password" placeholder="Admin token" value={token} onChange={(e) => setToken(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" required />
          <button type="submit" className="w-full bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-green-900">Payments Dashboard</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={exportCSV} disabled={!payments.length} className="border border-gray-400 text-gray-700 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 disabled:opacity-50">Export CSV</button>
            {[7, 30, 90].map((d) => (
              <button key={d} onClick={() => handleRangeChange(d)} className={`px-3 py-1 rounded text-sm font-medium \${range === d && !showCustom ? "bg-green-800 text-white" : "bg-white border text-gray-700 hover:bg-gray-50"}`}>{d}d</button>
            ))}
            <button onClick={() => setShowCustom(!showCustom)} className={`px-3 py-1 rounded text-sm font-medium \${showCustom ? "bg-green-800 text-white" : "bg-white border text-gray-700 hover:bg-gray-50"}`}>Custom</button>
          </div>
        </div>

        {showCustom && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="border rounded px-2 py-1 text-sm" />
            <span className="text-gray-500">to</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="border rounded px-2 py-1 text-sm" />
            <button onClick={handleCustomRange} className="bg-green-800 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700">Apply</button>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (<div className="text-center py-20 text-gray-500">Loading...</div>) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{fmt(totalRevenue)}</p>
                <p className={`text-xs mt-1 \${totalRevenue >= prevRevenue ? "text-green-600" : "text-red-600"}`}>{pctChange(totalRevenue, prevRevenue)} vs prev period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Payments</p>
                <p className="text-2xl font-bold mt-1">{totalCount}</p>
                <p className={`text-xs mt-1 \${totalCount >= prevCount ? "text-green-600" : "text-red-600"}`}>{pctChange(totalCount, prevCount)} vs prev period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Payment</p>
                <p className="text-2xl font-bold mt-1">{fmt(avgPayment)}</p>
                <p className={`text-xs mt-1 \${avgPayment >= prevAvg ? "text-green-600" : "text-red-600"}`}>{pctChange(avgPayment, prevAvg)} vs prev period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Refunds</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{fmt(totalRefunds)}</p>
                <p className="text-xs mt-1 text-gray-400">{pctChange(totalRefunds, prevRefunds)} vs prev</p>
              </div>
            </div>

            {analytics?.summary && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Active Customers</p>
                  <p className="text-2xl font-bold mt-1">{analytics.summary.activeCustomers}</p>
                  <p className="text-xs text-gray-400">{analytics.summary.autoChargeCustomers} auto-charge</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Quotes</p>
                  <p className="text-2xl font-bold mt-1">{analytics.summary.totalQuotes}</p>
                  <p className="text-xs text-gray-400">{(analytics.summary.quoteConversion * 100).toFixed(0)}% conversion</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bookings</p>
                  <p className="text-2xl font-bold mt-1">{analytics.summary.totalBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Charge Issues</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{analytics.summary.failedCount}</p>
                  <p className="text-xs text-gray-400">{analytics.summary.pendingCount} pending</p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {sortedDays.length > 0 && (
                <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
                  <h2 className="text-sm font-semibold text-green-900 mb-3">Revenue by Day (Square)</h2>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {sortedDays.map(([day, rev]) => (
                      <div key={day} className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-gray-500 shrink-0">{shortDate(day + "T00:00:00")}</span>
                        <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                          <div className="bg-green-600 h-full rounded" style={{ width: `\${(rev / maxDayRev) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right font-medium">{fmt(rev)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {serviceEntries.length > 0 && (
                <div className="bg-white rounded-lg shadow p-5">
                  <h2 className="text-sm font-semibold text-green-900 mb-3">Revenue by Service</h2>
                  <div className="space-y-2">
                    {serviceEntries.map(([svc, rev]) => (
                      <div key={svc} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-gray-700">{SERVICE_LABELS[svc] || svc}</span>
                        <div className="w-24 bg-gray-100 rounded h-4 overflow-hidden">
                          <div className="bg-blue-500 h-full rounded" style={{ width: `\${(rev / maxSvcRev) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right font-medium text-sm">{fmt(rev)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {crewEntries.length > 0 && (
                <div className="bg-white rounded-lg shadow p-5">
                  <h2 className="text-sm font-semibold text-green-900 mb-3">Revenue by Crew</h2>
                  <div className="space-y-2">
                    {crewEntries.map(([crew, rev]) => (
                      <div key={crew} className="flex justify-between text-sm">
                        <span className="text-gray-700">{crew}</span>
                        <span className="font-medium">{fmtDollars(rev)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-5 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-sm font-semibold text-green-900">Square Payments {paymentsLoading && <span className="text-gray-400 font-normal">Loading...</span>}</h2>
                <input type="text" placeholder="Search customer or service..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="border rounded px-3 py-1.5 text-sm w-full sm:w-64" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500 uppercase">
                      <th className="pb-2 pr-3">Date</th>
                      <th className="pb-2 pr-3">Customer</th>
                      <th className="pb-2 pr-3">Amount</th>
                      <th className="pb-2 pr-3">Status</th>
                      <th className="pb-2 pr-3 hidden md:table-cell">Service</th>
                      <th className="pb-2 pr-3 hidden lg:table-cell">Receipt</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPayments.length === 0 ? (
                      <tr><td colSpan={7} className="py-8 text-center text-gray-400">{payments.length === 0 ? "No payments found" : "No results match search"}</td></tr>
                    ) : pagedPayments.map((p) => {
                      const isRefunded = p.refundedAmountCents > 0;
                      const displayStatus = isRefunded ? "REFUNDED" : p.status;
                      return (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-2.5 pr-3 whitespace-nowrap">{dateStr(p.createdAt)}</td>
                          <td className="py-2.5 pr-3">{p.customerName}{p.last4 && <span className="text-xs text-gray-400 ml-1">{"••"}{p.last4}</span>}</td>
                          <td className="py-2.5 pr-3 font-medium">{fmt(p.amountCents)}{isRefunded && <span className="text-xs text-red-500 ml-1">(-{fmt(p.refundedAmountCents)})</span>}</td>
                          <td className="py-2.5 pr-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium \${STATUS_STYLES[displayStatus] || "bg-gray-100 text-gray-600"}`}>{displayStatus}</span></td>
                          <td className="py-2.5 pr-3 hidden md:table-cell text-gray-600 max-w-[200px] truncate">{p.service}</td>
                          <td className="py-2.5 pr-3 hidden lg:table-cell">{p.receiptUrl ? <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View</a> : <span className="text-gray-300 text-xs">-</span>}</td>
                          <td className="py-2.5">{(p.status === "COMPLETED" || p.status === "APPROVED") && p.amountCents - p.refundedAmountCents > 0 ? <button onClick={() => { setRefundTarget(p); setRefundAmount(((p.amountCents - p.refundedAmountCents) / 100).toFixed(2)); setRefundReason(""); setRefundMsg(""); }} className="text-xs text-red-600 hover:text-red-800 font-medium">Refund</button> : <span className="text-gray-300 text-xs">-</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-gray-500">{filteredPayments.length} payments - Page {page + 1} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-gray-50">Prev</button>
                    <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {refundTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">Process Refund</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Payment:</span> <span className="font-medium">{refundTarget.id.slice(0, 12)}...</span></div>
              <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{refundTarget.customerName}</span></div>
              <div><span className="text-gray-500">Original Amount:</span> <span className="font-medium">{fmt(refundTarget.amountCents)}</span></div>
              {refundTarget.refundedAmountCents > 0 && <div><span className="text-gray-500">Already Refunded:</span> <span className="font-medium text-red-600">{fmt(refundTarget.refundedAmountCents)}</span></div>}
              <div>
                <label className="block text-gray-500 mb-1">Refund Amount ($)</label>
                <input type="number" step="0.01" min="0.01" max={(refundTarget.amountCents - refundTarget.refundedAmountCents) / 100} value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Reason (optional)</label>
                <input type="text" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="e.g. Service not completed" className="w-full border rounded px-3 py-2" />
              </div>
              {refundMsg && <p className={`text-sm \${refundMsg.includes("failed") || refundMsg.includes("error") ? "text-red-600" : "text-green-600"}`}>{refundMsg}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setRefundTarget(null)} className="flex-1 border border-gray-300 rounded py-2 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleRefund} disabled={refunding || !refundAmount} className="flex-1 bg-red-600 text-white rounded py-2 font-medium hover:bg-red-700 disabled:opacity-50">{refunding ? "Processing..." : "Confirm Refund"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
