import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceCalendar from "@/components/ServiceCalendar";
import HubSpotForm from "@/components/HubSpotForm";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
  PHONE_CELL,
  PHONE_CELL_TEL,
  EMAIL_SALES,
  EMAIL_FORM,
  SOCIAL,
  ADDRESS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Horse Farm – Agricultural Service Company",
  description:
    "My Horse Farm provides premier agricultural services for equestrians in Royal Palm Beach, Florida.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/" },
  openGraph: {
    title:
      "My Horse Farm – Agricultural Service Company in Royal Palm Beach, FL",
    description:
      "Premier agricultural services for equestrians in Royal Palm Beach, FL. Sod installation, manure removal, junk removal, dumpster rental, fill dirt and farm repairs.",
    type: "website",
    url: "https://www.myhorsefarm.com/",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title:
      "My Horse Farm – Agricultural Service Company in Royal Palm Beach, FL",
    description:
      "Premier agricultural services for equestrians in Royal Palm Beach, FL. Sod installation, manure removal, junk removal, dumpster rental, fill dirt and farm repairs.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.myhorsefarm.com/#organization",
  name: "My Horse Farm",
  description:
    "My Horse Farm provides premier agricultural and equestrian services in Royal Palm Beach, Florida, including sod installation, manure removal, junk removal, dumpster rental, fill dirt delivery and farm repairs.",
  url: "https://www.myhorsefarm.com",
  logo: "https://www.myhorsefarm.com/logo.png",
  image: "https://www.myhorsefarm.com/logo.png",
  telephone: "(561) 576-7667",
  email: "sales@myhorsefarm.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Royal Palm Beach",
    addressRegion: "FL",
    postalCode: "33411",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Royal Palm Beach" },
    { "@type": "City", name: "Wellington" },
    { "@type": "City", name: "Loxahatchee" },
    { "@type": "City", name: "West Palm Beach" },
    { "@type": "City", name: "Palm Beach Gardens" },
  ],
  founder: {
    "@type": "Person",
    name: "Jose Gomez",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "(561) 576-7667",
    contactType: "customer service",
    availableLanguage: ["English", "Spanish"],
  },
  sameAs: [
    "https://www.facebook.com/myhorsefarmapp",
    "https://www.instagram.com/myhorsefarmservice/",
    "https://www.youtube.com/@horsedadtv9292",
    SOCIAL.google,
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Agricultural & Equestrian Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sod Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manure Bin & Waste Removal" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Junk Removal" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dumpster Rental" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fill Dirt Delivery" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Farm Repairs & Maintenance" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "1",
    bestRating: "5",
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What areas do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve Royal Palm Beach, Wellington, Loxahatchee, Loxahatchee Groves, West Palm Beach and Palm Beach Gardens. If you\u2019re in Palm Beach County and nearby, contact us \u2014 we may be able to accommodate your location.",
      },
    },
    {
      "@type": "Question",
      name: "How is pricing determined?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the type of service and scope of work. Junk removal starts at $75 per ton. For services like sod installation, fill dirt delivery, dumpster rental and manure removal, we provide custom quotes based on your specific needs. Contact us for a free estimate.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer same-day service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer same-day and next-day service for junk removal and many other services, subject to availability. Call us at (561) 576-7667 for urgent requests and we\u2019ll do our best to accommodate your schedule.",
      },
    },
    {
      "@type": "Question",
      name: "Are you licensed and insured?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. My Horse Farm is fully licensed and insured in the state of Florida. We comply with all Palm Beach County regulations for waste disposal, hauling and agricultural services.",
      },
    },
    {
      "@type": "Question",
      name: "How do I schedule a service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book online using our scheduling system on our website, call us at (561) 576-7667, or fill out the contact form. We\u2019ll confirm your appointment and answer any questions you have.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide manure bins, or do I need my own?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide leak-proof manure bins and dumpsters as part of our service. We deliver the container, schedule regular pickups and handle all disposal. You don\u2019t need to supply your own bin.",
      },
    },
    {
      "@type": "Question",
      name: "What makes your disposal eco-friendly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We dispose of waste at approved facilities and recycle materials whenever possible. For manure, we work with composting facilities. For junk removal, we sort items for recycling, donation and responsible disposal to minimize landfill impact.",
      },
    },
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "My Horse Farm",
  url: "https://www.myhorsefarm.com",
  publisher: { "@id": "https://www.myhorsefarm.com/#organization" },
};

