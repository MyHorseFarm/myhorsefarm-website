import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Dumpster Rental in Loxahatchee, FL",
  description:
    "Dumpster rental and 40-yard dump trailer service in Loxahatchee, FL. Large acreage cleanups, construction debris, farm waste and property clearing for agricultural and equestrian properties in The Acreage.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/dumpster-rental/loxahatchee",
  },
  openGraph: {
    title: "Dumpster Rental in Loxahatchee, FL",
    description:
      "Dumpster rental and 40-yard dump trailer in Loxahatchee. Large acreage cleanups, construction debris, farm waste and property clearing for The Acreage.",
    type: "website",
    url: "https://www.myhorsefarm.com/dumpster-rental/loxahatchee",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Dumpster Rental in Loxahatchee, FL",
    description:
      "Dumpster rental and 40-yard dump trailer in Loxahatchee, FL. Large acreage cleanups and farm waste removal.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FAQS = [
  {
    question:
      "Can your dump trailer access properties on unpaved Loxahatchee roads?",
    answer:
      "Yes. We regularly deliver to properties on gravel roads, dirt driveways, and unpaved access paths throughout The Acreage and Loxahatchee Groves. Our truck and trailer setup is built for rural access. We just need enough clearance for the trailer — about 12 feet wide and a reasonably firm surface.",
  },
  {
    question:
      "How much can the 40-yard dump trailer hold?",
    answer:
      "Our 40-yard dump trailer holds roughly 12 pickup truck loads of material. For most Loxahatchee property cleanups, land clearing jobs, and barn cleanouts, one load gets the job done. For larger projects, we can make multiple hauls on the same day.",
  },
  {
    question:
      "Do you handle land clearing debris in Loxahatchee?",
    answer:
      "Yes. Land clearing is common in Loxahatchee as property owners develop their acreage. We haul trees, brush, stumps, root balls, and vegetation waste. For large clearing projects, we can schedule multiple trailer loads coordinated with your clearing crew.",
  },
  {
    question:
      "What cannot go in the dump trailer?",
    answer:
      "We take almost everything non-hazardous. We cannot accept paint, chemicals, asbestos, medical waste, or tires. Everything else — construction debris, green waste, farm equipment, furniture, concrete, metal, dirt — goes in the trailer.",
  },
];

export default function DumpsterRentalLoxahatcheePage() {
  return (
    <>
      <Hero
        short
        title="Dumpster Rental in Loxahatchee"
        tagline="Heavy-duty dump trailer service for large acreage properties"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Loxahatchee Dumpster Rental for Farms and Acreage
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Loxahatchee properties are big, and the waste they generate
              matches. Whether you&apos;re clearing a 5-acre parcel in The
              Acreage, demolishing old farm structures off Okeechobee
              Boulevard, or cleaning out years of accumulated equipment and
              debris near Lion Country Safari, standard waste removal
              services fall short. You need volume, and you need a company
              that can get a large trailer down an unpaved road and onto
              your property without getting stuck.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              My Horse Farm provides 40-yard dump trailer service built for
              Loxahatchee&apos;s rural, agricultural landscape. We deliver
              to properties on gravel roads, dirt driveways, and remote
              parcels that other dumpster companies won&apos;t service. Our
              trailer handles construction debris, land clearing waste, old
              farm equipment, green waste, bulk material, and everything
              else that comes with owning acreage in western Palm Beach
              County.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From hobby farms along Seminole Pratt Whitney Road to
              equestrian properties in Loxahatchee Groves and large parcels
              throughout The Acreage, we&apos;ve been hauling waste for
              Loxahatchee property owners for over a decade. We know the
              roads, we know the properties, and we know what it takes to
              get the job done out here.
            </p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              What Loxahatchee Property Owners Use Our Trailer For
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              Large lots mean large projects. Here are the most common jobs
              we handle in The Acreage and surrounding Loxahatchee areas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Land Clearing
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Trees, brush, stumps, root balls, and vegetation from lot
                  clearing and property development. Loxahatchee owners
                  developing their acreage generate massive volumes of green
                  waste &mdash; our 40-yard trailer handles it.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Farm Structure Demolition
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Old barns, sheds, coops, fencing, and outbuildings that
                  have outlived their usefulness. We load the debris with
                  our equipment so you don&apos;t need to rent a separate
                  machine.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Construction Projects
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  New barn builds, home additions, pole barns, and arena
                  construction all generate debris. Contractors working in
                  Loxahatchee use our trailer to keep the site clean and
                  avoid multiple dump runs.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Accumulated Farm Junk
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Years of broken equipment, scrap metal, old hay, worn
                  fencing, and random farm debris pile up on Loxahatchee
                  properties. One trailer load clears out what took years
                  to accumulate.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Storm Damage Cleanup
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Loxahatchee&apos;s open terrain and mature trees mean
                  significant storm debris after hurricanes. Downed trees,
                  damaged fencing, structural debris &mdash; we mobilize
                  fast after storms clear.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bulk Dirt and Rock
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Excavation spoils, old fill dirt, gravel, sand, and rock
                  that needs to go. Our dump trailer and loader handle heavy
                  bulk material that would take days with a pickup truck.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
              Why Loxahatchee Property Owners Trust Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Rural access capability</strong> &mdash; we
                    deliver on gravel roads, dirt driveways, and unpaved
                    paths that other companies avoid
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>40-yard capacity</strong> &mdash; sized for
                    Loxahatchee&apos;s large-scale cleanups and clearing
                    projects
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Loading equipment included</strong> &mdash;
                    skid steer and loader available for heavy items and
                    bulk material
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Multi-load scheduling</strong> &mdash; for
                    large projects we coordinate multiple hauls in a single
                    day
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Agricultural property experience</strong>
                    &mdash; we work on farms, ranches, and acreage
                    properties every day
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Transparent pricing</strong> &mdash; upfront
                    quotes based on material type and weight, no surprises
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed and insured</strong> &mdash; compliant
                    for agricultural and residential waste hauling
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>12+ years serving Loxahatchee</strong> &mdash;
                    we know the roads, the properties, and the disposal
                    facilities
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
              Dump Trailer Service in Nearby Areas
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              Our Royal Palm Beach base puts us right next to Loxahatchee.
              We also deliver throughout western Palm Beach County.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dumpster-rental/wellington"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Wellington
              </Link>
              <Link
                href="/dumpster-rental/royal-palm-beach"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Royal Palm Beach
              </Link>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                Loxahatchee Groves
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                Palm Beach Gardens
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
            Clear Out Your Loxahatchee Property
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            One call gets a 40-yard dump trailer to your Loxahatchee
            property. We handle the roads, the loading, and the disposal.
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
            name: "Loxahatchee",
          },
          description:
            "Dumpster rental and 40-yard dump trailer service in Loxahatchee, FL. Large acreage cleanups, construction debris, farm waste and property clearing for agricultural and equestrian properties in The Acreage.",
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
              name: "Loxahatchee",
              item: "https://www.myhorsefarm.com/dumpster-rental/loxahatchee",
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
