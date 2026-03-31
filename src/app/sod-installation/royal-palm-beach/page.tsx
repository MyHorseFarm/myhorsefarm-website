import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Sod Installation in Royal Palm Beach, FL",
  description:
    "Professional sod installation in Royal Palm Beach, FL. Bahia, Bermuda, St. Augustine and Zoysia for horse paddocks, pastures and residential lawns. Expert grading, soil prep and fast turnaround from our home base.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/sod-installation/royal-palm-beach",
  },
  openGraph: {
    title: "Sod Installation in Royal Palm Beach, FL",
    description:
      "Professional sod installation in Royal Palm Beach. Bahia, Bermuda, St. Augustine and Zoysia for horse paddocks, pastures and residential lawns.",
    type: "website",
    url: "https://www.myhorsefarm.com/sod-installation/royal-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sod Installation in Royal Palm Beach, FL",
    description:
      "Professional sod installation in Royal Palm Beach. Bahia, Bermuda, St. Augustine and Zoysia for horse farms and residential properties.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FAQS = [
  {
    question:
      "Why is My Horse Farm the best choice for sod in Royal Palm Beach?",
    answer:
      "Royal Palm Beach is our home base. Our equipment, crew, and sod suppliers are all within minutes of your property. That means faster response times, lower delivery costs, and a team that knows the local soil conditions, HOA requirements, and drainage patterns better than anyone.",
  },
  {
    question:
      "What sod do you recommend for Royal Palm Beach residential properties with horses?",
    answer:
      "For properties that mix residential lawns with horse paddocks, we typically install Bahia in the paddock and turnout areas and St. Augustine around the house and barn entrances. This gives you durability where the horses are and curb appeal where it counts.",
  },
  {
    question: "How much does sod installation cost in Royal Palm Beach?",
    answer:
      "Pricing depends on the area size, sod variety, and site prep needed. A typical half-acre paddock re-sod runs a fraction of what you might expect because we keep overhead low operating from our home base. We provide free on-site estimates with no obligation.",
  },
  {
    question: "Do you handle HOA requirements for Royal Palm Beach communities?",
    answer:
      "Yes. Several Royal Palm Beach neighborhoods have specific turf requirements and approval processes. We work with your HOA guidelines, use approved grass varieties, and can provide documentation for your association if needed.",
  },
];

export default function SodInstallationRoyalPalmBeachPage() {
  return (
    <>
      <Hero
        short
        title="Sod Installation in Royal Palm Beach"
        tagline="Our home base — fastest response times in Palm Beach County"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Royal Palm Beach Sod Installation Services
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Royal Palm Beach is where My Horse Farm was born and where we
              still operate today. This community sits at the crossroads of
              suburban living and equestrian culture &mdash; residential
              neighborhoods along the Southern Blvd corridor give way to
              horse properties, hobby farms, and growing equestrian
              operations just a few miles west. That mix of residential and
              agricultural means property owners here need sod solutions that
              work for both worlds.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We install sod on horse paddocks, pastures, front lawns, barn
              surrounds, and everything in between. Because Royal Palm Beach
              is our home base, your project gets priority scheduling, lower
              mobilization costs, and a crew that already knows the soil
              conditions, drainage patterns, and permitting landscape in your
              area.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From the neighborhoods around Royal Palm Beach Commons Park to
              the farm parcels off Crestwood Boulevard and Seminole Pratt
              Whitney Road, we&apos;ve installed sod on properties of every
              size in this community.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Sod Varieties for Royal Palm Beach Properties
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              We carry every variety suited to Royal Palm Beach&apos;s mix
              of residential and equestrian properties. Here&apos;s what we
              recommend for each use case.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bahia &mdash; Paddocks &amp; Pastures
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The workhorse grass for Royal Palm Beach horse properties.
                  Bahia handles daily hoof traffic, requires minimal watering
                  once established, and thrives in the sandy soil common west
                  of Southern Boulevard.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  St. Augustine &mdash; Lawns &amp; Barn Areas
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The go-to for Royal Palm Beach residential lawns and the
                  areas around your barn that need to look good. Thick, lush,
                  and shade-tolerant &mdash; perfect for the front of your
                  property.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bermuda &mdash; High-Traffic Zones
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  When you need turf that recovers fast from heavy use,
                  Bermuda delivers. Popular on riding paths, training areas,
                  and properties where horses and people share common ground.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Zoysia &mdash; Premium Finish
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fine-bladed and low-growing, Zoysia creates a carpet-like
                  finish for entryways, event spaces, and Royal Palm Beach
                  properties that want to stand out in the neighborhood.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
              Why Royal Palm Beach Chooses My Horse Farm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Local home base</strong> &mdash; our shop and crew
                    are right here in Royal Palm Beach, so you get the fastest
                    response times
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Residential + equestrian expertise</strong> &mdash;
                    we handle HOA lawns and horse paddocks with equal skill
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full site prep</strong> &mdash; grading, old turf
                    removal, and soil conditioning included in every job
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Lower mobilization costs</strong> &mdash; no long
                    drive means savings we pass on to you
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Premium FL-grown sod</strong> &mdash; sourced
                    fresh from local Palm Beach County farms
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed and insured</strong> &mdash; fully
                    compliant for residential and agricultural properties
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Fast turnaround</strong> &mdash; most jobs
                    completed in 1-3 days
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>400+ farm clients</strong> &mdash; over 12 years
                    serving Palm Beach County horse owners
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
              Sod Installation Across Palm Beach County
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              We install sod on horse farms and residential properties
              throughout the region. Click below to learn about our services
              in nearby communities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/sod-installation/wellington"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Wellington
              </Link>
              <Link
                href="/sod-installation/loxahatchee"
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
            Get Fresh Sod Installed This Week
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            As your local Royal Palm Beach neighbor, we can often schedule
            your estimate within 24 hours. Call or request a quote online.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=sod_installation"
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
          serviceType: "Sod Installation",
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
            "Professional sod installation in Royal Palm Beach, FL. Bahia, Bermuda, St. Augustine and Zoysia for horse paddocks, pastures and residential lawns with full site prep and expert grading.",
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
              name: "Sod Installation",
              item: "https://www.myhorsefarm.com/sod-installation",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Royal Palm Beach",
              item: "https://www.myhorsefarm.com/sod-installation/royal-palm-beach",
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