const services = [
  {
    title: "Manure Removal",
    description: "Scheduled pickups and leak-proof bin rentals keep your property clean and odor-free.",
    icon: "fas fa-recycle",
    href: "/manure-removal",
    color: "from-green-600 to-green-700",
  },
  {
    title: "Junk Removal",
    description: "Clear debris, old fencing, and farm waste. Starting at $75/ton with same-day availability.",
    icon: "fas fa-truck-pickup",
    href: "/junk-removal",
    color: "from-amber-600 to-amber-700",
  },
  {
    title: "Sod Installation",
    description: "Lush, durable sod for paddocks and arenas. Delivered, graded, and professionally installed.",
    icon: "fas fa-seedling",
    href: "/sod-installation",
    color: "from-lime-600 to-lime-700",
  },
  {
    title: "Dumpster Rental",
    description: "20-yard dumpsters for cleanouts, renovations, and large projects. Drop-off and haul-away.",
    icon: "fas fa-dumpster",
    href: "/dumpster-rental",
    color: "from-sky-600 to-sky-700",
  },
  {
    title: "Fill Dirt",
    description: "Quality fill dirt for leveling, berms, and new paddock construction. Delivered direct.",
    icon: "fas fa-mountain",
    href: "/fill-dirt",
    color: "from-orange-600 to-orange-700",
  },
  {
    title: "Farm Repairs",
    description: "Fences, stalls, paddocks, driveways. We keep your farm facilities in top working condition.",
    icon: "fas fa-wrench",
    href: "/repairs",
    color: "from-slate-600 to-slate-700",
  },
  {
    title: "Season-Ready Package",
    description: "Full property preparation for equestrian season. Bundled services at a better rate.",
    icon: "fas fa-horse",
    href: "/season-ready",
    color: "from-purple-600 to-purple-700",
  },
];

