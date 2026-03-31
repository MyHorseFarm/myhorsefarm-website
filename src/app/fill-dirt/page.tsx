import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Fill Dirt Delivery | Arena Fill, Top Soil & Limerock in Wellington FL",
  description:
    "Fill dirt delivery in Wellington, Loxahatchee & West Palm Beach FL. Clean fill, top soil, sand, limerock & shell rock for arena base, paddock leveling, driveways & construction. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/fill-dirt" },
  openGraph: {
    title: "Fill Dirt Delivery | Arena Fill, Top Soil & Limerock",
    description:
      "Fill dirt delivery for arena base, paddock leveling, driveways and construction projects in Palm Beach County FL. Clean fill, top soil, sand, limerock and shell rock.",
    type: "website",
    url: "https://www.myhorsefarm.com/fill-dirt",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Fill Dirt Delivery | Arena Fill & Top Soil",
    description:
      "Fill dirt delivery for equestrian and construction projects in Palm Beach County FL. Clean fill, top soil, sand, limerock and shell rock.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FILL_TYPES = [
  {
    icon: "fas fa-mountain",
    title: "Clean Fill Dirt",
    desc: "Screened, debris-free fill dirt for grading, leveling, and raising elevation. The workhorse material for paddock construction, berm building, and foundation work on horse properties.",
  },
  {
    icon: "fas fa-seedling",
    title: "Top Soil",
    desc: "Nutrient-rich top soil for sod prep, pasture establishment, and landscaping. We deliver the right blend for South Florida growing conditions so your grass takes root fast.",
  },
  {
    icon: "fas fa-umbrella-beach",
    title: "Sand",
    desc: "Washed sand for arena footing, drainage layers, and construction base. We supply the right grade for equestrian arenas, riding paths, and general fill applications.",
  },
  {
    icon: "fas fa-gem",
    title: "Limerock",
    desc: "Compactable limerock for driveways, road base, parking areas, and heavy-traffic surfaces. It packs tight, drains well, and holds up to truck and trailer traffic year-round.",
  },
  {
    icon: "fas fa-shell",
    title: "Shell Rock",
    desc: "Crushed shell rock for driveways, barn pads, and decorative surfaces. Natural drainage, clean appearance, and excellent compaction for equestrian and residential properties.",
  },
];

const COMMON_USES = [
  {
    title: "Arena Base & Footing",
    desc: "Proper arena construction starts with the right base. We deliver and place sand, limerock, or custom blends to build riding arenas with correct drainage and compaction.",
  },
  {
    title: "Paddock Leveling",
    desc: "Low spots collect water and create mud pits that are bad for hooves. We fill, grade, and compact to give your horses level, well-drained turnout areas.",
  },
  {
    title: "Driveway Base & Repair",
    desc: "Limerock and shell rock driveways are the standard on Palm Beach County farms. We deliver, spread, and grade material for new driveways or patch existing ones.",
  },
  {
    title: "Drainage Improvement",
    desc: "South Florida rain is no joke. We use fill dirt and grading to redirect water flow, build swales, and eliminate standing water on your property.",
  },
  {
    title: "Construction Backfill",
    desc: "Building a new barn, fence line, or structure? We deliver clean fill in the quantities you need and place it where your contractor needs it.",
  },
];

const FAQS = [
  {
    question: "What type of fill dirt do I need for my project?",
    answer:
      "It depends on the application. Clean fill dirt works for general grading and leveling. Top soil is best for sod prep and pasture work. Limerock is ideal for driveways and parking areas. Sand is used for arena footing and drainage layers. We will visit your site and recommend the right material.",
  },
  {
    question: "How much fill dirt do I need?",
    answer:
      "We estimate volume based on the area size and depth needed. A typical paddock leveling job might need 10-30 cubic yards, while a driveway can require 20-50+ cubic yards depending on length. We measure on-site and give you an exact quote.",
  },
  {
    question: "Do you just deliver, or do you spread and grade too?",
    answer:
      "We do both. We can dump material on-site for you to spread, or we bring our skid steer and loader to place, spread, and grade it exactly where you need it. Most customers choose the full-service option.",
  },
  {
    question: "How quickly can you deliver fill dirt?",
    answer:
      "We typically schedule deliveries within 2-5 business days. For urgent projects, same-week delivery is usually available. We coordinate delivery times around your schedule and property access.",
  },
  {
    question: "What areas do you deliver fill dirt to?",
    answer:
      "We deliver throughout Palm Beach County including Wellington, Loxahatchee, Royal Palm Beach, West Palm Beach, Palm Beach Gardens, and Loxahatchee Groves. If you are nearby, call us and we will let you know.",
  },
];

