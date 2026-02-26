import type { Metadata } from "next";
import LandingCallBar from "@/components/LandingCallBar";
import LandingFooter from "@/components/LandingFooter";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thank You | My Horse Farm",
  robots: "noindex, nofollow",
};

export default function ThankYouPage() {
  return (
    <div className="pt-[44px]">
      <LandingCallBar />
      <header
        className="relative text-center py-10 px-5 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10">
          <img src="/logo.png" alt="My Horse Farm logo" className="w-[100px] mx-auto" />
        </div>
      </header>
      <main>
        <div className="text-center py-20 px-5 max-w-[600px] mx-auto">
          <div className="text-[4rem] text-primary mb-4">
            <i className="fas fa-check-circle" />
          </div>
          <h1 className="text-primary-dark text-[2rem] mb-4">Thank You!</h1>
          <p className="text-lg leading-relaxed text-gray-600 mb-4">
            We received your request and will get back to you within 1 business hour during operating hours (Mon-Sat, 7 AM - 6 PM).
          </p>
          <p className="text-lg leading-relaxed text-gray-600 mb-4">
            Need service sooner? Call us directly:
          </p>
          <p>
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors no-underline"
            >
              <i className="fas fa-phone" /> {PHONE_OFFICE}
            </a>
          </p>
          <p className="mt-8">
            <a href="/" className="text-primary underline">
              Back to Homepage
            </a>
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
