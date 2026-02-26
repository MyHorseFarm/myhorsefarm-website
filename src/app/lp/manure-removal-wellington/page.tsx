import type { Metadata } from "next";
import LandingHero from "@/components/LandingHero";
import LandingTrustStrip from "@/components/LandingTrustStrip";
import LandingForm from "@/components/LandingForm";
import LandingTestimonials from "@/components/LandingTestimonials";
import LandingFooter from "@/components/LandingFooter";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Manure Removal Wellington FL | Call (561) 576-7667 | My Horse Farm",
  robots: "noindex, nofollow",
};

const TRUST_ITEMS = [
  { icon: "fas fa-shield-alt", label: "Licensed & Insured" },
  { icon: "fas fa-star", label: "5-Star Rated" },
  { icon: "fas fa-clock", label: "Same-Day Service" },
  { icon: "fas fa-map-marker-alt", label: "Locally Owned" },
  { icon: "fas fa-leaf", label: "Eco-Friendly Disposal" },
];

const MANURE_OPTIONS = [
  { value: "Scheduled Manure Pickup", label: "Scheduled Manure Pickup" },
  { value: "One-Time Cleanup", label: "One-Time Cleanup" },
  { value: "Bin/Dumpster Delivery", label: "Bin/Dumpster Delivery" },
  { value: "Emergency Cleanup", label: "Emergency Cleanup" },
];

export default function LpManureWellington() {
  return (
    <>
      <LandingHero
        title="Wellington Manure Removal"
        subtitle="Starting at $75/ton &middot; Same-Day Service Available"
      />
      <LandingTrustStrip items={TRUST_ITEMS} />
      <main>
        <section className="flex flex-wrap gap-10 max-w-[1100px] mx-auto py-12 px-5 max-md:flex-col max-md:py-8 max-md:px-4">
          <LandingForm
            formSubject="New Lead: Manure Removal - Wellington"
            selectLabel="Select Service Needed *"
            selectOptions={MANURE_OPTIONS}
            addressPlaceholder="Property Address in Wellington *"
            messagePlaceholder="Tell us about your needs (number of stalls, pickup frequency, etc.)"
          />
          <div className="flex-1 min-w-[280px]">
            <h3 className="text-primary-dark mt-0">Why Wellington Barns Choose Us</h3>
            <ul className="pl-5 leading-8">
              <li>Transparent pricing from <strong>$75/ton</strong></li>
              <li>Leak-proof bins sized for 5 to 60+ stalls</li>
              <li>Flexible weekly or bi-weekly schedules</li>
              <li>Compliant with Village of Wellington waste ordinances</li>
              <li>Eco-friendly disposal at approved composting facilities</li>
              <li>Serving Wellington equestrian community for over a decade</li>
            </ul>
            <div className="bg-gray-100 rounded-lg p-5 text-center mt-6">
              <p className="m-0 mb-2.5 font-semibold text-gray-800">Prefer to talk? Call us now:</p>
              <a href={`tel:${PHONE_OFFICE_TEL}`} className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors no-underline">
                <i className="fas fa-phone" /> {PHONE_OFFICE}
              </a>
            </div>
          </div>
        </section>
        <LandingTestimonials />
        <section className="text-center py-12 px-5 bg-white">
          <h2 className="mb-2.5">Ready to Keep Your Wellington Barn Clean?</h2>
          <p className="text-gray-600 mb-5 text-[1.05rem]">Call now for same-day service or fill out the form above for a free quote.</p>
          <a href={`tel:${PHONE_OFFICE_TEL}`} className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors no-underline">
            <i className="fas fa-phone" /> Call {PHONE_OFFICE}
          </a>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
