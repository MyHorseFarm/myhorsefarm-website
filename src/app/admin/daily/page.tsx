"use client";

import { useState, useCallback } from "react";

interface ServiceLog {
  id: string;
  customer_id: string;
  crew_member: string;
  service_date: string;
  bins_collected: number;
  bin_rate: number;
  total_amount: number;
  notes: string | null;
  status: "pending" | "approved" | "charged" | "failed";
  square_payment_id: string | null;
  charged_at: string | null;
  created_at: string;
  recurring_customers: {
    name: string;
    address: string | null;
    square_customer_id: string | null;
    email: string | null;
  };
}

export default function DailyDashboardPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charging, setCharging] = useState<string | null>(null);
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});

  const headers = useCallback(
    () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` }),
    [token],
  );

  const fetchLogs = useCallback(
    async (forDate?: string) => {
      setLoading(true);
      setError("");
      try {
        const d = forDate || date;
        const res = await fetch(`/api/admin/daily?date=${d}`, { headers: headers() });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setLogs(data.logs);
        setAuthed(true);
      } catch {
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    },
    [date, headers],
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await fetchLogs();
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (authed) fetchLogs(newDate);
  };

  const handleCharge = async (logId: string) => {
    setCharging(logId);
    setError("");
    try {
      const overrideStr = editAmounts[logId];
      const body: Record<string, unknown> = { log_id: logId };
      if (overrideStr !== undefined) {
        const parsed = parseFloat(overrideStr);
        if (!isNaN(parsed) && parsed > 0) body.override_amount = parsed;
      }

      const res = await fetch("/api/admin/charge", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Charge failed");

      // Refresh the list
      await fetchLogs();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Charge failed");
    } finally {
      setCharging(null);
    }
  };

  const pendingLogs = logs.filter((l) => l.status === "pending");
  const chargedLogs = logs.filter((l) => l.status === "charged");
  const failedLogs = logs.filter((l) => l.status === "failed");
  const totalCharged = chargedLogs.reduce((sum, l) => sum + Number(l.total_amount), 0);
  const totalPending = pendingLogs.reduce((sum, l) => sum + Number(l.total_amount), 0);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Daily Dashboard</h1>
            <div className="flex gap-3 mt-1">
              <a href="/admin/customers" className="text-sm text-green-800 underline">
                Customers
              </a>
            </div>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Total Logs</p>
            <p className="text-2xl font-bold">{logs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{pendingLogs.length}</p>
            <p className="text-xs text-gray-500">${totalPending.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Charged</p>
            <p className="text-2xl font-bold text-green-700">{chargedLogs.length}</p>
            <p className="text-xs text-gray-500">${totalCharged.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">Failed</p>
            <p className="text-2xl font-bold text-red-600">{failedLogs.length}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
            No service logs for this date.
          </div>
        ) : (
          <>
            {/* Pending section */}
            {pendingLogs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Pending Approval</h2>
                <div className="space-y-3">
                  {pendingLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{log.recurring_customers.name}</p>
                        <p className="text-sm text-gray-500">
                          {log.bins_collected} bin{log.bins_collected !== 1 ? "s" : ""} &times; $
                          {Number(log.bin_rate).toFixed(2)}
                        </p>
                        {log.notes && (
                          <p className="text-xs text-gray-400 mt-1">{log.notes}</p>
                        )}
                        {!log.recurring_customers.square_customer_id && (
                          <p className="text-xs text-red-500 mt-1">
                            No Square ID linked
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <label className="text-xs text-gray-500 block">Amount</label>
                          <input
                            type="number"
                            step="0.01"
                            value={
                              editAmounts[log.id] !== undefined
                                ? editAmounts[log.id]
                                : Number(log.total_amount).toFixed(2)
                            }
                            onChange={(e) =>
                              setEditAmounts({ ...editAmounts, [log.id]: e.target.value })
                            }
                            className="w-24 border rounded px-2 py-1 text-right text-sm"
                          />
                        </div>
                        <button
                          onClick={() => handleCharge(log.id)}
                          disabled={
                            charging === log.id || !log.recurring_customers.square_customer_id
                          }
                          className="bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                        >
                          {charging === log.id ? "Charging..." : "Approve & Charge"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charged section */}
            {chargedLogs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Charged</h2>
                <div className="space-y-2">
                  {chargedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-3 opacity-80"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{log.recurring_customers.name}</p>
                        <p className="text-sm text-gray-500">
                          {log.bins_collected} bin{log.bins_collected !== 1 ? "s" : ""} &mdash; $
                          {Number(log.total_amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Charged
                        </span>
                        {log.square_payment_id && (
                          <span className="text-xs text-gray-400">{log.square_payment_id.slice(0, 12)}...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed section */}
            {failedLogs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-red-600">Failed</h2>
                <div className="space-y-2">
                  {failedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white rounded-lg shadow p-4 border-l-4 border-red-400 flex flex-col md:flex-row md:items-center gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{log.recurring_customers.name}</p>
                        <p className="text-sm text-gray-500">
                          {log.bins_collected} bin{log.bins_collected !== 1 ? "s" : ""} &mdash; $
                          {Number(log.total_amount).toFixed(2)}
                        </p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Failed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
