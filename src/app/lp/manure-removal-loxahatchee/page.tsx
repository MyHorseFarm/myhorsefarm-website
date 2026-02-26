import type { Metadata } from "next";
import LandingHero from "@/components/LandingHero";
import LandingTrustStrip from "@/components/LandingTrustStrip";
import LandingForm from "@/components/LandingForm";
import LandingTestimonials from "@/components/LandingTestimonials";
import LandingFooter from "@/components/LandingFooter";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Manure Removal Loxahatchee FL | Call (561) 576-7667 | My Horse Farm",
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

export default function LpManureLoxahatchee() {
  return (
    <>
      <LandingHero
        title="Loxahatchee Manure Removal"
        subtitle="Starting at $75/ton &middot; Same-Day Service Available"
      />
      <LandingTrustStrip items={TRUST_ITEMS} />
      <main>
        <section className="flex flex-wrap gap-10 max-w-[1100px] mx-auto py-12 px-5 max-md:flex-col max-md:py-8 max-md:px-4">
          <LandingForm
            formSubject="New Lead: Manure Removal - Loxahatchee"
            selectLabel="Select Service Needed *"
            selectOptions={MANURE_OPTIONS}
            addressPlaceholder="Property Address in Loxahatchee *"
            messagePlaceholder="Tell us about your needs (pickup frequency, access notes, etc.)"
            extraFields={
              <select name="stalls" className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]">
                <option value="">How Many Stalls?</option>
                <option value="1-10">1-10 stalls</option>
                <option value="11-20">11-20 stalls</option>
                <option value="21-40">21-40 stalls</option>
                <option value="40+">40+ stalls</option>
              </select>
            }
          />
          <div className="flex-1 min-w-[280px]">
            <h3 className="text-primary-dark mt-0">Why Loxahatchee Farms Trust Us</h3>
            <ul className="pl-5 leading-8">
              <li>Transparent pricing from <strong>$75/ton</strong></li>
              <li>Heavy-duty equipment for large properties (40+ stalls)</li>
              <li>60-yard dump trailer loads for big cleanups</li>
              <li>Flexible weekly, bi-weekly, or custom schedules</li>
              <li>Eco-friendly disposal at approved facilities</li>
              <li>Emergency cleanup before inspections</li>
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
          <h2 className="mb-2.5">Ready to Keep Your Loxahatchee Farm Clean?</h2>
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
