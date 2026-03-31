import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Sod Installation in Loxahatchee, FL",
  description:
    "Professional sod installation for large acreage horse farms and pastures in Loxahatchee, FL. Bahia, Bermuda, St. Augustine and Zoysia. Expert grading and soil prep for agricultural and equestrian properties in The Acreage.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/sod-installation/loxahatchee",
  },
  openGraph: {
    title: "Sod Installation in Loxahatchee, FL",
    description:
      "Professional sod installation for large acreage horse farms and pastures in Loxahatchee. Bahia, Bermuda, St. Augustine and Zoysia for equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/sod-installation/loxahatchee",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sod Installation in Loxahatchee, FL",
    description:
      "Professional sod installation for large acreage horse farms in Loxahatchee, FL. Bahia, Bermuda, St. Augustine and Zoysia.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FAQS = [
  {
    question: "What sod is best for large Loxahatchee pastures?",
    answer:
      "Bahia grass is the clear winner for Loxahatchee acreage. It establishes quickly in sandy soil, requires minimal irrigation once rooted, and handles the heavy grazing and turnout common on Loxahatchee horse properties. For multi-acre installs, Bahia also keeps costs manageable.",
  },
  {
    question:
      "Can you handle sod installation on 5+ acre Loxahatchee properties?",
    answer:
      "Absolutely. Large acreage is our specialty in Loxahatchee. We bring skid steers, loaders, and enough crew to handle multi-acre installs efficiently. We have completed sod jobs on properties up to 20 acres in The Acreage and Loxahatchee Groves.",
  },
  {
    question:
      "How do you deal with the sandy soil in Loxahatchee?",
    answer:
      "Loxahatchee soil tends to be sandier than Wellington or Royal Palm Beach, which affects water retention and root establishment. We amend the soil as needed, grade for proper drainage, and select sod varieties proven to thrive in these conditions. Proper prep is the difference between sod that takes hold and sod that fails.",
  },
  {
    question: "Do you install sod around barns and houses too, or just pastures?",
    answer:
      "We do it all. Many Loxahatchee clients have us install Bahia in the paddocks and pastures, then St. Augustine or Zoysia around the house, barn entrance, and driveway. One crew, one project, one bill.",
  },
];

export default function SodInstallationLoxahatcheePage() {
  return (
    <>
      <Hero
        short
        title="Sod Installation in Loxahatchee"
        tagline="Large acreage sod for The Acreage and beyond"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Loxahatchee Sod Installation for Farms and Acreage Properties
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Loxahatchee &mdash; known locally as The Acreage &mdash; is
              where Palm Beach County&apos;s rural character is still alive.
              Agricultural zoning, large-lot properties, and a growing
              equestrian community define this area. Properties here are
              measured in acres, not square feet, and the sod needs to match
              that scale. From multi-acre horse pastures off Seminole Pratt
              Whitney Road to hobby farms near Lion Country Safari,
              Loxahatchee property owners need turf solutions built for
              serious acreage.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              My Horse Farm provides sod installation for Loxahatchee horse
              farms, cattle ranches, residential acreage, and agricultural
              properties. We bring the heavy equipment needed for large
              jobs &mdash; skid steers, loaders, and enough manpower to
              get acres done in days, not weeks. We install Bahia, Bermuda,
              St.&nbsp;Augustine, and Zoysia, matching each variety to the
              specific use and soil conditions on your property.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Loxahatchee&apos;s sandy soil and open terrain create unique
              challenges for sod establishment. We address drainage, soil
              amendment, and grading before a single roll of sod goes down
              &mdash; because on a 10-acre property, getting the prep wrong
              is an expensive mistake.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Sod Solutions for Loxahatchee Properties
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              Loxahatchee properties range from 1-acre hobby farms to 20-acre
              equestrian estates. We tailor every install to your land and
              your animals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Pasture &amp; Paddock Sod
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bahia grass installed across multi-acre pastures and
                  individual paddocks. We grade for drainage, prep the soil,
                  and lay sod tight so it roots fast even in Loxahatchee&apos;s
                  sandy ground.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Residential Acreage
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  St. Augustine or Bermuda around your home, barn entrance,
                  and common areas. We handle the full property &mdash;
                  functional turf in the back, polished turf up front.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  New Construction Sod
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Building a new barn or home on your Loxahatchee acreage? We
                  work with builders and contractors to install sod as soon as
                  grading is complete. Fast turnaround to meet your CO timeline.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Erosion Repair
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Loxahatchee&apos;s sandy soil and flat terrain can lead to
                  washout areas during heavy rains. We re-grade problem spots,
                  build up low areas, and install sod to stabilize the ground
                  and prevent further erosion.
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
                    <strong>Built for large acreage</strong> &mdash; we bring
                    heavy equipment and enough crew for multi-acre installs
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Sandy soil expertise</strong> &mdash; we know how
                    to prep Loxahatchee ground for successful sod establishment
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Agricultural property experience</strong> &mdash;
                    we work on horse farms, cattle ranches, and mixed-use
                    acreage
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Volume pricing</strong> &mdash; larger properties
                    benefit from better per-acre rates
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Premium FL-grown sod</strong> &mdash; delivered
                    fresh from local farms, not sitting on a pallet for days
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full site prep included</strong> &mdash; grading,
                    old turf removal, and soil conditioning on every job
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed and insured</strong> &mdash; compliant
                    for agricultural and residential work
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>12+ years in Palm Beach County</strong> &mdash;
                    400+ horse farm clients trust us with their properties
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
              Serving All of Western Palm Beach County
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              Our Royal Palm Beach base puts us right next to Loxahatchee.
              We also install sod in these nearby communities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/sod-installation/wellington"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Wellington
              </Link>
              <Link
                href="/sod-installation/royal-palm-beach"
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
            Ready to Re-Sod Your Loxahatchee Property?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            We provide free on-site estimates for Loxahatchee properties of
            all sizes. Call us or request a quote online and we&apos;ll walk
            your acreage within days.
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
            name: "Loxahatchee",
          },
          description:
            "Professional sod installation for large acreage horse farms and pastures in Loxahatchee, FL. Bahia, Bermuda, St. Augustine and Zoysia with expert grading and soil prep for agricultural properties.",
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
              name: "Loxahatchee",
              item: "https://www.myhorsefarm.com/sod-installation/loxahatchee",
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
