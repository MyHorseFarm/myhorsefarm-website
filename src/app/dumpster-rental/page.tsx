import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Dumpster Rental | 40-Yard Dump Trailer in Wellington & West Palm Beach FL",
  description:
    "Dumpster rental and dump trailer service in Wellington, Loxahatchee & West Palm Beach FL. 40-yard dump trailer for construction debris, green waste, barn cleanouts & property cleanups. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/dumpster-rental" },
  openGraph: {
    title: "Dumpster Rental | 40-Yard Dump Trailer",
    description:
      "40-yard dump trailer for construction debris, green waste, barn cleanouts and property cleanups in Palm Beach County FL.",
    type: "website",
    url: "https://www.myhorsefarm.com/dumpster-rental",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Dumpster Rental | 40-Yard Dump Trailer",
    description:
      "40-yard dump trailer for construction debris, green waste, barn cleanouts and property cleanups in Palm Beach County FL.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const WHAT_GOES_IN = [
  {
    title: "Construction Debris",
    desc: "Concrete, drywall, lumber, roofing, tile, brick, and renovation waste. Our 40-yard dump trailer handles full job site cleanups in a single load.",
  },
  {
    title: "Green Waste & Yard Debris",
    desc: "Tree trimmings, palm fronds, brush, stumps, grass clippings, and landscaping waste. Perfect for property clearing and storm cleanup.",
  },
  {
    title: "Barn &amp; Farm Cleanout",
    desc: "Old hay, broken equipment, scrap fencing, tack room junk, and accumulated barn debris. We know farms — this is our specialty.",
  },
  {
    title: "Property Cleanout",
    desc: "Furniture, appliances, mattresses, old electronics, household junk, and storage unit contents. We take everything that is not hazardous.",
  },
  {
    title: "Fencing &amp; Metal",
    desc: "Old wire fencing, posts, gates, scrap metal, and structural components. We load it with our equipment so you do not have to touch it.",
  },
  {
    title: "Bulk Material Removal",
    desc: "Dirt, gravel, sand, rock, and other bulk materials you need hauled away. Our dump trailer and loader handle large volumes efficiently.",
  },
];

const FAQS = [
  {
    question: "What size dumpster or dump trailer do you have?",
    answer:
      "We operate a 40-yard dump trailer, which is significantly larger than a standard roll-off dumpster. It handles massive loads in a single trip, making it more efficient and cost-effective for large cleanouts, construction debris, and farm projects.",
  },
  {
    question: "How much does dumpster rental cost?",
    answer:
      "Pricing depends on the type of material, volume, and whether you need our crew and equipment for loading. We provide transparent quotes with no hidden fees. Call us or request a quote online for your specific project.",
  },
  {
    question: "Do you load the dumpster, or do I have to fill it myself?",
    answer:
      "We offer both options. You can fill it yourself over a few days, or we bring our full crew with skid steer and loader to handle the loading for you. Most farm and property cleanout customers choose the full-service option.",
  },
  {
    question: "What can't go in the dumpster?",
    answer:
      "We cannot accept hazardous materials including paint, chemicals, asbestos, batteries, tires, or medical waste. Everything else — construction debris, green waste, furniture, appliances, farm junk — goes right in.",
  },
  {
    question: "How quickly can you deliver?",
    answer:
      "We typically schedule delivery within 2-5 business days. Same-week service is usually available, and we can accommodate rush requests when our schedule allows. Call us to check current availability.",
  },
];

export default function DumpsterRentalPage() {
  return (
    <>
      <Hero
        title="Dumpster Rental"
        tagline="40-Yard Dump Trailer &bull; Skid Steer &bull; Loader &bull; Full Crew"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=dumpster_rental"
      />
      <main>
        {/* The Trailer */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              Bigger Than a Dumpster. Faster Than a Roll-Off.
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              Our 40-yard dump trailer holds more than a standard roll-off
              dumpster and comes with the crew and equipment to load it. No
              waiting days for pickup — we load, haul, and dump in one
              operation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "fas fa-truck-moving",
                  title: "40-Yard Capacity",
                  desc: "Our dump trailer handles massive volumes — construction debris, green waste, full property cleanouts — in a single trip.",
                },
                {
                  icon: "fas fa-tractor",
                  title: "Skid Steer Loading",
                  desc: "Heavy material that cannot be moved by hand? Our skid steer loads concrete, dirt, debris, and bulky items fast.",
                },
                {
                  icon: "fas fa-cogs",
                  title: "Front-End Loader",
                  desc: "For large piles of green waste, fill dirt, gravel, and construction materials. We load and haul in one operation.",
                },
                {
                  icon: "fas fa-users",
                  title: "Experienced Crew",
                  desc: "Our team handles sorting, loading, and hauling so you do not have to lift a finger. We do the heavy work.",
                },
              ].map((item) => (
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

        {/* What Goes In */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              What Goes In the Trailer
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              If it&apos;s not hazardous, it goes in. Construction debris, green
              waste, farm junk, furniture — we take it all.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHAT_GOES_IN.map((item) => (
                <div
                  key={item.title}
                  className="border border-gray-200 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-primary-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
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
                  Tell us what you need hauled and send photos if you can. We
                  give honest pricing with no hidden fees.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">We Show Up Ready</h3>
                <p className="text-green-200">
                  Our crew arrives with the 40-yard dump trailer and whatever
                  equipment the job needs. Same-week service available.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Hauled Away</h3>
                <p className="text-green-200">
                  We load everything, clean up the site, and haul it to the
                  proper disposal or recycling facility. Your property is clear.
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
                    <strong>40-yard dump trailer</strong> &mdash; bigger than a
                    standard roll-off dumpster
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Heavy equipment</strong> &mdash; skid steer and
                    loader for fast loading
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full crew included</strong> &mdash; we do the
                    lifting, sorting, and loading
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Same-week service</strong> &mdash; fast turnaround
                    when you need it
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
                    <strong>Transparent pricing</strong> &mdash; no surprises, no
                    hidden fees
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Eco-friendly disposal</strong> &mdash; we recycle and
                    donate when possible
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
              We provide dumpster rental and dump trailer service throughout
              Palm Beach County. Farms, construction sites, residential
              properties — if you&apos;re in our area, we can get to you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "Wellington", href: "/dumpster-rental/wellington" },
                { name: "Loxahatchee", href: "/dumpster-rental/loxahatchee" },
                { name: "Royal Palm Beach", href: "/dumpster-rental/royal-palm-beach" },
                { name: "West Palm Beach", href: null },
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
            Ready to Clear It Out?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Get a free quote online or call us now. Same-week service available
            for most jobs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=dumpster_rental"
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
          serviceType: "Dumpster Rental",
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
            "40-yard dump trailer rental with full crew, skid steer, and loader for construction debris, green waste, barn cleanouts, and property cleanups in Palm Beach County FL.",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Dumpster Rental Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Construction Debris Removal",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Green Waste Hauling",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Barn & Farm Cleanout",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Property Cleanout",
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
              name: "Dumpster Rental",
              item: "https://www.myhorsefarm.com/dumpster-rental",
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
