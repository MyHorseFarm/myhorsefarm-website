import type { Metadata } from "next";
import LandingHero from "@/components/LandingHero";
import LandingTrustStrip from "@/components/LandingTrustStrip";
import LandingForm from "@/components/LandingForm";
import LandingTestimonials from "@/components/LandingTestimonials";
import LandingFooter from "@/components/LandingFooter";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Junk Removal West Palm Beach FL | Call (561) 576-7667 | My Horse Farm",
  robots: "noindex, nofollow",
};

const TRUST_ITEMS = [
  { icon: "fas fa-shield-alt", label: "Licensed & Insured" },
  { icon: "fas fa-star", label: "5-Star Rated" },
  { icon: "fas fa-clock", label: "Same-Day Service" },
  { icon: "fas fa-map-marker-alt", label: "Locally Owned" },
  { icon: "fas fa-recycle", label: "Eco-Friendly Disposal" },
];

const JUNK_OPTIONS = [
  { value: "General Junk/Clutter", label: "General Junk/Clutter" },
  { value: "Furniture & Appliances", label: "Furniture & Appliances" },
  { value: "Yard Waste & Debris", label: "Yard Waste & Debris" },
  { value: "Construction Debris", label: "Construction Debris" },
  { value: "Farm Equipment & Fencing", label: "Farm Equipment & Fencing" },
  { value: "Full Property Cleanout", label: "Full Property Cleanout" },
];

export default function LpJunkWestPalmBeach() {
  return (
    <>
      <LandingHero
        title="West Palm Beach Junk Removal"
        subtitle="Starting at $75/ton &middot; Same-Day Service Available"
      />
      <LandingTrustStrip items={TRUST_ITEMS} />
      <main>
        <section className="flex flex-wrap gap-10 max-w-[1100px] mx-auto py-12 px-5 max-md:flex-col max-md:py-8 max-md:px-4">
          <LandingForm
            formSubject="New Lead: Junk Removal - West Palm Beach"
            selectLabel="What Do You Need Removed? *"
            selectOptions={JUNK_OPTIONS}
            addressPlaceholder="Property Address in West Palm Beach *"
            messagePlaceholder="Tell us about your needs (number of stalls, pickup frequency, etc.)"
          />
          <div className="flex-1 min-w-[280px]">
            <h3 className="text-primary-dark mt-0">Why West Palm Beach Chooses Us</h3>
            <ul className="pl-5 leading-8">
              <li>Transparent pricing from <strong>$75/ton</strong></li>
              <li>Same-day and next-day service available</li>
              <li>We haul furniture, appliances, yard waste, construction debris, and more</li>
              <li>Heavy-duty dump trailer for large loads</li>
              <li>Eco-friendly recycling and disposal</li>
              <li>Serving homeowners, businesses, and farms across West Palm Beach</li>
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
          <h2 className="mb-2.5">Ready to Clear Out the Junk?</h2>
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
