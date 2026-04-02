import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Spring Special — 15% Off Farm Services | My Horse Farm",
  description:
    "Limited time: 15% off post-season farm services in Wellington, Loxahatchee & Royal Palm Beach. Manure removal, farm repairs, junk removal, sod installation. Book before April 30. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/spring-special" },
  openGraph: {
    title: "Spring Special — 15% Off Farm Services | My Horse Farm",
    description:
      "Limited time: 15% off post-season farm services in Wellington, Loxahatchee & Royal Palm Beach. Book before April 30.",
    type: "website",
    url: "https://www.myhorsefarm.com/spring-special",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spring Special — 15% Off Farm Services | My Horse Farm",
    description:
      "Limited time: 15% off post-season farm services in Wellington, Loxahatchee & Royal Palm Beach. Book before April 30.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const services = [
  {
    icon: "fas fa-dumpster",
    name: "Manure Removal",
    desc: "Post-season cleanout and ongoing pickup. Start fresh for summer.",
    key: "manure_removal",
  },
  {
    icon: "fas fa-wrench",
    name: "Farm Repairs",
    desc: "Fence repair, barn fixes, stall doors, gate repair. Fix what season broke.",
    key: "farm_repairs",
  },
  {
    icon: "fas fa-broom",
    name: "Junk Removal",
    desc: "Property cleanouts, debris hauling, old equipment removal.",
    key: "junk_removal",
  },
  {
    icon: "fas fa-seedling",
    name: "Sod Installation",
    desc: "Paddock resodding, pasture repair. Spring is the best time to plant in FL.",
    key: "sod_installation",
  },
  {
    icon: "fas fa-truck",
    name: "Fill Dirt",
    desc: "Arena resurfacing, driveway grading, paddock leveling.",
    key: "fill_dirt",
  },
  {
    icon: "fas fa-spray-can-sparkles",
    name: "Pressure Washing",
    desc: "Barns, fences, stalls, driveways. Remove mold and season grime.",
    key: "pressure_washing",
  },
];

const whyBookNow = [
  {
    icon: "fas fa-calendar-check",
    text: "Crews are available — we're less busy after season",
  },
  {
    icon: "fas fa-cloud-bolt",
    text: "Fix damage before summer storms make it worse",
  },
  {
    icon: "fas fa-percent",
    text: "15% off won't last — offer ends April 30",
  },
  {
    icon: "fas fa-medal",
    text: "Same quality service, better pricing",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Spring Special — 15% Off Farm Services",
  provider: {
    "@type": "LocalBusiness",
    name: "My Horse Farm",
    telephone: "(561) 576-7667",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Royal Palm Beach",
      addressRegion: "FL",
      postalCode: "33411",
      addressCountry: "US",
    },
  },
  areaServed: [
    { "@type": "City", name: "Wellington" },
    { "@type": "City", name: "Loxahatchee" },
    { "@type": "City", name: "Royal Palm Beach" },
    { "@type": "City", name: "West Palm Beach" },
  ],
  offers: {
    "@type": "Offer",
    description: "15% off all farm services for new bookings",
    validThrough: "2026-04-30",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services are included in the Spring Special?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 15% discount applies to all farm services including manure removal, farm repairs, junk removal, sod installation, fill dirt delivery, and pressure washing. The offer is valid for new bookings made before April 30, 2026.",
      },
    },
    {
      "@type": "Question",
      name: "How do I claim the 15% Spring Special discount?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply request a quote online or call us at (561) 576-7667 and mention the Spring Special. The discount will be applied to your quote automatically for online requests. The offer is valid through April 30, 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Can I combine the Spring Special with other offers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Spring Special cannot be combined with other promotions or discounts. It applies to new bookings only and is valid through April 30, 2026. Contact us if you have questions about eligibility.",
      },
    },
  ],
};

