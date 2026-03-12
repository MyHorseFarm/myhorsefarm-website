import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import BookingConfirmation from "@/components/BookingConfirmation";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your service booking with My Horse Farm has been confirmed.",
  robots: "noindex",
};

export default function BookingConfirmationPage() {
  return (
    <>
      <main className="pt-20 pb-15 px-5 max-md:px-4">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <p className="text-gray-500">Loading...</p>
            </div>
          }
        >
          <BookingConfirmation />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
