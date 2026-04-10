"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface PendingLog {
  id: string;
  total_amount: number;
  recurring_customers: { name: string; address: string | null } | null;
}

interface Booking {
  id: string;
  customer_name: string;
  customer_location: string;
  service_key: string;
  time_slot: string;
  status: string;
}

interface RecentLog {
  id: string;
  service_date: string;
  status: string;
  total_amount: number;
  created_at: string;
  recurring_customers: { name: string } | null;
}

interface RecentQuote {
  id: string;
  customer_name: string;
  service: string;
  status: string;
  created_at: string;
}

interface OverdueInvoice {
  id: string;
  amount: number;
  customer_name: string;
  invoice_number: string;
  service_date: string | null;
}

interface DashboardData {
  snapshot: {
    pendingCount: number;
    pendingTotal: number;
    bookingsToday: number;
    todayBookings: Booking[];
    activeCustomers: number;
    overdueInvoices: number;
    overdueInvoicesList: OverdueInvoice[];
  };
  pendingLogs: PendingLog[];
  activity: {
    recentLogs: RecentLog[];
    recentQuotes: RecentQuote[];
  };
  summary: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (authToken?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: adminHeaders(authToken || token || undefined),
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const json = await res.json();
      setData(json);
      setAuthed(true);
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchDashboard(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchDashboard(token);
  };

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      charged: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-700",
      sent: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const snap = data?.snapshot;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => fetchDashboard()}
            disabled={loading}
            className="text-sm text-green-800 hover:text-green-700 disabled:opacity-50"
          >
            <i className="fas fa-sync-alt mr-1" />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* AI Summary */}
        {data?.summary && (
          <div className="bg-green-900 text-white rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-robot text-green-300 mt-0.5" />
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
          </div>
        )}

        {/* Snapshot Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Pending Charges</p>
            <p className="text-2xl font-bold text-amber-600">{snap?.pendingCount ?? 0}</p>
            <p className="text-xs text-gray-500">${(snap?.pendingTotal ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Bookings Today</p>
            <p className="text-2xl font-bold text-blue-700">{snap?.bookingsToday ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Active Customers</p>
            <p className="text-2xl font-bold text-green-700">{snap?.activeCustomers ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Overdue Invoices</p>
            <p className="text-2xl font-bold text-red-600">{snap?.overdueInvoices ?? 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => router.push("/admin/daily")}
            className="bg-green-800 text-white rounded-lg p-3 text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-bolt" />
            Charge All Pending
          </button>
          <button
            onClick={() => router.push("/admin/schedule")}
            className="bg-white border border-green-800 text-green-800 rounded-lg p-3 text-sm font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-calendar-day" />
            {"View Today's Schedule"}
          </button>
          <button
            onClick={() => router.push("/admin/customers")}
            className="bg-white border border-green-800 text-green-800 rounded-lg p-3 text-sm font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-file-invoice-dollar" />
            Create Invoice
          </button>
          <button
            onClick={() => {
              window.open("/quote", "_blank");
            }}
            className="bg-white border border-green-800 text-green-800 rounded-lg p-3 text-sm font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle" />
            New Quote
          </button>
        </div>

        {/* Two Column: Activity Feed + Today's Bookings */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {/* Service logs */}
              {data?.activity.recentLogs.map((log) => (
                <div key={`log-${log.id}`} className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <i className="fas fa-truck text-green-700 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {log.recurring_customers?.name || "Unknown"} — ${Number(log.total_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Service on {log.service_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge(log.status)}
                    <span className="text-xs text-gray-400">{timeAgo(log.created_at)}</span>
                  </div>
                </div>
              ))}
              {/* Recent quotes */}
              {data?.activity.recentQuotes.map((q) => (
                <div key={`quote-${q.id}`} className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <i className="fas fa-file-alt text-blue-700 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Quote: {q.customer_name} — {q.service?.replace(/_/g, " ") || "Service"}
                    </p>
                    <p className="text-xs text-gray-400">{q.status}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(q.created_at)}</span>
                </div>
              ))}
              {(!data?.activity.recentLogs.length && !data?.activity.recentQuotes.length) && (
                <div className="p-4 text-center text-gray-400 text-sm">No recent activity</div>
              )}
            </div>
          </div>

          {/* Today's Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{"Today's Bookings"}</h2>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {snap?.todayBookings.map((b) => (
                <div key={b.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{b.customer_name}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {b.time_slot}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {b.service_key.replace(/_/g, " ")} · {b.customer_location}
                  </p>
                </div>
              ))}
              {(!snap?.todayBookings || snap.todayBookings.length === 0) && (
                <div className="p-4 text-center text-gray-400 text-sm">No bookings today</div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Charges List */}
        {data?.pendingLogs && data.pendingLogs.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pending Charges</h2>
              <button
                onClick={() => router.push("/admin/daily")}
                className="text-sm text-green-800 hover:text-green-700 font-medium"
              >
                Charge All →
              </button>
            </div>
            <div className="divide-y">
              {data.pendingLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {log.recurring_customers?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {log.recurring_customers?.address || "No address"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-amber-600">
                    ${Number(log.total_amount).toFixed(2)}
                  </p>
                </div>
              ))}
              {data.pendingLogs.length > 5 && (
                <div className="p-3 text-center">
                  <button
                    onClick={() => router.push("/admin/daily")}
                    className="text-sm text-green-800 hover:text-green-700"
                  >
                    View all {data.pendingLogs.length} pending →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overdue Invoices */}
        {snap?.overdueInvoicesList && snap.overdueInvoicesList.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-red-600">Overdue Invoices</h2>
            </div>
            <div className="divide-y">
              {snap.overdueInvoicesList.slice(0, 5).map((inv) => (
                <div key={inv.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{inv.customer_name}</p>
                    <p className="text-xs text-gray-400">{inv.invoice_number}</p>
                  </div>
                  <p className="text-sm font-semibold text-red-600">
                    ${Number(inv.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
