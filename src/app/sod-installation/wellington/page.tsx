import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Sod Installation in Wellington, FL",
  description:
    "Professional sod installation for horse paddocks, pastures and lawns in Wellington, FL. Bahia, Bermuda, St. Augustine and Zoysia. Expert grading, soil prep and installation for equestrian properties near WEF and polo grounds.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/sod-installation/wellington",
  },
  openGraph: {
    title: "Sod Installation in Wellington, FL",
    description:
      "Professional sod installation for horse paddocks, pastures and lawns in Wellington. Bahia, Bermuda, St. Augustine and Zoysia for equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/sod-installation/wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sod Installation in Wellington, FL",
    description:
      "Professional sod installation for horse paddocks, pastures and lawns in Wellington, FL. Bahia, Bermuda, St. Augustine and Zoysia.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const FAQS = [
  {
    question: "What sod variety works best for Wellington horse paddocks?",
    answer:
      "Bahia grass is the top choice for Wellington paddocks. It handles heavy hoof traffic from training and turnout, tolerates South Florida heat, and requires minimal fertilization. Many Wellington show barns also choose Bermuda for high-visibility areas because of its dense, manicured look.",
  },
  {
    question:
      "Do you work around Wellington show schedules like WEF and polo season?",
    answer:
      "Yes. We understand that Wellington barns operate on tight schedules during the Winter Equestrian Festival and polo season. We coordinate installation timing so your paddocks are ready before season starts, and we can work around your training and show calendar.",
  },
  {
    question: "How do you handle drainage on Wellington equestrian properties?",
    answer:
      "Wellington sits on a high water table, which makes grading and drainage critical for any sod job. We evaluate slope, soil saturation, and existing swales before laying sod. Proper grading prevents standing water that can cause hoof issues and turf failure.",
  },
  {
    question: "Can you re-sod paddocks that are worn down from heavy use?",
    answer:
      "Absolutely. Worn paddocks are one of our most common jobs in Wellington. We strip the old turf, re-grade the surface, condition the soil, and lay fresh sod. Most paddock re-sod jobs are completed in 1-2 days depending on size.",
  },
];

export default function SodInstallationWellingtonPage() {
  return (
    <>
      <Hero
        short
        title="Sod Installation in Wellington"
        tagline="Premium turf for the equestrian capital of the world"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Wellington Sod Installation for Equestrian Properties
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Wellington is the epicenter of equestrian life in the United
              States. Home to the Winter Equestrian Festival, the Global
              Dressage Festival, and the International Polo Club Palm Beach,
              this community demands properties that perform as well as they
              look. With over 14,000 acres of equestrian trails and hundreds
              of private barns, the turf underfoot matters &mdash; for the
              safety of the horses, the functionality of your paddocks, and
              the curb appeal of your property.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              My Horse Farm provides professional sod installation for
              Wellington horse farms, training facilities, polo fields, and
              residential properties. We install Bahia, Bermuda,
              St.&nbsp;Augustine, and Zoysia grass with full site prep,
              expert grading, and attention to the drainage challenges that
              come with Wellington&apos;s high water table.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you need to re-sod worn paddocks on South Shore
              Boulevard, install fresh turf at a barn off Pierson Road, or
              transform a property near the show grounds, we handle it from
              start to finish.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              What We Install in Wellington
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              Every sod variety we carry is Florida-grown and selected for
              equestrian use. We match the grass type to your property&apos;s
              specific needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bahia Grass
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The standard for Wellington horse pastures. Drought-tolerant,
                  low-maintenance, and built to handle daily turnout. We install
                  Bahia on more Wellington paddocks than any other variety.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Bermuda Grass
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dense and fast-recovering, Bermuda is popular at Wellington
                  show barns and polo practice fields. It stands up to intense
                  use and looks sharp for property tours and client visits.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  St. Augustine
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Thick, lush turf ideal for Wellington barn surrounds,
                  driveways, and residential areas. St. Augustine thrives in
                  both sun and shade, giving your property a polished look.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-2 text-primary-dark">
                  Zoysia Grass
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fine-bladed and carpet-like. Wellington properties that need
                  a premium finish &mdash; show barn entryways, event areas,
                  and estate grounds &mdash; often choose Zoysia for its
                  refined appearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
              Why Wellington Horse Owners Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>We know Wellington</strong> &mdash; we understand
                    the Village&apos;s equestrian zoning, drainage
                    requirements, and property standards
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full site prep included</strong> &mdash; old turf
                    removal, grading, and soil conditioning before any sod goes
                    down
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Season-aware scheduling</strong> &mdash; we work
                    around WEF, polo, and dressage calendars
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Heavy equipment on-site</strong> &mdash; skid
                    steer and loader for efficient large-acreage installs
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Premium Florida-grown sod</strong> &mdash; sourced
                    from local farms and delivered fresh to your property
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Licensed and insured</strong> &mdash; fully
                    compliant for commercial and residential work in Wellington
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>12+ years serving PBC</strong> &mdash; trusted by
                    400+ horse farm clients across Palm Beach County
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Transparent pricing</strong> &mdash; free on-site
                    estimates with no hidden fees or surprises
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
              Also Serving Nearby Communities
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
              Based in Royal Palm Beach, we&apos;re minutes from Wellington
              and serve equestrian properties throughout Palm Beach County.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/sod-installation/royal-palm-beach"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary-dark border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
              >
                Royal Palm Beach
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
            Ready to Upgrade Your Wellington Paddocks?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Get a free on-site estimate for your Wellington property. We&apos;ll
            recommend the right sod variety, walk the site, and give you a
            transparent quote.
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
            name: "Wellington",
          },
          description:
            "Professional sod installation for horse paddocks, pastures and lawns in Wellington, FL. Bahia, Bermuda, St. Augustine and Zoysia grass with full site prep and expert grading.",
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
              name: "Wellington",
              item: "https://www.myhorsefarm.com/sod-installation/wellington",
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
