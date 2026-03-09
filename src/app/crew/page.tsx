"use client";

import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  address: string | null;
  default_bin_rate: number;
  notes: string | null;
}

export default function CrewPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [bins, setBins] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string; amount: number } | null>(null);
  const [error, setError] = useState("");

  // Store PIN in session
  const storedPin = () => (typeof window !== "undefined" ? sessionStorage.getItem("crew_pin") || pin : pin);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verify PIN by fetching customers
    try {
      const res = await fetch("/api/crew/customers", {
        headers: { "x-crew-pin": pin },
      });
      if (!res.ok) {
        setError("Invalid PIN");
        return;
      }
      const data = await res.json();
      setCustomers(data.customers);
      setAuthed(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("crew_pin", pin);
      }
    } catch {
      setError("Connection error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/crew/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-crew-pin": storedPin(),
        },
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
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRate = customers.find((c) => c.id === selectedCustomer)?.default_bin_rate ?? 0;
  const selectedNotes = customers.find((c) => c.id === selectedCustomer)?.notes;

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
        <div className="text-center mb-6 pt-4">
          <h1 className="text-xl font-bold text-white">Log Pickup</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Customer select */}
          <div>
            <label className="block text-sm font-semibold mb-2">Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-green-700 focus:outline-none"
              required
            >
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.address ? `— ${c.address}` : ""}
                </option>
              ))}
            </select>
            {selectedNotes && (
              <p className="text-xs text-gray-500 mt-1">{selectedNotes}</p>
            )}
          </div>

          {/* Bins counter */}
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
            {selectedCustomer && (
              <p className="text-sm text-gray-500 mt-2">
                {bins} &times; ${selectedRate.toFixed(2)} ={" "}
                <strong>${(bins * selectedRate).toFixed(2)}</strong>
              </p>
            )}
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
            disabled={submitting || !selectedCustomer}
            className="w-full bg-green-800 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 active:bg-green-900 disabled:opacity-50"
          >
            {submitting ? "Logging..." : "Log Pickup"}
          </button>
        </form>
      </div>
    </div>
  );
}
