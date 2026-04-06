import type { Metadata } from "next";
import LandingForm from "@/components/LandingForm";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Junk Removal in Palm Beach County | Free Estimate | My Horse Farm",
  description:
    "Same-day junk removal in Wellington, Loxahatchee, Royal Palm Beach & West Palm Beach. 40-yard dump trailer, skid steer, full crew. Free estimates. Call (561) 576-7667.",
  robots: "noindex, nofollow",
};

const TRUST = [
  { num: "500+", label: "Jobs Completed" },
  { num: "4.9★", label: "Google Rating" },
  { num: "Same Day", label: "Service Available" },
  { num: "Licensed", label: "& Insured" },
];

const ITEMS = [
  "Construction debris & concrete",
  "Green waste & yard debris",
  "Furniture & appliances",
  "Property & barn cleanouts",
  "Bulk dirt, gravel & fill",
  "Old fencing & scrap metal",
];

export default function JunkRemovalAdsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar — phone only, no nav */}
      <div className="bg-green-900 text-white py-3 px-4 text-center">
        <a
          href={`tel:${PHONE_OFFICE_TEL}`}
          className="text-lg font-bold hover:text-green-200 transition-colors"
        >
          <i className="fas fa-phone-alt mr-2" />
          Call Now: {PHONE_OFFICE}
        </a>
      </div>

      {/* Hero — headline + form side by side */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-12 md:py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — headline */}
          <div>
            <div className="inline-block bg-yellow-400 text-green-900 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Free Estimates — Same Day Service
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Junk Removal<br />
              <span className="text-green-300">Done Right.</span>
            </h1>
            <p className="text-lg text-green-100 mb-6 leading-relaxed">
              40-yard dump trailer, skid steer, front-end loader, and a full
              crew. We handle the heavy stuff so you don&apos;t have to.
            </p>
            <ul className="space-y-3 mb-8">
              {ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-green-100">
                  <i className="fas fa-check-circle text-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="bg-yellow-400 text-green-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors text-lg"
              >
                <i className="fas fa-phone-alt mr-2" />
                {PHONE_OFFICE}
              </a>
              <span className="text-green-300 text-sm">or fill out the form →</span>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Get Your Free Quote
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Tell us what you need removed. We&apos;ll get back to you fast.
            </p>
            <LandingForm
              serviceKey="junk_removal"
              locationKey="palm_beach"
              selectLabel="What do you need removed?"
              selectOptions={[
                { value: "yard_debris", label: "Green Waste / Yard Debris" },
                { value: "construction", label: "Construction Debris" },
                { value: "property_cleanout", label: "Full Property Cleanout" },
                { value: "furniture", label: "Furniture & Appliances" },
                { value: "farm_cleanout", label: "Farm / Barn Cleanout" },
                { value: "bulk_hauling", label: "Bulk Hauling (dirt, gravel, etc.)" },
                { value: "other", label: "Other" },
              ]}
              addressPlaceholder="Property address (city, zip)"
              messagePlaceholder="Tell us about the job — what needs to go, how much, any access issues?"
            />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-50 py-8 px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {TRUST.map((t) => (
            <div key={t.label}>
              <div className="text-2xl font-extrabold text-green-800">{t.num}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Request a Quote",
                desc: "Call us or fill out the form above. Tell us what you need removed and where.",
              },
              {
                step: "2",
                title: "We Show Up Ready",
                desc: "Our crew arrives with the dump trailer, skid steer, and everything needed. No second trips.",
              },
              {
                step: "3",
                title: "Gone. Done. Clean.",
                desc: "We load it, haul it, and dispose of it properly. You get your space back.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="bg-green-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Serving All of Palm Beach County</h2>
          <p className="text-green-200 mb-6">
            Wellington · Loxahatchee · Royal Palm Beach · West Palm Beach · Palm Beach Gardens · Lake Worth · Jupiter · Greenacres
          </p>
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className="inline-block bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-xl text-xl hover:bg-yellow-300 transition-colors"
          >
            <i className="fas fa-phone-alt mr-2" />
            Call {PHONE_OFFICE} — Free Estimate
          </a>
        </div>
      </section>

      {/* Footer — minimal */}
      <footer className="bg-gray-900 text-gray-400 py-6 px-6 text-center text-xs">
        <p>© {new Date().getFullYear()} My Horse Farm LLC · Licensed & Insured · Palm Beach County, FL</p>
      </footer>
    </div>
  );
}
