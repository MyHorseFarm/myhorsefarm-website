"use client";

import { useState } from "react";

interface QuoteData {
  id: string;
  quote_number: string;
  status: string;
  customer_name: string;
  service_key: string;
  service_display_name: string;
  estimated_amount: number;
  pricing_breakdown: {
    base: number;
    adjustments: { label: string; amount: number }[];
    total: number;
  };
  requires_site_visit: boolean;
  expires_at: string;
  created_at: string;
}

export default function QuoteDisplay({ quote }: { quote: QuoteData }) {
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(quote.status === "accepted");
  const [error, setError] = useState("");

  const expired = new Date(quote.expires_at) < new Date();
  const canAccept = quote.status === "pending" && !expired;

  async function handleAccept() {
    setAccepting(true);
    setError("");
    try {
      const res = await fetch(`/api/quote/${quote.id}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept quote");
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5 text-white">
          <p className="text-sm opacity-80">Quote</p>
          <p className="text-xl font-bold">{quote.quote_number}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                accepted
                  ? "bg-green-100 text-green-700"
                  : expired
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {accepted ? "Accepted" : expired ? "Expired" : quote.status.replace(/_/g, " ")}
            </span>
          </div>

          <table className="w-full mb-6">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500 text-sm">Service</td>
                <td className="py-3 text-right font-medium">
                  {quote.service_display_name}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500 text-sm">Base price</td>
                <td className="py-3 text-right">
                  ${quote.pricing_breakdown.base.toFixed(2)}
                </td>
              </tr>
              {quote.pricing_breakdown.adjustments.map((adj, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 text-gray-500 text-sm">{adj.label}</td>
                  <td className="py-3 text-right text-sm">
                    {adj.amount >= 0 ? "+" : ""}${Math.abs(adj.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-bold text-lg">Total</td>
                <td className="py-3 text-right font-bold text-lg text-primary">
                  ${quote.pricing_breakdown.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-xs text-gray-400 mb-6">
            Valid until{" "}
            {new Date(quote.expires_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {accepted ? (
            <a
              href={`/booking/confirmation?quote_id=${quote.id}`}
              className="block w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Schedule Now
            </a>
          ) : canAccept ? (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {accepting ? "Accepting..." : "Accept & Schedule"}
            </button>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              {expired
                ? "This quote has expired. Please request a new one."
                : "This quote is no longer available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