const metrics = [
  { number: "10+", label: "Years Experience", icon: "fas fa-calendar-check" },
  { number: "400+", label: "Happy Clients", icon: "fas fa-users" },
  { number: "1,000+", label: "Tons Hauled", icon: "fas fa-weight-hanging" },
  { number: "5.0", label: "Google Rating", icon: "fas fa-star" },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="My Horse Farm"
        tagline="Premier agricultural services for equestrian properties across Palm Beach County. Manure removal, junk hauling, sod, fill dirt, and farm repairs."
        ctaText="Get a Quote"
        ctaHref="/quote"
      />

      <main>
        {/* Trust Badges */}
        <TrustBadges />

        {/* Metrics */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                    <i className={`${m.icon} text-primary text-lg`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-primary font-[family-name:var(--font-heading)] tracking-tight">
                    {m.number}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Do</h2>
              <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                Everything your horse farm needs, from one dependable team.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc) => (
                <Link
                  key={svc.title}
                  href={svc.href}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover block"
                >
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${svc.color} text-white mb-4`}>
                    <i className={`${svc.icon} text-base`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {svc.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#1a3d1c] via-[#2d6a30] to-[#1e4d20] text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-3 text-lg text-white/60">Three steps to a cleaner, better farm.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Get a Quote", desc: "Tell us what you need online, by phone, or through our AI chat. We respond fast with honest pricing.", icon: "fas fa-comment-dots" },
                { step: "02", title: "We Show Up", desc: "On-time, every time. Our crew arrives with the right equipment and gets straight to work.", icon: "fas fa-truck" },
                { step: "03", title: "Job Done Right", desc: "Clean site, weight tickets, eco-friendly disposal. You focus on your horses, we handle the rest.", icon: "fas fa-check-circle" },
              ].map((item) => (
                <div key={item.step} className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                    <i className={`${item.icon} text-xl text-accent`} />
                  </div>
                  <div className="text-xs font-bold text-accent tracking-widest mb-1">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light transition-all"
              >
                Get Your Free Quote
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: text */}
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                  <i className="fas fa-horse text-xs" />
                  Horse Owners Serving Horse Owners
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Built on Consistency. Driven by Grit.
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Based in Royal Palm Beach, My Horse Farm specializes in comprehensive
                  equestrian property services. From installing lush sod and delivering recycled
                  millings asphalt to providing manure bins, waste removal, fill dirt, dumpsters,
                  and skilled farm repairs.
                </p>
                <p className="text-gray-500 leading-relaxed mb-8">
                  We&apos;re horse owners ourselves, so we know what horses (and their owners)
                  need for safe, clean, and functional spaces. We proudly sponsor local equestrian
                  events and are committed to eco-friendly practices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/quote"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Get Started
                  </Link>
                  <a
                    href={`tel:${PHONE_OFFICE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors"
                  >
                    <i className="fas fa-phone text-sm" />
                    Call Us
                  </a>
                </div>
              </div>

              {/* Right: founder card + highlights */}
              <div className="space-y-5">
                <div className="bg-warm rounded-2xl p-6 border border-accent/15">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className="fas fa-user text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">Jose Gomez</div>
                      <div className="text-sm font-medium text-primary mb-3">Founder &amp; Operator</div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        With nearly 20 years in the livestock waste and equestrian support
                        industry, Jose built My Horse Farm into a trusted name among farm
                        owners, boarding facilities, and property managers throughout Palm Beach
                        County. He remains actively involved in operations, client relationships,
                        and every job&apos;s quality.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "fas fa-shield-halved", text: "Fully Licensed & Insured" },
                    { icon: "fas fa-leaf", text: "Eco-Friendly Disposal" },
                    { icon: "fas fa-clock", text: "Same-Day Available" },
                    { icon: "fas fa-comments", text: "Bilingual: EN / ES" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <i className={`${item.icon} text-primary text-sm`} />
                      <span className="text-sm font-medium text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Proudly Serving Palm Beach County</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {["Wellington", "Royal Palm Beach", "Loxahatchee", "Loxahatchee Groves", "West Palm Beach", "Palm Beach Gardens"].map((area) => (
                <span key={area} className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                  <i className="fas fa-map-pin text-primary text-xs mr-1.5" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <FaqAccordion />

        {/* Calendar */}
        <section id="schedule">
          <ServiceCalendar />
        </section>

        {/* Contact */}
        <section id="contact" className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h2>
              <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                Ready to book a service or have questions? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <HubSpotForm />
              </div>
              <div className="space-y-4">
                {[
                  { icon: "fas fa-phone", label: "Office", value: PHONE_OFFICE, href: `tel:${PHONE_OFFICE_TEL}` },
                  { icon: "fas fa-phone", label: "Cell", value: PHONE_CELL, href: `tel:${PHONE_CELL_TEL}` },
                  { icon: "fas fa-envelope", label: "Email", value: EMAIL_FORM, href: `mailto:${EMAIL_FORM}` },
                  { icon: "fas fa-envelope", label: "Sales", value: EMAIL_SALES, href: `mailto:${EMAIL_SALES}` },
                  { icon: "fas fa-map-marker-alt", label: "Location", value: ADDRESS },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0">
                      <i className={`${item.icon} text-primary text-sm`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium text-gray-700">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
                <a
                  href={SOCIAL.google}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0">
                    <i className="fab fa-google text-primary text-sm" />
                  </div>
                  <span className="text-sm font-semibold text-primary">Find Us on Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaMarkup schema={localBusinessSchema} />
      <SchemaMarkup schema={faqPageSchema} />
      <SchemaMarkup schema={webSiteSchema} />
    </>
  );
}
