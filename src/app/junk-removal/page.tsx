import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Junk Removal & Hauling Services | 40-Yard Dump Trailer",
  description:
    "Professional junk removal in Royal Palm Beach, Wellington & Loxahatchee FL. 40-yard dump trailer, skid steer, loader & crew. Green waste, construction debris, property cleanouts. Same-day service. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/junk-removal" },
  openGraph: {
    title:
      "Junk Removal & Hauling | 40-Yard Dump Trailer",
    description:
      "Full-service junk removal with heavy equipment. 40-yard dump trailer, skid steer, loader & crew. Green waste, construction debris, property cleanouts in Palm Beach County.",
    type: "website",
    url: "https://www.myhorsefarm.com/junk-removal",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Junk Removal & Hauling",
    description:
      "40-yard dump trailer, skid steer, loader & crew. Green waste, construction debris, property cleanouts in Palm Beach County FL.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const EQUIPMENT = [
  {
    icon: "fas fa-truck-moving",
    title: "40-Yard Dump Trailer",
    desc: "Our massive 40-yard dump trailer handles large-scale cleanouts in a single trip. Perfect for construction debris, green waste, and full property cleanups.",
  },
  {
    icon: "fas fa-tractor",
    title: "Skid Steer",
    desc: "For heavy material that can't be moved by hand. We bring our skid steer to load debris, dirt, concrete, and bulky items fast.",
  },
  {
    icon: "fas fa-cogs",
    title: "Front-End Loader",
    desc: "Our loader handles large piles of green waste, fill dirt, gravel, and construction materials. We load and haul in one operation.",
  },
  {
    icon: "fas fa-users",
    title: "Experienced Crew",
    desc: "Our team handles the heavy lifting. We pick up, sort, load, and haul everything so you don't have to touch it.",
  },
];

const SERVICES = [
  {
    title: "Green Waste & Yard Debris",
    desc: "Tree trimmings, palm fronds, brush, grass clippings, stumps, and landscaping waste. We load it with our equipment and haul it away.",
  },
  {
    title: "Construction Debris",
    desc: "Concrete, drywall, lumber, roofing, tile, and renovation waste. Our skid steer and dump trailer make quick work of job site cleanups.",
  },
  {
    title: "Property Cleanouts",
    desc: "Full property cleanouts for homes, farms, barns, and commercial lots. Furniture, appliances, old fencing, scrap metal — we take it all.",
  },
  {
    title: "Farm & Equestrian Cleanup",
    desc: "Barn cleanouts, old hay, broken equipment, fencing, and accumulated debris. We know farms — this is what we do.",
  },
  {
    title: "Furniture & Appliances",
    desc: "Sofas, mattresses, refrigerators, washers, dryers, hot tubs, and more. We carry it out and haul it off.",
  },
  {
    title: "Bulk Material Hauling",
    desc: "Dirt, gravel, sand, rock, mulch — if you need it moved, our dump trailer and loader handle it. Large or small loads.",
  },
];

export default function JunkRemovalPage() {
  return (
    <>
      <Hero
        title="Junk Removal & Hauling"
        tagline="40-Yard Dump Trailer &bull; Skid Steer &bull; Loader &bull; Full Crew"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=junk_removal"
      />
      <main>
        {/* Equipment Section */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              Heavy Equipment. Real Crew. Done Right.
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              We don&apos;t show up with a pickup truck and a prayer. We bring
              the equipment and manpower to handle any junk removal job in Palm
              Beach County.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {EQUIPMENT.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
                >
                  <i
                    className={`${item.icon} text-3xl text-primary mb-4 block`}
                  />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Remove */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              What We Remove
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              If it fits in our 40-yard dump trailer, we haul it. If it
              doesn&apos;t, we bring the skid steer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((svc) => (
                <div
                  key={svc.title}
                  className="border border-gray-200 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-primary-dark mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-28 px-6 bg-green-900 text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 md:text-4xl text-gray-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Get a Quote</h3>
                <p className="text-green-200">
                  Tell us what you need removed. Send photos if you can — we
                  give honest pricing, no hidden fees.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">We Show Up Ready</h3>
                <p className="text-green-200">
                  Our crew arrives with the dump trailer, skid steer, or loader
                  — whatever the job needs. Same-day service available.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Junk Gone</h3>
                <p className="text-green-200">
                  We load everything, sweep up, and haul it to the proper
                  disposal or recycling facility. You get your space back.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 md:text-4xl text-gray-900">
              Why Palm Beach County Trusts Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>40-yard dump trailer</strong> — handles massive loads
                    in one trip
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Heavy equipment</strong> — skid steer and loader for
                    big jobs
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full crew included</strong> — we do the lifting, you
                    watch
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Same-day service</strong> — call today, gone today
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed &amp; insured</strong> — fully compliant in
                    Florida
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Transparent pricing</strong> — no surprises, no
                    hidden fees
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Eco-friendly disposal</strong> — we recycle and
                    donate when possible
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>10+ years experience</strong> — serving 400+ clients
                    across PBC
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl text-gray-900">
              Service Area
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              We provide junk removal and hauling throughout Palm Beach County
              including Royal Palm Beach, Wellington, Loxahatchee, Loxahatchee
              Groves, West Palm Beach, and Palm Beach Gardens. If you&apos;re
              nearby, give us a call — we can probably get to you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "Royal Palm Beach",
                "Wellington",
                "Loxahatchee",
                "West Palm Beach",
                "Palm Beach Gardens",
                "Loxahatchee Groves",
              ].map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl text-gray-900">
            Ready to Clear It Out?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Get a free quote online or call us now. Same-day service available
            for most jobs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=junk_removal"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl text-lg hover:bg-primary-dark transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fas fa-phone mr-2" />
              {PHONE_OFFICE}
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Junk Removal and Hauling",
          provider: {
            "@type": "LocalBusiness",
            "@id": "https://www.myhorsefarm.com/#organization",
            name: "My Horse Farm",
            image: "https://www.myhorsefarm.com/images/hero-farm.jpg",
            telephone: "(561) 576-7667",
            email: "sales@myhorsefarm.com",
            priceRange: "$$",
            areaServed: [
              "Royal Palm Beach FL",
              "Wellington FL",
              "Loxahatchee FL",
              "West Palm Beach FL",
              "Palm Beach Gardens FL",
            ],
            url: "https://www.myhorsefarm.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Royal Palm Beach",
              addressRegion: "FL",
              postalCode: "33411",
              addressCountry: "US",
            },
            sameAs: [
              "https://www.facebook.com/myhorsefarmapp",
              "https://www.instagram.com/myhorsefarmservice/",
              "https://www.youtube.com/@horsedadtv9292",
            ],
          },
          description:
            "Professional junk removal and hauling with 40-yard dump trailer, skid steer, front-end loader, and experienced crew. Green waste, construction debris, property cleanouts, farm cleanup, and more in Palm Beach County FL.",
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: "75",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "75",
              priceCurrency: "USD",
              unitText: "TON",
            },
          },
        }}
      />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.myhorsefarm.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Junk Removal",
              item: "https://www.myhorsefarm.com/junk-removal",
            },
          ],
        }}
      />
    </>
  );
}
