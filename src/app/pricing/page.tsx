import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Service Pricing & Rates",
  description:
    "Transparent pricing for manure removal, junk removal, dumpster rental, sod installation, fill dirt, farm repairs, and season-ready packages in Palm Beach County. No hidden fees.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/pricing" },
  openGraph: {
    title: "Service Pricing & Rates | My Horse Farm",
    description:
      "Transparent pricing for manure removal, junk removal, dumpster rental, sod installation, fill dirt, farm repairs, and season-ready packages. No hidden fees.",
    type: "website",
    url: "https://www.myhorsefarm.com/pricing",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Service Pricing & Rates | My Horse Farm",
    description:
      "Transparent pricing for all farm and property services in Palm Beach County. No hidden fees, no surprises.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const services = [
  {
    key: "manure-removal",
    name: "Yard Trash Bin Service",
    icon: "fas fa-trash-can",
    image: "/images/bins-at-barn.jpg",
    price: "$25",
    priceUnit: "/pickup",
    priceNote: "One-time bin drop-off fee: $100. Or purchase your own bin.",
    includes: [
      "Scheduled bin pickups",
      "Bin available for purchase or rental",
      "$100 one-time drop-off fee",
      "Eco-friendly, approved disposal",
    ],
  },
  {
    key: "manure-removal",
    name: "Bulk Livestock Waste Removal",
    icon: "fas fa-truck-monster",
    image: "/images/service-bulk-manure.jpg",
    price: "$300",
    priceUnit: "+",
    priceNote: "Full truckload. 20–40 yards of manure hauled per load.",
    includes: [
      "Dump trailer + machine on-site",
      "20–40 cubic yards per truckload",
      "Price varies by load size",
      "Ideal for large farms and seasonal cleanouts",
    ],
  },
  {
    key: "junk-removal",
    name: "Junk Removal",
    icon: "fas fa-truck-pickup",
    image: "/images/service-junk.jpg",
    price: "$75",
    priceUnit: "/ton",
    priceNote: "Farm debris, old fencing, equipment, furniture.",
    includes: [
      "Same-day service available",
      "Weight tickets provided",
      "Old fencing, equipment, and debris",
      "Responsible disposal and recycling",
    ],
  },
  {
    key: "dumpster-rental",
    name: "Dumpster Rental",
    icon: "fas fa-dumpster",
    image: "/images/mhf-trailer-at-farm.jpg",
    price: "$350",
    priceUnit: "",
    priceNote: "20-yard roll-off dumpster. 7-day rental included.",
    includes: [
      "20-yard roll-off dumpster",
      "Delivery, pickup, and disposal included",
      "7-day rental period",
      "Additional days just $15/day",
    ],
  },
  {
    key: "sod-installation",
    name: "Sod Installation",
    icon: "fas fa-seedling",
    image: "/images/sod-delivery.jpg",
    price: "$0.85",
    priceUnit: "/sq ft",
    priceNote: "Installed. St. Augustine, Bahia, and Zoysia varieties.",
    includes: [
      "Site prep and grading included",
      "Sod delivery and professional installation",
      "St. Augustine, Bahia, Zoysia available",
      "Paddocks, lawns, and common areas",
    ],
  },
  {
    key: "fill-dirt",
    name: "Fill Dirt",
    icon: "fas fa-mountain",
    image: "/images/service-fill-dirt.jpg",
    price: "$35",
    priceUnit: "/cu yd",
    priceNote: "Delivered. Minimum 10 yards.",
    includes: [
      "Quality fill dirt delivered to your property",
      "Grading and leveling available",
      "Minimum 10 cubic yards",
      "Paddock and arena construction",
    ],
  },
  {
    key: "repairs",
    name: "Farm Repairs",
    icon: "fas fa-tools",
    image: "/images/service-repairs.jpg",
    price: "$125",
    priceUnit: "+",
    priceNote: "Gate repair from $125. Fence from $150. Stalls from $200.",
    includes: [
      "Fence repair and replacement",
      "Stall and barn repairs",
      "Gate repair and installation",
      "Free on-site estimates",
    ],
  },
];

const whyPoints = [
  {
    icon: "fas fa-shield-halved",
    title: "No Hidden Fees",
    description: "The price we quote is the price you pay. Period.",
  },
  {
    icon: "fas fa-weight-hanging",
    title: "Weight Tickets Provided",
    description: "Transparent documentation on every hauling job.",
  },
  {
    icon: "fas fa-clipboard-check",
    title: "Free Estimates",
    description: "On-site estimates at no cost, no obligation.",
  },
  {
    icon: "fas fa-handshake",
    title: "Satisfaction Guaranteed",
    description: "If you are not happy, we make it right.",
  },
];