export default function SpringSpecialPage() {
  return (
    <>
      <main>
        {/* Hero Section — green gradient */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c1f] via-[#2d7a32] to-[#1a3d1c]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
          <div className="relative max-w-[1100px] mx-auto px-5 py-24 text-center max-md:py-16 max-md:px-4">
            <span className="inline-block bg-[#d4a843] text-[#1a3009] font-extrabold text-sm uppercase tracking-widest px-5 py-2 rounded-full mb-6 shadow-lg shadow-[#d4a843]/30">
              Limited Time Offer
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
              Spring Special:{" "}
              <span className="text-[#d4a843]">15% Off</span>
              <br className="max-md:hidden" /> All Farm Services
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-[700px] mx-auto mb-4 leading-relaxed">
              Season&apos;s over — time to fix up your farm.
              <br className="max-md:hidden" /> Book before April 30th and save.
            </p>
            <p className="inline-flex items-center gap-2 text-[#d4a843] font-bold text-lg bg-white/10 backdrop-blur-sm px-6 py-2.5 rounded-full mb-8">
              <i className="fas fa-clock" />
              Offer expires April 30, 2026
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-[#d4a843] text-[#1a3009] font-extrabold text-lg px-9 py-4 rounded-xl hover:bg-[#e0b654] transition-all shadow-lg shadow-[#d4a843]/30 no-underline"
              >
                Get Your Free Quote
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold text-lg px-9 py-4 rounded-xl hover:bg-white/10 transition-all no-underline"
              >
                <i className="fas fa-phone text-sm" />
                Call {PHONE_OFFICE}
              </a>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="bg-white py-20 px-5 max-md:py-12 max-md:px-4">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2d5016] mb-3">
              What&apos;s Included
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-[600px] mx-auto text-lg">
              Every service below qualifies for the 15% Spring Special discount.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <Link
                  key={svc.key}
                  href={`/quote?service=${svc.key}`}
                  className="group block bg-white border-2 border-gray-100 rounded-2xl p-7 hover:border-[#2d5016]/40 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-[#2d5016]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#2d5016] transition-colors">
                    <i className={`${svc.icon} text-xl text-[#2d5016] group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2d5016] transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    {svc.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2d5016] uppercase tracking-wide">
                    Get Quote
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Book Now */}
        <section className="bg-[#1a3009] text-white py-20 px-5 max-md:py-12 max-md:px-4">
          <div className="max-w-[900px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Book Now?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyBookNow.map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-[#d4a843] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-[#1a3009] text-lg`} />
                  </div>
                  <p className="text-lg text-white/90 font-medium leading-relaxed pt-2">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#f8f5ee] py-20 px-5 max-md:py-12 max-md:px-4">
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {[
                {
                  step: "1",
                  icon: "fas fa-comment-dots",
                  title: "Text or Call Us",
                  desc: "Tell us what you need. Call, text, or request a quote online.",
                },
                {
                  step: "2",
                  icon: "fas fa-file-invoice-dollar",
                  title: "Get a Free Quote",
                  desc: "We'll send you a detailed quote within 24 hours. No obligation.",
                },
                {
                  step: "3",
                  icon: "fas fa-check-circle",
                  title: "We Get It Done",
                  desc: "Our crew shows up on time, does the work right, and leaves your farm looking great.",
                },
              ].map((item) => (
                <div key={item.step}>
                  <div className="w-16 h-16 bg-[#2d5016] text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <i className={`${item.icon} text-2xl`} />
                  </div>
                  <div className="text-xs font-extrabold text-[#d4a843] tracking-widest mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-[#2d5016] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-white py-20 px-5 max-md:py-12 max-md:px-4">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-[#d4a843] text-xl" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-6 italic">
              &ldquo;They showed up on time, cleaned out years of junk from our barn, and had the whole property looking brand new in one day. Best crew in Wellington.&rdquo;
            </blockquote>
            <p className="text-lg font-bold text-[#2d5016]">
              Sarah M.{" "}
              <span className="font-normal text-gray-400">
                &mdash; Wellington, FL
              </span>
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-[#2d5016] via-[#1a5c1f] to-[#1a3009] text-white py-20 px-5 max-md:py-14 max-md:px-4">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
              Ready to Save <span className="text-[#d4a843]">15%</span>?
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-[600px] mx-auto leading-relaxed">
              Get a free quote in minutes. We&apos;ll have your farm looking its best before summer hits.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-6">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-[#d4a843] text-[#1a3009] font-extrabold text-lg px-10 py-4 rounded-xl hover:bg-[#e0b654] transition-all shadow-lg shadow-[#d4a843]/30 no-underline"
              >
                Get Your Free Quote
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="inline-flex items-center gap-2 bg-white text-[#2d5016] font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-all no-underline"
              >
                <i className="fas fa-phone text-sm" />
                Call {PHONE_OFFICE}
              </a>
            </div>
            <a
              href="https://wa.me/15615767667?text=Hi%2C%20I%27m%20interested%20in%20the%20Spring%20Special"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors"
            >
              <i className="fab fa-whatsapp text-xl text-green-400" />
              Or text us on WhatsApp
            </a>
            <p className="mt-8 text-sm text-white/40">
              Offer valid through April 30, 2026. Applies to new bookings only.
              Cannot be combined with other promotions.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
    </>
  );
}
