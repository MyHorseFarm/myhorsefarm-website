import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Dumpster Rental in Royal Palm Beach, FL",
  description:
    "Dumpster rental and 40-yard dump trailer service in Royal Palm Beach, FL. Construction debris, farm cleanouts, green waste and property cleanups. Same-day availability from our local home base.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/dumpster-rental/royal-palm-beach",
  },
  openGraph: {
    title: "Dumpster Rental in Royal Palm Beach, FL",
    description:
      "Dumpster rental and 40-yard dump trailer in Royal Palm Beach. Construction debris, farm cleanouts, green waste and property cleanups from our local home base.",
    type: "website",
    url: "https://www.myhorsefarm.com/dumpster-rental/royal-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Dumpster Rental in Royal Palm Beach, FL",
    description:
      "Dumpster rental and 40-yard dump trailer in Royal Palm Beach, FL. Construction debris, farm cleanouts and property cleanups.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FAQS = [
  {
    question:
      "How fast can you deliver a dumpster in Royal Palm Beach?",
    answer:
      "Because Royal Palm Beach is our home base, we can often deliver same-day or next-day. Our trailer and crew are already in the area, so there is no long mobilization time. Call in the morning and we can usually have it there by afternoon.",
  },
  {
    question: "What does dumpster rental cost in Royal Palm Beach?",
    answer:
      "Pricing is based on the type of material and weight. We provide transparent quotes before delivery — no hidden fees, no surprise weight charges, no overage penalties. Contact us for a specific quote based on your project.",
  },
  {
    question:
      "Can I keep the dump trailer on my property for multiple days?",
    answer:
      "Yes. We offer flexible rental periods. Most Royal Palm Beach clients keep the trailer for 1-3 days for cleanout projects, but we can accommodate longer rentals for construction projects or phased property cleanups.",
  },
  {
    question:
      "Do you handle the loading or do I need to load the dumpster myself?",
    answer:
      "Both options are available. You can load it yourself at your own pace, or we can bring a crew with a skid steer and loader to handle heavy items and bulk loading. Many Royal Palm Beach clients use a mix — they handle the light stuff and we load the heavy material.",
  },
];

export default function DumpsterRentalRoyalPalmBeachPage() {
  return (
    <>
      <Hero
        short
        title="Dumpster Rental in Royal Palm Beach"
        tagline="Same-day availability from our local home base"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Royal Palm Beach Dumpster Rental Service
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Royal Palm Beach property owners deal with the same waste
              challenges as the rest of western Palm Beach County &mdash;
              construction projects, farm cleanouts, storm damage, property
              turnovers, and landscaping overhauls all generate debris that
              won&apos;t fit in your weekly trash pickup. The difference is
              that when you&apos;re in Royal Palm Beach, you&apos;re calling
              the company that&apos;s already in your neighborhood.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              My Horse Farm operates out of Royal Palm Beach. Our dump
              trailer, equipment, and crew are based right here along the
              Southern Blvd corridor. That means faster delivery, lower
              costs, and a team that knows the local roads, access points,
              and disposal facilities. Whether you&apos;re renovating a home
              near Royal Palm Beach Commons, cleaning out a barn off
              Crestwood Boulevard, or clearing land on a property near
              Seminole Pratt Whitney Road, we get the trailer there fast and
              the waste gone faster.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our 40-yard dump trailer is the largest option available in
              the area. One load handles what would take multiple trips with
              a pickup truck &mdash; saving you time, fuel, and dump fees.
            </p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Common Projects We Handle in Royal Palm Beach
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              Royal Palm Beach has a mix of residential neighborhoods, farm
              properties, and growing commercial areas. Here&apos;s what our
              clients typically use the dump trailer for.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Home Renovation Debris
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kitchen remodels, bathroom tear-outs, roof replacements,
                  and addition builds. Royal Palm Beach homeowners and
                  contractors use our trailer to keep job sites clean and
                  avoid multiple dump runs.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Farm and Barn Cleanout
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Old hay, broken equipment, scrap fencing, worn stall mats,
                  and accumulated junk from years of farm operations. We
                  know what comes out of a barn because we work on farms
                  every day.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Storm Cleanup
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Downed trees, palm fronds, fence damage, and structural
                  debris after hurricanes and tropical storms. We mobilize
                  quickly from our Royal Palm Beach base when storms hit.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Property Turnover
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Clearing out a rental, estate, or property you just
                  purchased. Furniture, appliances, old personal items, and
                  garage contents &mdash; we take everything non-hazardous.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Landscaping Waste
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tree removal, stump grinding debris, brush clearing, and
                  major yard overhauls. Our 40-yard capacity means your
                  landscaper can fill the trailer while they work.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bulk Material Hauling
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dirt, gravel, sand, concrete, and rock that needs to be
                  removed from your property. Our dump trailer and loader
                  make quick work of heavy material.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
              Why Royal Palm Beach Calls My Horse Farm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Local home base</strong> &mdash; our trailer is
                    already in Royal Palm Beach, so delivery is fast and
                    mobilization costs are low
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>40-yard capacity</strong> &mdash; the largest
                    dump trailer option, handling most projects in one load
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Same-day delivery available</strong> &mdash;
                    call in the morning, trailer there by afternoon
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Loading assistance</strong> &mdash; skid steer
                    and loader available for heavy or bulk items
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Flexible rental periods</strong> &mdash; keep
                    the trailer for a day or a week, whatever your project
                    needs
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Transparent pricing</strong> &mdash; upfront
                    quotes with no hidden fees or surprise charges
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed and insured</strong> &mdash; fully
                    compliant for residential and commercial jobs
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>12+ years in the community</strong> &mdash;
                    trusted by hundreds of local property owners
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
              Dumpster Rental Across Palm Beach County
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              We deliver dump trailers throughout western Palm Beach County
              from our Royal Palm Beach base.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dumpster-rental/wellington"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Wellington
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
            Get a Dump Trailer Delivered Today
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            As your Royal Palm Beach neighbor, we offer the fastest delivery
            times in the county. Call or request a quote now.
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
            name: "Royal Palm Beach",
          },
          description:
            "Dumpster rental and 40-yard dump trailer service in Royal Palm Beach, FL. Construction debris, farm cleanouts, green waste and property cleanups with same-day delivery available.",
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
              name: "Royal Palm Beach",
              item: "https://www.myhorsefarm.com/dumpster-rental/royal-palm-beach",
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
