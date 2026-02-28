import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingConfirmation from "@/components/BookingConfirmation";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: "noindex",
};

export default function BookingConfirmationPage() {
  return (
    <>
      <Navbar links={NAV_LINKS_SERVICE} />
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
