"use client";

import { useState } from "react";
import DateTimePicker from "./DateTimePicker";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "afternoon">("morning");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  // Contact info for direct booking (no quote)
  const [name, setName] = useState(customerName || "");
  const [email, setEmail] = useState(customerEmail || "");
  const [phone, setPhone] = useState(customerPhone || "");
  const [location, setLocation] = useState(customerLocation || "");

  const needsContact = !quoteId && (!customerName || !customerEmail || !customerPhone);

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
        <DateTimePicker
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onDateSelect={setSelectedDate}
          onSlotSelect={setSelectedSlot}
        />

        {/* Contact fields if not provided */}
        {selectedDate && needsContact && (
          <div className="space-y-3 mb-4 text-left">
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

        {selectedDate && (
          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
        )}
      </div>
    </section>
  );
}
