import type { Metadata } from "next";
import Footer from "@/components/Footer";
import QuoteDisplay from "@/components/QuoteDisplay";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Quote",
  robots: "noindex",
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const [serviceResult, bookingResult] = await Promise.all([
    supabase
      .from("service_pricing")
      .select("display_name")
      .eq("service_key", quote.service_key)
      .single(),
    supabase
      .from("bookings")
      .select("id, booking_number, scheduled_date, time_slot, service_key")
      .eq("quote_id", id)
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const service = serviceResult.data;
  const existingBooking = bookingResult.data
    ? {
        id: bookingResult.data.id,
        booking_number: bookingResult.data.booking_number,
        scheduled_date: bookingResult.data.scheduled_date,
        time_slot: bookingResult.data.time_slot,
        service_name: service?.display_name ?? quote.service_key,
      }
    : null;

  return (
    <>
      <main className="pt-20 pb-16 px-5 max-md:px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold max-md:text-2xl">Your Quote</h1>
            <p className="text-gray-600 mt-2">
              Review your quote and accept to schedule service.
            </p>
          </div>
          <QuoteDisplay
            quote={{
              ...quote,
              service_display_name: service?.display_name ?? quote.service_key,
            }}
            existingBooking={existingBooking}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
