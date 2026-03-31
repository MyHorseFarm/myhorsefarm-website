import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Dumpster Rental in Wellington, FL",
  description:
    "Dumpster rental and 40-yard dump trailer service in Wellington, FL. Construction debris, barn cleanouts, green waste and property cleanups for equestrian facilities and residential properties near WEF and polo grounds.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/dumpster-rental/wellington",
  },
  openGraph: {
    title: "Dumpster Rental in Wellington, FL",
    description:
      "Dumpster rental and 40-yard dump trailer in Wellington. Construction debris, barn cleanouts, green waste and property cleanups for equestrian facilities.",
    type: "website",
    url: "https://www.myhorsefarm.com/dumpster-rental/wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Dumpster Rental in Wellington, FL",
    description:
      "Dumpster rental and 40-yard dump trailer in Wellington, FL. Construction debris, barn cleanouts and property cleanups.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FAQS = [
  {
    question: "What size dumpster do you offer for Wellington properties?",
    answer:
      "We operate a 40-yard dump trailer, which is the largest option available and handles most Wellington barn cleanouts, construction projects, and property cleanups in a single load. For smaller jobs, we can make partial-load pickups at reduced rates.",
  },
  {
    question: "Can I use the dumpster for a Wellington barn renovation?",
    answer:
      "Absolutely. Barn renovations are one of our most common use cases in Wellington. Old stall mats, broken lumber, scrap fencing, roofing material, concrete — it all goes in the dump trailer. We drop it, you fill it, we haul it away.",
  },
  {
    question:
      "How quickly can you deliver a dumpster to my Wellington property?",
    answer:
      "We typically deliver within 24-48 hours of booking, depending on availability. During peak Wellington season (October through April), we recommend booking a few days ahead to secure your preferred date.",
  },
  {
    question: "Do you comply with Wellington waste disposal regulations?",
    answer:
      "Yes. Wellington has specific waste management ordinances, especially for equestrian properties. We dispose of all materials at approved facilities and can provide disposal documentation if your property management or the Village requires it.",
  },
];

export default function DumpsterRentalWellingtonPage() {
  return (
    <>
      <Hero
        short
        title="Dumpster Rental in Wellington"
        tagline="40-yard dump trailer for equestrian properties and construction sites"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Wellington Dumpster Rental and Dump Trailer Service
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Wellington&apos;s equestrian properties generate a unique kind
              of waste. Barn renovations, fence replacements, arena
              rebuilds, storm cleanup, and seasonal property overhauls all
              create debris that standard trash service can&apos;t handle.
              With the Winter Equestrian Festival and polo season driving a
              constant cycle of property upgrades, Wellington barn owners
              need reliable, large-capacity waste removal on their schedule.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              My Horse Farm provides 40-yard dump trailer service for
              Wellington equestrian facilities, construction sites, and
              residential properties. Our trailer handles construction
              debris, green waste, barn cleanout material, old fencing,
              broken equipment, and bulk material removal. We know
              Wellington properties &mdash; the access roads, the gate
              clearances, the setback requirements &mdash; and we get in
              and out without disrupting your barn operations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you&apos;re clearing out a tack room on South Shore
              Boulevard, demolishing old stalls near the show grounds, or
              cleaning up storm damage off Pierson Road, one call gets a
              40-yard trailer to your property and all that waste gone.
            </p>
          </div>
        </section>

        {/* What Goes In */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              What You Can Load in Our Dump Trailer
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              Our 40-yard dump trailer takes almost everything
              non-hazardous. Here are the most common materials Wellington
              clients load up.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Construction Debris
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Concrete, drywall, lumber, roofing, tile, and renovation
                  waste from barn builds, arena construction, and property
                  upgrades common during Wellington&apos;s off-season.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Barn Cleanout Material
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Old stall mats, broken equipment, scrap fencing, worn
                  tack room contents, and accumulated barn debris. This is
                  our specialty &mdash; we know what comes out of a barn.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Green Waste
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tree trimmings, palm fronds, brush, stumps, and
                  landscaping waste. Wellington properties with mature
                  landscaping generate heavy green waste, especially after
                  storms.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Fencing and Metal
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Old wire fencing, posts, gates, and scrap metal from
                  paddock rebuilds and property upgrades. We load it with
                  our equipment so you don&apos;t have to touch it.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bulk Material
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dirt, gravel, sand, rock, and other bulk materials that
                  need to be hauled off your Wellington property. Our dump
                  trailer and loader handle large volumes efficiently.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Property Cleanout
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Furniture, appliances, storage contents, and household
                  junk. If you&apos;re turning over a Wellington rental
                  property or estate, we clear it all in one trip.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
              Why Wellington Property Owners Call Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>40-yard capacity</strong> &mdash; the largest
                    trailer option, handling most jobs in a single load
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Equestrian property experience</strong> &mdash;
                    we navigate barn access roads, gates, and tight spaces
                    without issue
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Wellington compliant</strong> &mdash; we follow
                    the Village&apos;s waste disposal ordinances and use
                    approved facilities
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Loading assistance available</strong> &mdash;
                    we can load heavy items with our skid steer and loader
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>24-48 hour delivery</strong> &mdash; fast
                    turnaround on trailer drops and pickups
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Transparent pricing</strong> &mdash; no hidden
                    fees, weight surprises, or overage charges
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed and insured</strong> &mdash; fully
                    compliant for commercial and residential work
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>12+ years serving PBC</strong> &mdash; trusted
                    by hundreds of Wellington equestrian properties
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Dumpster Rental in Nearby Communities
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              Based in Royal Palm Beach, we deliver dump trailers throughout
              western Palm Beach County.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dumpster-rental/royal-palm-beach"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Royal Palm Beach
              </Link>
              <Link
                href="/dumpster-rental/loxahatchee"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Loxahatchee
              </Link>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                Palm Beach Gardens
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                Loxahatchee Groves
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Need a Dumpster in Wellington?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Call us or request a quote online. We&apos;ll get a 40-yard dump
            trailer to your Wellington property within 24-48 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=dumpster_rental"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl text-lg hover:bg-primary-dark transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+15615767667"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fas fa-phone mr-2" />
              (561) 576&#8209;7667
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
              "https://www.google.com/maps/place/My+Horse+Farm/@26.6957151,-80.2033345,10z/data=!3m1!4b1!4m6!3m5!1s0x6826af3f1557e94b:0xcc8b36039075494b!8m2!3d26.695715!4d-80.2033345!16s%2Fg%2F11p00vldxb?entry=ttu",
            ],
          },
          areaServed: {
            "@type": "City",
            name: "Wellington",
          },
          description:
            "Dumpster rental and 40-yard dump trailer service in Wellington, FL. Construction debris, barn cleanouts, green waste and property cleanups for equestrian facilities.",
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
            {
              "@type": "ListItem",
              position: 3,
              name: "Wellington",
              item: "https://www.myhorsefarm.com/dumpster-rental/wellington",
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