export default function FillDirtPage() {
  return (
    <>
      <Hero
        title="Fill Dirt Delivery"
        tagline="Clean Fill &bull; Top Soil &bull; Sand &bull; Limerock &bull; Shell Rock"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=fill_dirt"
      />
      <main>
        {/* Types of Fill */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              Types of Fill We Deliver
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              We source locally and deliver the right material for your project.
              Every load is quality-checked &mdash; no trash, no surprises.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FILL_TYPES.map((item) => (
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

        {/* Common Uses */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              Common Uses
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              From arena construction to driveway repair, fill dirt is the
              foundation of every farm project. Here&apos;s how our customers
              use it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMON_USES.map((use) => (
                <div
                  key={use.title}
                  className="border border-gray-200 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-primary-dark mb-2">
                    {use.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {use.desc}
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
                <h3 className="text-xl font-bold mb-2">Tell Us What You Need</h3>
                <p className="text-green-200">
                  Call us or request a quote online. Describe your project and
                  we&apos;ll recommend the right material, quantity, and
                  delivery schedule.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">We Deliver &amp; Place</h3>
                <p className="text-green-200">
                  Our trucks deliver directly to your property. Need it spread
                  and graded? We bring the skid steer and handle placement too.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Project Ready</h3>
                <p className="text-green-200">
                  Your material is placed, graded, and compacted. Whether
                  it&apos;s arena base, driveway repair, or paddock leveling
                  &mdash; you&apos;re ready to go.
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
                    <strong>Quality material</strong> &mdash; clean, screened,
                    locally sourced
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full-service option</strong> &mdash; delivery,
                    spreading, grading, and compaction
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Heavy equipment</strong> &mdash; skid steer and
                    loader for efficient placement
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Flexible quantities</strong> &mdash; from a few
                    yards to hundreds
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed &amp; insured</strong> &mdash; fully
                    compliant in Florida
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Transparent pricing</strong> &mdash; per-load or
                    per-yard, no hidden fees
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Equestrian expertise</strong> &mdash; we know what
                    horse properties need
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>12+ years experience</strong> &mdash; serving 400+
                    clients across PBC
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
              We deliver fill dirt, top soil, sand, limerock, and shell rock to
              farms, equestrian properties, and residential sites throughout
              Palm Beach County.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "Wellington", href: "/fill-dirt" },
                { name: "Loxahatchee", href: "/fill-dirt" },
                { name: "West Palm Beach", href: "/fill-dirt" },
                { name: "Royal Palm Beach", href: null },
                { name: "Palm Beach Gardens", href: null },
                { name: "Loxahatchee Groves", href: null },
              ].map((area) =>
                area.href ? (
                  <Link
                    key={area.name}
                    href={area.href}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    {area.name}
                  </Link>
                ) : (
                  <span
                    key={area.name}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    {area.name}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 md:text-4xl text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group border border-gray-200 rounded-2xl"
                >
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-bold text-primary-dark hover:text-primary transition-colors">
                    {faq.question}
                    <i className="fas fa-chevron-down text-sm text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl text-gray-900">
            Need Fill Dirt Delivered?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Get a free quote online or call us now. We&apos;ll recommend the
            right material and get it to your site fast.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=fill_dirt"
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
          serviceType: "Fill Dirt Delivery",
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
            "Fill dirt delivery services for equestrian arenas, paddock leveling, driveways, drainage, and construction projects in Palm Beach County FL. Clean fill, top soil, sand, limerock, and shell rock with full-service placement.",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Fill Materials",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Clean Fill Dirt Delivery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Top Soil Delivery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Sand Delivery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Limerock Delivery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Shell Rock Delivery",
                },
              },
            ],
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
              name: "Fill Dirt",
              item: "https://www.myhorsefarm.com/fill-dirt",
            },
          ],
        }}
      />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />
    </>
  );
}
