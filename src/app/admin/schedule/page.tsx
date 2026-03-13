"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface Customer {
  id: string;
  name: string;
  address: string | null;
  default_service: string;
  auto_charge: boolean;
  charge_frequency: "daily" | "weekly" | "biweekly" | "monthly" | null;
  next_charge_date: string | null;
}

const FREQ_DAYS: Record<string, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function dateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export default function SchedulePage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchCustomers = useCallback(async (authToken?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers?active=true", {
        headers: adminHeaders(authToken || token || undefined),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCustomers(data.customers);
      setAuthed(true);
    } catch {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchCustomers(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchCustomers(token);
  };

  // Project service dates for auto-charge customers within the visible month
  const schedule = useMemo(() => {
    const map: Record<string, Customer[]> = {};
    const monthStart = new Date(viewMonth.year, viewMonth.month, 1);
    const monthEnd = new Date(viewMonth.year, viewMonth.month + 1, 0);

    const autoChargeCustomers = customers.filter(
      (c) => c.auto_charge && c.charge_frequency && c.next_charge_date,
    );

    for (const c of autoChargeCustomers) {
      const freq = FREQ_DAYS[c.charge_frequency!] || 7;
      let current = new Date(c.next_charge_date! + "T00:00:00");

      // If next_charge_date is after our range, skip
      if (current > monthEnd) continue;

      // Walk backwards to find earliest occurrence that could reach into our range
      while (current > monthStart) {
        current = addDays(current, -freq);
      }
      // Now walk forward and collect dates within range
      while (current <= monthEnd) {
        if (current >= monthStart) {
          const key = dateKey(current);
          if (!map[key]) map[key] = [];
          map[key].push(c);
        }
        current = addDays(current, freq);
      }
    }

    return map;
  }, [customers, viewMonth]);

  const monthDays = useMemo(
    () => getMonthDays(viewMonth.year, viewMonth.month),
    [viewMonth],
  );

  const firstDayOfWeek = monthDays[0].getDay(); // 0=Sun
  const todayStr = dateKey(new Date());
  const monthLabel = new Date(viewMonth.year, viewMonth.month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setViewMonth((v) => {
      const m = v.month - 1;
      return m < 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: m };
    });
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setViewMonth((v) => {
      const m = v.month + 1;
      return m > 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: m };
    });
    setSelectedDate(null);
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

  const selectedCustomers = selectedDate ? schedule[selectedDate] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Recurring Schedule</h1>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="px-3 py-1 rounded border hover:bg-gray-50 text-sm">
              &larr;
            </button>
            <span className="font-medium text-sm min-w-[140px] text-center">{monthLabel}</span>
            <button onClick={nextMonth} className="px-3 py-1 rounded border hover:bg-gray-50 text-sm">
              &rarr;
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {monthDays.map((day) => {
                  const key = dateKey(day);
                  const count = schedule[key]?.length || 0;
                  const isToday = key === todayStr;
                  const isSelected = key === selectedDate;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(key === selectedDate ? null : key)}
                      className={`relative p-2 rounded text-sm text-center transition-colors ${
                        isSelected
                          ? "bg-green-800 text-white"
                          : isToday
                            ? "bg-green-50 font-bold"
                            : "hover:bg-gray-50"
                      }`}
                    >
                      {day.getDate()}
                      {count > 0 && (
                        <span
                          className={`block text-xs mt-0.5 font-medium ${
                            isSelected ? "text-green-200" : "text-green-700"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day detail panel */}
            <div className="bg-white rounded-lg shadow p-4">
              {selectedDate ? (
                <>
                  <h2 className="text-sm font-semibold mb-3">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </h2>
                  {selectedCustomers.length === 0 ? (
                    <p className="text-xs text-gray-400">No scheduled services.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCustomers.map((c) => (
                        <div key={c.id} className="border rounded p-3 text-sm">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.address || "\u2014"}</p>
                          <p className="text-xs text-gray-400">
                            {(c.default_service || "").replace(/_/g, " ")} &middot;{" "}
                            {c.charge_frequency}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Click a date to see scheduled customers.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
