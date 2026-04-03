import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AnimatedStats from "@/components/AnimatedStats";
import WhyChooseUs from "@/components/WhyChooseUs";
import CtaBanner from "@/components/CtaBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceCalendar from "@/components/ServiceCalendar";
import HubSpotForm from "@/components/HubSpotForm";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
  EMAIL_SALES,
  SOCIAL,
  ADDRESS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Farm & Property Services in Palm Beach County | My Horse Farm",
  description:
    "Dumpster rentals, junk hauling, sod installation, fill dirt & farm services at the lowest prices in Palm Beach County. Call (561) 576-7667 for a free quote!",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/" },
  openGraph: {
    title:
      "My Horse Farm – Farm & Property Services in Palm Beach County, FL",
    description:
      "Your property, our problem. Dumpster rentals, junk removal, sod installation, fill dirt and farm services at the lowest prices in Palm Beach County.",
    type: "website",
    url: "https://www.myhorsefarm.com/",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "My Horse Farm – Farm & Property Services in Palm Beach County, FL",
    description:
      "Your property, our problem. Dumpster rentals, junk removal, sod installation, fill dirt and farm services at the lowest prices in Palm Beach County.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.myhorsefarm.com/#organization",
  name: "My Horse Farm",
  description:
    "My Horse Farm provides farm and property services in Palm Beach County, Florida, including dumpster rentals, junk removal, sod installation, fill dirt delivery, farm repairs and waste removal.",
  url: "https://www.myhorsefarm.com",
  logo: "https://www.myhorsefarm.com/logo.png",
  image: "https://www.myhorsefarm.com/images/hero-farm.jpg",
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
  founder: { "@type": "Person", name: "Jose Gomez" },
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
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dumpster Rental" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Junk Removal" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sod Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fill Dirt Delivery" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Farm Repairs & Maintenance" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Waste Removal" } },
    ],
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
    title: "Dumpster Rental",
    description: "20-yard roll-off dumpsters for cleanouts, renovations, and large projects. Drop-off and haul-away.",
    image: "/images/mhf-trailer-at-farm.jpg",
    href: "/dumpster-rental",
    price: "From $75/ton",
  },
  {
    title: "Junk Removal",
    description: "Clear debris, old fencing, and farm waste quickly. Same-day availability for urgent jobs.",
    image: "/images/service-junk.jpg",
    href: "/junk-removal",
    price: "From $75/ton",
  },
  {
    title: "Sod Installation",
    description: "Lush, durable sod for paddocks and arenas. Delivered, graded, and professionally installed.",
    image: "/images/sod-delivery.jpg",
    href: "/sod-installation",
    price: "Free Quote",
  },
  {
    title: "Fill Dirt",
    description: "Quality fill dirt for leveling, berms, and new paddock construction. Delivered direct to your property.",
    image: "/images/service-fill-dirt.jpg",
    href: "/fill-dirt",
    price: "Free Quote",
  },
  {
    title: "Farm Repairs",
    description: "Fences, stalls, paddocks, driveways. We keep your farm facilities in top working condition.",
    image: "/images/service-repairs.jpg",
    href: "/repairs",
    price: "Free Quote",
  },
  {
    title: "Manure Removal",
    description: "Bin pickups from $25 or bulk truckloads from $300. Keep your property clean and odor-free year-round.",
    image: "/images/bins-at-barn.jpg",
    href: "/manure-removal",
    price: "From $25",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="Your Property. Taken Care Of."
        tagline="Farm services, dumpster rentals, and hauling at the lowest prices in Palm Beach County. No hidden fees, no hassle."
        ctaText="See What It Costs"
        ctaHref="/quote"
      />

      <main>
        {/* Stats + Trust Badges */}
        <AnimatedStats />

        {/* Social Proof Strip */}
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-yellow-400 text-sm" />
              ))}
            </div>
            <p className="text-gray-600 italic text-sm md:text-base">&ldquo;Hands down the most dependable farm service company in the area. They show up on schedule, the property stays clean, and the communication is excellent.&rdquo;</p>
            <p className="text-gray-400 text-xs mt-1">&mdash; Sarah M., Wellington, FL</p>
          </div>
        </section>

        {/* Services with Photos */}
        <section id="services" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <i className="fas fa-tools text-xs" />
                Our Services
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                Everything Your Property Needs
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                One team, every service. We handle the heavy lifting so you can focus on what matters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <Link
                  key={svc.title}
                  href={svc.href}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover block"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold text-white bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {svc.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                      {svc.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Learn more
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Season-Ready Featured Banner */}
            <Link
              href="/season-ready"
              className="group mt-6 flex flex-col md:flex-row bg-gradient-to-r from-primary to-primary-dark rounded-2xl overflow-hidden card-hover"
            >
              <div className="relative md:w-1/3 aspect-[2/1] md:aspect-auto">
                <Image
                  src="/images/service-season.jpg"
                  alt="Season-Ready Package"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center text-white">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest mb-2">
                  <i className="fas fa-horse text-xs" />
                  FEATURED SERVICE
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Season-Ready Package</h3>
                <p className="text-white/70 leading-relaxed max-w-lg">
                  Full property preparation for equestrian season. Bundled services at a better rate &mdash; waste
                  cleanup, paddock grading, fence repairs, and more in one visit.
                </p>
                <div className="mt-5 flex items-center gap-2 text-accent font-semibold">
                  Get package details
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-28 bg-[#1a2e1c] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
              <p className="mt-4 text-lg text-white/50">Three steps to a cleaner, better farm.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                { step: "01", title: "Get a Quote", desc: "Tell us what you need online, by phone, or through our AI chat. We respond fast with honest pricing.", icon: "fas fa-comment-dots" },
                { step: "02", title: "We Show Up", desc: "On-time, every time. Our crew arrives with the right equipment and gets straight to work.", icon: "fas fa-truck" },
                { step: "03", title: "Job Done Right", desc: "Clean site, weight tickets, eco-friendly disposal. You focus on your horses, we handle the rest.", icon: "fas fa-check-circle" },
              ].map((item, i) => (
                <div key={item.step} className="relative text-center md:text-left">
                  {/* Connector line on desktop */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-white/10" />
                  )}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
                    <i className={`${item.icon} text-2xl text-accent`} />
                  </div>
                  <div className="text-xs font-bold text-accent tracking-widest mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light transition-all"
              >
                See What It Costs
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* About / Founder */}
        <section id="about" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                  <i className="fas fa-horse text-xs" />
                  Horse Owners Serving Horse Owners
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Built on Consistency.<br />Driven by Grit.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6">
                  Based in Royal Palm Beach, My Horse Farm specializes in comprehensive
                  property services across Palm Beach County. From dumpster rentals and junk removal
                  to sod installation, fill dirt delivery, waste management,
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
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Get Your Price
                  </Link>
                  <a
                    href={`tel:${PHONE_OFFICE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors"
                  >
                    <i className="fas fa-phone text-sm" />
                    Call Us
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                {/* Founder card */}
                <div className="bg-warm rounded-2xl p-7 border border-accent/15">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src="/images/jose-founder.jpg"
                        alt="Jose Gomez, Founder of My Horse Farm"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover object-top"
                      />
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

                {/* Highlight badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "fas fa-shield-halved", text: "Fully Licensed & Insured" },
                    { icon: "fas fa-leaf", text: "Eco-Friendly Disposal" },
                    { icon: "fas fa-clock", text: "Same-Day Available" },
                    { icon: "fas fa-comments", text: "Bilingual: EN / ES" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
                      <i className={`${item.icon} text-primary`} />
                      <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* MHF truck at a farm */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/truck-farm.jpg"
                    alt="My Horse Farm dump truck at an equestrian property"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Proudly Serving Palm Beach County
            </h2>
            <p className="text-gray-500 mb-8">Based in Royal Palm Beach, just minutes from your farm.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Wellington", href: "/manure-removal/wellington" },
                { name: "Royal Palm Beach", href: null },
                { name: "Loxahatchee", href: "/manure-removal/loxahatchee" },
                { name: "Loxahatchee Groves", href: null },
                { name: "West Palm Beach", href: "/manure-removal/west-palm-beach" },
                { name: "Palm Beach Gardens", href: null },
              ].map((area) => (
                area.href ? (
                  <Link key={area.name} href={area.href} className="text-sm font-medium text-gray-600 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <i className="fas fa-map-pin text-primary text-xs mr-2" />
                    {area.name}
                  </Link>
                ) : (
                  <span key={area.name} className="text-sm font-medium text-gray-600 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                    <i className="fas fa-map-pin text-primary text-xs mr-2" />
                    {area.name}
                  </span>
                )
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <FaqAccordion />

        {/* CTA Banner */}
        <CtaBanner />

        {/* Calendar */}
        <section id="schedule">
          <ServiceCalendar />
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Contact Us</h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Ready to book a service or have questions? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <HubSpotForm />
              </div>
              <div className="space-y-4">
                {[
                  { icon: "fas fa-phone", label: "Office", value: PHONE_OFFICE, href: `tel:${PHONE_OFFICE_TEL}` },
                  { icon: "fas fa-envelope", label: "Sales", value: EMAIL_SALES, href: `mailto:${EMAIL_SALES}` },
                  { icon: "fas fa-map-marker-alt", label: "Location", value: ADDRESS },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
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
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
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
