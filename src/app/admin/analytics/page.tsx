"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface Summary {
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
  summary: Summary;
  revenueByDay: Record<string, number>;
  revenueByCrew: Record<string, number>;
  serviceBreakdown: Record<string, number>;
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

export default function AnalyticsPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState("30");

  const fetchData = useCallback(
    async (days?: string, authToken?: string) => {
      setLoading(true);
      setError("");
      try {
        const d = days || range;
        const res = await fetch(`/api/admin/analytics?range=${d}`, {
          headers: adminHeaders(authToken || token || undefined),
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
        setAuthed(true);
      } catch {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    },
    [range, token],
  );

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchData(undefined, saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchData(undefined, token);
  };

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    if (authed) fetchData(newRange);
  };

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

  const s = data?.summary;
  const sortedDays = Object.entries(data?.revenueByDay ?? {}).sort(([a], [b]) => a.localeCompare(b));
  const maxDayRev = Math.max(...sortedDays.map(([, v]) => v), 1);
  const crewEntries = Object.entries(data?.revenueByCrew ?? {}).sort(([, a], [, b]) => b - a);
  const serviceEntries = Object.entries(data?.serviceBreakdown ?? {}).sort(([, a], [, b]) => b - a);
  const maxService = Math.max(...serviceEntries.map(([, v]) => v), 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <div className="flex gap-3 mt-1">
              <a href="/admin/daily" className="text-sm text-green-800 underline">
                Daily Dashboard
              </a>
              <a href="/admin/customers" className="text-sm text-green-800 underline">
                Customers
              </a>
              <a href="/admin/crew" className="text-sm text-green-800 underline">
                Crew
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            {["7", "30", "90"].map((d) => (
              <button
                key={d}
                onClick={() => handleRangeChange(d)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  range === d
                    ? "bg-green-800 text-white"
                    : "bg-white border text-gray-700 hover:bg-gray-50"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading || !s ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500 uppercase">Revenue</p>
                <p className="text-2xl font-bold text-green-700">${s.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{s.chargedCount} charges</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500 uppercase">Customers</p>
                <p className="text-2xl font-bold">{s.activeCustomers}</p>
                <p className="text-xs text-gray-400">{s.autoChargeCustomers} auto-charge</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500 uppercase">Quotes</p>
                <p className="text-2xl font-bold">{s.totalQuotes}</p>
                <p className="text-xs text-gray-400">
                  {(s.quoteConversion * 100).toFixed(0)}% conversion
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500 uppercase">Issues</p>
                <p className="text-2xl font-bold text-red-600">{s.failedCount}</p>
                <p className="text-xs text-gray-400">{s.pendingCount} pending</p>
              </div>
            </div>

            {/* Revenue chart (CSS bar chart) */}
            {sortedDays.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 mb-8">
                <h2 className="text-sm font-semibold mb-3">Revenue by Day</h2>
                <div className="space-y-1">
                  {sortedDays.map(([day, rev]) => (
                    <div key={day} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-gray-500 shrink-0">{day.slice(5)}</span>
                      <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                        <div
                          className="bg-green-600 h-full rounded"
                          style={{ width: `${(rev / maxDayRev) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-medium">${rev.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Revenue by crew */}
              {crewEntries.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-sm font-semibold mb-3">Revenue by Crew</h2>
                  <div className="space-y-2">
                    {crewEntries.map(([crew, rev]) => (
                      <div key={crew} className="flex justify-between text-sm">
                        <span>{crew}</span>
                        <span className="font-medium">${rev.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service breakdown */}
              {serviceEntries.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-sm font-semibold mb-3">Customers by Service</h2>
                  <div className="space-y-2">
                    {serviceEntries.map(([svc, count]) => (
                      <div key={svc} className="flex items-center gap-2 text-sm">
                        <span className="flex-1">{SERVICE_LABELS[svc] || svc}</span>
                        <div className="w-24 bg-gray-100 rounded h-4 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded"
                            style={{ width: `${(count / maxService) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
