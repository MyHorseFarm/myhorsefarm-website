"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface BookingData {
  id: string;
  booking_number: string;
  service_display_name: string;
  scheduled_date: string;
  time_slot: string;
  customer_name: string;
  status: string;
}

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No booking ID provided");
      return;
    }

    fetch(`/api/booking/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setBooking(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error || "Booking not found"}</p>
        <a href="/" className="text-primary hover:underline mt-4 inline-block">
          Return to homepage
        </a>
      </div>
    );
  }

  const formattedDate = new Date(booking.scheduled_date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );

  const slotLabel =
    booking.time_slot === "morning"
      ? "Morning (8 AM \u2013 12 PM)"
      : "Afternoon (12 PM \u2013 5 PM)";

  // Google Calendar link
  const calDate = booking.scheduled_date.replace(/-/g, "");
  const calStart = booking.time_slot === "morning" ? "T080000" : "T120000";
  const calEnd = booking.time_slot === "morning" ? "T120000" : "T170000";
  const calTitle = encodeURIComponent(`My Horse Farm – ${booking.service_display_name}`);
  const calDetails = encodeURIComponent(`Booking #${booking.booking_number}\nService: ${booking.service_display_name}\nTime: ${slotLabel}`);
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${calDate}${calStart}/${calDate}${calEnd}&details=${calDetails}`;

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fas fa-calendar-check text-primary text-3xl" />
      </div>

      <h1 className="text-3xl font-bold mb-2 max-md:text-2xl">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        You&rsquo;re all set. We&rsquo;ll see you soon!
      </p>

      <div className="bg-white rounded-xl shadow-lg p-6 text-left mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 text-sm">Booking #</span>
          <span className="font-bold text-primary">{booking.booking_number}</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 text-gray-500 text-sm">Service</td>
              <td className="py-3 text-right font-medium">{booking.service_display_name}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 text-gray-500 text-sm">Date</td>
              <td className="py-3 text-right font-medium">{formattedDate}</td>
            </tr>
            <tr>
              <td className="py-3 text-gray-500 text-sm">Time</td>
              <td className="py-3 text-right font-medium">{slotLabel}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <a
        href={googleCalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors mb-3"
      >
        <i className="fas fa-calendar-plus mr-2" />
        Add to Google Calendar
      </a>

      <p className="text-gray-500 text-sm mt-4">
        A confirmation email has been sent to your inbox. Need to make changes?{" "}
        <a href="tel:+15615767667" className="text-primary hover:underline">
          Call (561) 576-7667
        </a>
      </p>
    </div>
  );
}
