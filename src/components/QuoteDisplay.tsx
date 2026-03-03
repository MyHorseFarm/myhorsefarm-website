"use client";

import { useState } from "react";
import DateTimePicker from "./DateTimePicker";

interface QuoteData {
  id: string;
  quote_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
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

interface BookingData {
  id: string;
  booking_number: string;
  scheduled_date: string;
  time_slot: string;
  service_name: string;
}

type Phase = "review" | "schedule" | "confirmed";

export default function QuoteDisplay({
  quote,
  existingBooking,
}: {
  quote: QuoteData;
  existingBooking?: BookingData | null;
}) {
  const expired = new Date(quote.expires_at) < new Date();

  // Determine initial phase
  function getInitialPhase(): Phase {
    if (existingBooking || quote.status === "booked") return "confirmed";
    if (quote.status === "accepted") return "schedule";
    return "review";
  }

  const [phase, setPhase] = useState<Phase>(getInitialPhase);
  const [accepting, setAccepting] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(existingBooking ?? null);

  // Date/time picker state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "afternoon">("morning");

  async function handleAcceptAndSchedule() {
    setAccepting(true);
    setError("");
    try {
      const res = await fetch(`/api/quote/${quote.id}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPhase("schedule");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept quote");
    } finally {
      setAccepting(false);
    }
  }

  async function handleBook() {
    if (!selectedDate) return;
    setBookingInProgress(true);
    setError("");
    try {
      const res = await fetch(`/api/quote/${quote.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduled_date: selectedDate,
          time_slot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookingData(data.booking);
      setPhase("confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setBookingInProgress(false);
    }
  }

  // Google Calendar link for the customer
  function getGoogleCalUrl() {
    if (!bookingData) return "#";
    const calDate = bookingData.scheduled_date.replace(/-/g, "");
    const calStart = bookingData.time_slot === "morning" ? "T080000" : "T120000";
    const calEnd = bookingData.time_slot === "morning" ? "T120000" : "T170000";
    const calTitle = encodeURIComponent(`My Horse Farm \u2013 ${bookingData.service_name}`);
    const slotLabel = bookingData.time_slot === "morning" ? "Morning (8 AM \u2013 12 PM)" : "Afternoon (12 PM \u2013 5 PM)";
    const calDetails = encodeURIComponent(`Booking #${bookingData.booking_number}\nService: ${bookingData.service_name}\nTime: ${slotLabel}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${calDate}${calStart}/${calDate}${calEnd}&details=${calDetails}`;
  }

  const canAccept = quote.status === "pending" && !expired;

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
          {/* Status badge */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                phase === "confirmed" || quote.status === "booked"
                  ? "bg-green-100 text-green-700"
                  : phase === "schedule" || quote.status === "accepted"
                    ? "bg-blue-100 text-blue-700"
                    : expired
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {phase === "confirmed" || quote.status === "booked"
                ? "Booked"
                : phase === "schedule" || quote.status === "accepted"
                  ? "Accepted"
                  : expired
                    ? "Expired"
                    : quote.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* ─── PHASE: REVIEW ─── */}
          {phase === "review" && (
            <>
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

              {canAccept ? (
                <button
                  onClick={handleAcceptAndSchedule}
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
            </>
          )}

          {/* ─── PHASE: SCHEDULE ─── */}
          {phase === "schedule" && (
            <>
              {/* Compact quote summary */}
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 mb-6">
                <div>
                  <p className="font-semibold">{quote.service_display_name}</p>
                  <p className="text-xs text-gray-500">{quote.customer_name}</p>
                </div>
                <p className="font-bold text-lg text-primary">
                  ${quote.pricing_breakdown.total.toFixed(2)}
                </p>
              </div>

              <h3 className="font-bold text-lg mb-1 text-center">Pick a Date</h3>
              <p className="text-gray-500 text-sm mb-4 text-center">
                Choose when you&rsquo;d like us to come out.
              </p>

              <DateTimePicker
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateSelect={setSelectedDate}
                onSlotSelect={setSelectedSlot}
                compact
              />

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {selectedDate && (
                <button
                  onClick={handleBook}
                  disabled={bookingInProgress}
                  className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {bookingInProgress ? "Booking..." : "Confirm Booking"}
                </button>
              )}
            </>
          )}

          {/* ─── PHASE: CONFIRMED ─── */}
          {phase === "confirmed" && bookingData && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calendar-check text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-1">Booking Confirmed!</h3>
                <p className="text-gray-500 text-sm">
                  You&rsquo;re all set. We&rsquo;ll see you soon!
                </p>
              </div>

              <table className="w-full mb-6">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-500 text-sm">Booking #</td>
                    <td className="py-3 text-right font-bold text-primary">
                      {bookingData.booking_number}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-500 text-sm">Service</td>
                    <td className="py-3 text-right font-medium">
                      {bookingData.service_name}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-500 text-sm">Date</td>
                    <td className="py-3 text-right font-medium">
                      {new Date(bookingData.scheduled_date + "T12:00:00").toLocaleDateString(
                        "en-US",
                        { weekday: "long", month: "long", day: "numeric", year: "numeric" },
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500 text-sm">Time</td>
                    <td className="py-3 text-right font-medium">
                      {bookingData.time_slot === "morning"
                        ? "Morning (8 AM \u2013 12 PM)"
                        : "Afternoon (12 PM \u2013 5 PM)"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <a
                href={getGoogleCalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors mb-3"
              >
                <i className="fas fa-calendar-plus mr-2" />
                Add to Your Calendar
              </a>

              <p className="text-gray-500 text-sm text-center">
                A confirmation email has been sent. Need to make changes?{" "}
                <a href="tel:+15615767667" className="text-primary hover:underline">
                  Call (561) 576-7667
                </a>
              </p>
            </>
          )}

          {/* Confirmed but no booking data (edge case: returning user with booked quote) */}
          {phase === "confirmed" && !bookingData && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-1">Quote Booked</h3>
              <p className="text-gray-500 text-sm mb-4">
                This quote has already been booked. Check your email for booking details.
              </p>
              <a href="tel:+15615767667" className="text-primary hover:underline text-sm">
                Call (561) 576-7667 for questions
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
