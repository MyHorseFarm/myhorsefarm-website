"use client";

import { useState, useEffect, useMemo } from "react";
import { getCrewPin, setCrewPin, crewHeaders } from "@/lib/admin-auth";

interface Customer {
  id: string;
  name: string;
  address: string | null;
  default_bin_rate: number;
  notes: string | null;
}

interface TodayJob {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_location: string;
  service_key: string;
  time_slot: string;
  status: string;
}

export default function CrewPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [todayJobs, setTodayJobs] = useState<TodayJob[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [bins, setBins] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string; amount: number } | null>(null);
  const [error, setError] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q)),
    );
  }, [customers, customerSearch]);

  const fetchCustomers = async (crewPinValue: string) => {
    try {
      const res = await fetch("/api/crew/customers", {
        headers: crewHeaders(crewPinValue),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setCustomers(data.customers);
      setTodayJobs(data.todayJobs ?? []);
      setAuthed(true);
      return true;
    } catch {
      return false;
    }
  };

  // Auto-login from session on mount
  useEffect(() => {
    const saved = getCrewPin();
    if (saved) {
      setPin(saved);
      fetchCustomers(saved);
    }
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await fetchCustomers(pin);
    if (ok) {
      setCrewPin(pin);
    } else {
      setError("Invalid PIN");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/crew/log", {
        method: "POST",
        headers: crewHeaders(),
        body: JSON.stringify({
          customer_id: selectedCustomer,
          bins_collected: bins,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log");
      }

      const data = await res.json();
      setSuccess({ name: data.customer_name, amount: data.total_amount });

      // Reset form after delay
      setTimeout(() => {
        setSuccess(null);
        setSelectedCustomer("");
        setBins(1);
        setNotes("");
        setCustomerSearch("");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectCustomer = (id: string) => {
    setSelectedCustomer(id);
    setCustomerSearch("");
  };

  const selectedRate = customers.find((c) => c.id === selectedCustomer)?.default_bin_rate ?? 0;
  const selectedNotes = customers.find((c) => c.id === selectedCustomer)?.notes;
  const selectedName = customers.find((c) => c.id === selectedCustomer)?.name;

  // PIN screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
        <form onSubmit={handlePinSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-900">My Horse Farm</h1>
            <p className="text-gray-500 text-sm mt-1">Crew Pickup Log</p>
          </div>
          {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] mb-4 focus:border-green-700 focus:outline-none"
            maxLength={6}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 active:bg-green-900"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <div className="text-6xl mb-4">&#10003;</div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Logged!</h2>
          <p className="text-gray-600">
            {success.name} &mdash; ${success.amount.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  // Pickup form
  return (
    <div className="min-h-screen bg-green-900 p-4">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-4 pt-4">
          <h1 className="text-xl font-bold text-white">Log Pickup</h1>
        </div>

        {/* Today's Jobs */}
        {todayJobs.length > 0 && (
          <div className="bg-white/10 rounded-2xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-white/80 mb-2">
              Today&apos;s Jobs ({todayJobs.length})
            </h2>
            <div className="space-y-2">
              {todayJobs.map((job) => (
                <div
                  key={job.id}
                  className={`rounded-xl p-3 text-sm ${
                    job.status === "completed"
                      ? "bg-green-800/50 text-green-100"
                      : "bg-white/90 text-green-900"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{job.customer_name}</p>
                      <p className="text-xs opacity-75">
                        {job.service_key.replace(/_/g, " ")} &middot; {job.time_slot}
                      </p>
                      {job.customer_location && (
                        <p className="text-xs opacity-60 mt-0.5">{job.customer_location}</p>
                      )}
                    </div>
                    {job.status === "completed" ? (
                      <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">Done</span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Customer select with search */}
          <div>
            <label className="block text-sm font-semibold mb-2">Customer</label>
            <input
              type="text"
              placeholder="Search customers..."
              value={selectedCustomer ? (selectedName || "") : customerSearch}
              onChange={(e) => {
                if (selectedCustomer) {
                  setSelectedCustomer("");
                }
                setCustomerSearch(e.target.value);
              }}
              onFocus={() => {
                if (selectedCustomer) {
                  setSelectedCustomer("");
                  setCustomerSearch("");
                }
              }}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-green-700 focus:outline-none"
            />
            {!selectedCustomer && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-gray-100">
                {filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCustomer(c.id)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 active:bg-green-100 border-b border-gray-50 last:border-b-0"
                  >
                    <span className="font-medium text-sm">{c.name}</span>
                    {c.address && (
                      <span className="text-xs text-gray-400 block">{c.address}</span>
                    )}
                  </button>
                ))}
                {filteredCustomers.length === 0 && (
                  <p className="px-4 py-3 text-sm text-gray-400">No customers found</p>
                )}
              </div>
            )}
            {selectedCustomer && selectedNotes && (
              <p className="text-xs text-gray-500 mt-2 bg-amber-50 px-3 py-2 rounded-lg">{selectedNotes}</p>
            )}
          </div>

          {/* Bins counter */}
          {selectedCustomer && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Bins Collected</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setBins(Math.max(1, bins - 1))}
                    className="w-14 h-14 rounded-xl bg-gray-100 text-2xl font-bold active:bg-gray-200 flex items-center justify-center"
                  >
                    &minus;
                  </button>
                  <span className="text-4xl font-bold text-green-900 min-w-[3rem] text-center">
                    {bins}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBins(bins + 1)}
                    className="w-14 h-14 rounded-xl bg-gray-100 text-2xl font-bold active:bg-gray-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {bins} &times; ${selectedRate.toFixed(2)} ={" "}
                  <strong>${(bins * selectedRate).toFixed(2)}</strong>
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-green-700 focus:outline-none"
                  rows={2}
                  placeholder="Extra info..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-800 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 active:bg-green-900 disabled:opacity-50"
              >
                {submitting ? "Logging..." : "Log Pickup"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
