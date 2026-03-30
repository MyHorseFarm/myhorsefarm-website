import type { Metadata } from "next";
import LandingHero from "@/components/LandingHero";
import LandingTrustStrip from "@/components/LandingTrustStrip";
import LandingForm from "@/components/LandingForm";
import LandingTestimonials from "@/components/LandingTestimonials";
import LandingFooter from "@/components/LandingFooter";
import LandingStickyMobileCTA from "@/components/LandingStickyMobileCTA";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";
import { getLandingPageData } from "@/lib/landing-data";

export const metadata: Metadata = {
  title: "Junk Removal Loxahatchee FL | Call (561) 576-7667",
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

export default async function LpJunkLoxahatchee() {
  const { slotsLeft, reviewCount, avgRating } = await getLandingPageData();

  return (
    <>
      <LandingHero
        title="Loxahatchee Junk Removal"
        subtitle="40-Yard Dump Trailer &middot; Skid Steer &middot; Same-Day Service"
        slotsLeft={slotsLeft}
      />
      <LandingTrustStrip items={TRUST_ITEMS} reviewCount={reviewCount} avgRating={avgRating} />
      <main>
        <section className="flex flex-wrap gap-10 max-w-[1100px] mx-auto py-12 px-5 max-md:flex-col max-md:py-8 max-md:px-4">
          <LandingForm
            serviceKey="junk_removal"
            locationKey="loxahatchee"
            selectLabel="What Do You Need Removed? *"
            selectOptions={JUNK_OPTIONS}
            addressPlaceholder="Property Address in Loxahatchee *"
            messagePlaceholder="Tell us about your needs (number of stalls, pickup frequency, etc.)"
          />
          <div className="flex-1 min-w-[280px]">
            <h3 className="text-primary-dark mt-0">Why Loxahatchee Trusts Us for Junk Removal</h3>
            <ul className="pl-5 leading-8">
              <li><strong>40-yard dump trailer</strong> for massive property cleanouts</li>
              <li><strong>Skid steer &amp; loader</strong> — no pile too big</li>
              <li>Full crew included — we haul it all</li>
              <li>Same-day and next-day service available</li>
              <li>Green waste, old fencing, equipment, construction debris &amp; more</li>
              <li>Licensed, insured &amp; trusted by Loxahatchee farms and ranches</li>
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
        <section className="text-center py-12 px-5 bg-white max-md:pb-20">
          <h2 className="mb-2.5">Ready to Clear Out the Junk?</h2>
          <p className="text-gray-600 mb-5 text-[1.05rem]">Call now for same-day service or fill out the form above for a free quote.</p>
          <a href={`tel:${PHONE_OFFICE_TEL}`} className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors no-underline">
            <i className="fas fa-phone" /> Call {PHONE_OFFICE}
          </a>
        </section>
      </main>
      <LandingFooter />
      <LandingStickyMobileCTA quoteUrl="/quote?service=junk_removal" />
    </>
  );
}
