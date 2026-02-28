"use client";

import { useState, useEffect, useCallback } from "react";
import type { AvailabilityDay } from "@/lib/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ServiceCalendarProps {
  quoteId?: string;
  serviceKey?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerLocation?: string;
  onBooked?: (booking: { id: string; booking_number: string; scheduled_date: string; time_slot: string }) => void;
}

export default function ServiceCalendar({
  quoteId,
  serviceKey,
  customerName,
  customerEmail,
  customerPhone,
  customerLocation,
  onBooked,
}: ServiceCalendarProps) {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "afternoon">("morning");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Contact info for direct booking (no quote)
  const [name, setName] = useState(customerName || "");
  const [email, setEmail] = useState(customerEmail || "");
  const [phone, setPhone] = useState(customerPhone || "");
  const [location, setLocation] = useState(customerLocation || "");

  const needsContact = !quoteId && (!customerName || !customerEmail || !customerPhone);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/availability?days=60");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvailability(data.dates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const availByDate = new Map<string, AvailabilityDay>();
  for (const d of availability) {
    availByDate.set(d.date, d);
  }

  // Build calendar grid for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function getDateStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  async function handleBook() {
    if (!selectedDate) return;

    const finalName = customerName || name;
    const finalEmail = customerEmail || email;
    const finalPhone = customerPhone || phone;
    const finalLocation = customerLocation || location;

    if (!finalName || !finalEmail || !finalPhone) {
      setError("Please fill in all contact fields");
      return;
    }

    setBooking(true);
    setError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote_id: quoteId,
          customer_name: finalName,
          customer_email: finalEmail,
          customer_phone: finalPhone,
          customer_location: finalLocation || "not specified",
          service_key: serviceKey || "general",
          scheduled_date: selectedDate,
          time_slot: selectedSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (onBooked) {
        onBooked(data.booking);
      } else {
        window.location.href = `/booking/confirmation?id=${data.booking.id}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setBooking(false);
    }
  }

  return (
    <section id="calendar" className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4">
      <h2 className="text-2xl max-md:text-xl">Schedule &amp; Availability</h2>
      <p className="text-gray-600 mb-4">Choose a date that works for you.</p>
      <img src="/logo.png" alt="My Horse Farm logo" className="w-[160px] h-auto mb-3 mx-auto" />

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
          {error}
        </div>
      )}

      <div className="max-w-md mx-auto">
        {loading ? (
          <p className="text-gray-500 py-10">Loading availability...</p>
        ) : (
          <>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <i className="fas fa-chevron-left text-gray-600" />
              </button>
              <h3 className="font-bold text-lg">{monthLabel}</h3>
              <button
                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <i className="fas fa-chevron-right text-gray-600" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-xs font-semibold text-gray-500 py-2">
                  {d}
                </div>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;

                const dateStr = getDateStr(day);
                const avail = availByDate.get(dateStr);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = new Date(dateStr + "T12:00:00") <= today;

                let bgClass = "bg-gray-50 text-gray-300 cursor-default";
                if (!isPast && avail) {
                  if (avail.status === "available") bgClass = "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
                  else if (avail.status === "limited") bgClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer";
                  else bgClass = "bg-gray-200 text-gray-400 cursor-default";
                }

                const isSelected = selectedDate === dateStr;
                if (isSelected) bgClass = "bg-primary text-white";

                return (
                  <button
                    key={dateStr}
                    disabled={isPast || !avail || avail.status === "full"}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${bgClass}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 text-xs text-gray-500 mb-6">
              <span><span className="inline-block w-3 h-3 bg-green-100 rounded mr-1" /> Available</span>
              <span><span className="inline-block w-3 h-3 bg-yellow-100 rounded mr-1" /> Limited</span>
              <span><span className="inline-block w-3 h-3 bg-gray-200 rounded mr-1" /> Full</span>
            </div>

            {/* Time slot selection */}
            {selectedDate && (
              <div className="text-left">
                <h4 className="font-semibold mb-2">Select a time</h4>
                <div className="flex gap-3 mb-4">
                  {(["morning", "afternoon"] as const).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        selectedSlot === slot
                          ? "border-primary bg-green-50"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      <div className="font-semibold capitalize">{slot}</div>
                      <div className="text-xs text-gray-500">
                        {slot === "morning" ? "8 AM – 12 PM" : "12 PM – 5 PM"}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Contact fields if not provided */}
                {needsContact && (
                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address or area (e.g. Wellington)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {booking ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