const pricingFaqs = [
  {
    q: "Do you charge extra for delivery or pickup?",
    a: "No. Delivery and pickup are included in our dumpster rental and fill dirt pricing. For manure removal, bin delivery is included with your service plan.",
  },
  {
    q: "Is there a minimum order for fill dirt?",
    a: "Yes, our minimum order for fill dirt delivery is 10 cubic yards. This helps us keep pricing low and delivery efficient.",
  },
  {
    q: "How is junk removal pricing calculated?",
    a: "Junk removal is priced by weight at $75 per ton. We provide weight tickets so you know exactly what you are paying for. No guesswork.",
  },
  {
    q: "Can I bundle multiple services for a discount?",
    a: "Absolutely. Our Season-Ready Package bundles manure cleanup, paddock grading, fence checks, and property cleanout at 15% off individual pricing. We also offer custom bundles for ongoing clients.",
  },
  {
    q: "Do you offer ongoing service contracts?",
    a: "Yes. We offer weekly and bi-weekly manure removal plans as well as ongoing maintenance agreements. Regular clients enjoy priority scheduling and consistent pricing.",
  },
];

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const serviceSchemas = [
  ...services.map((svc) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    provider: {
      "@type": "LocalBusiness",
      name: "My Horse Farm",
      "@id": "https://www.myhorsefarm.com/#organization",
    },
    areaServed: {
      "@type": "State",
      name: "Florida",
    },
    description: svc.priceNote,
  })),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Season-Ready Package",
    provider: {
      "@type": "LocalBusiness",
      name: "My Horse Farm",
      "@id": "https://www.myhorsefarm.com/#organization",
    },
    areaServed: {
      "@type": "State",
      name: "Florida",
    },
    description:
      "Bundled manure cleanup, paddock grading, fence check, and property cleanout. Save 15% vs individual services.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Hero
        short
        title="Transparent Pricing"
        tagline="No hidden fees. No surprises. Just honest pricing for every service."
      />

      <main>
        {/* Service Pricing Cards */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <i className="fas fa-tag text-xs" />
                Our Rates
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                Simple, Honest Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Every service includes professional crews, proper equipment, and
                eco-friendly disposal. No hidden charges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, idx) => (
                <div
                  key={`${svc.key}-${idx}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Service photo */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={svc.image}
                      alt={svc.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold text-white bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        From {svc.price}{svc.priceUnit}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {svc.name}
                  </h3>

                  <div className="mb-4">
                    <span className="text-3xl font-black text-gray-900">
                      {svc.price}
                    </span>
                    {svc.priceUnit && (
                      <span className="text-base font-medium text-gray-400 ml-1">
                        {svc.priceUnit}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {svc.priceNote}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {svc.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <i className="fas fa-check text-primary text-xs mt-1 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/quote?service=${svc.key}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm"
                  >
                    Get a Quote
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Season-Ready Featured Package */}
            <div className="mt-8 bg-gradient-to-r from-primary to-primary-dark rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-8 md:p-10 text-white">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest mb-3">
                    <i className="fas fa-horse text-xs" />
                    BEST VALUE
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    Season-Ready Package
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black">$1,500</span>
                    <span className="text-base font-medium text-white/60 ml-2">
                      starting price
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed max-w-lg mb-6">
                    Full property preparation for equestrian season. Bundled
                    manure cleanup, paddock grading, fence check, and property
                    cleanout in one visit. Save 15% compared to booking each
                    service individually.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                    {[
                      "Manure cleanup and bin setup",
                      "Paddock grading and leveling",
                      "Fence and gate inspection",
                      "Property debris cleanout",
                      "Priority scheduling",
                      "Save 15% vs individual services",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-white/80"
                      >
                        <i className="fas fa-check text-accent text-xs mt-1 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/quote?service=season-ready"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light transition-all"
                  >
                    Get Package Quote
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="hidden md:flex items-center justify-center bg-white/5 px-12">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-percent text-accent text-3xl" />
                    </div>
                    <div className="text-4xl font-black text-accent">15%</div>
                    <div className="text-sm font-semibold text-white/60 mt-1">
                      Bundle Savings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Our Pricing Works */}
        <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Why Our Pricing Works
              </h2>
              <p className="mt-3 text-gray-500">
                Straightforward pricing you can count on.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyPoints.map((point) => (
                <div
                  key={point.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-4">
                    <i className={`${point.icon} text-primary text-lg`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-500">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Pricing Questions
              </h2>
              <p className="mt-3 text-gray-500">
                Common questions about our rates and billing.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {pricingFaqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <div className="w-1 self-stretch rounded-full bg-transparent group-open:bg-primary transition-colors" />
                    <span className="flex-1 text-base font-semibold text-gray-800">
                      {faq.q}
                    </span>
                    <svg
                      className="w-5 h-5 text-primary shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="px-6 pl-11 pb-5 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 md:py-20 bg-[#1a2e1c] text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Get a free custom quote tailored to your property. No obligation,
              no pressure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light transition-all"
              >
                Get a Free Quote
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all"
              >
                <i className="fas fa-phone text-sm" />
                {PHONE_OFFICE}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaMarkup schema={faqPageSchema} />
      {serviceSchemas.map((schema, i) => (
        <SchemaMarkup key={i} schema={schema} />
      ))}
    </>
  );
}
