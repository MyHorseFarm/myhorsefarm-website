import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Sod Installation Services | Horse Paddock & Pasture Sod in Wellington FL",
  description:
    "Professional sod installation for horse paddocks, pastures & lawns in Wellington, Loxahatchee & West Palm Beach FL. Bahia, Bermuda, St. Augustine & Zoysia. Expert grading, soil prep & installation. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/sod-installation" },
  openGraph: {
    title:
      "Sod Installation | Horse Paddock & Pasture Sod",
    description:
      "Professional sod installation for horse paddocks, pastures and lawns. Bahia, Bermuda, St. Augustine & Zoysia. Expert installation in Palm Beach County FL.",
    type: "website",
    url: "https://www.myhorsefarm.com/sod-installation",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sod Installation | Horse Paddock & Pasture Sod",
    description:
      "Professional sod installation for horse paddocks, pastures and lawns in Palm Beach County FL. Bahia, Bermuda, St. Augustine & Zoysia.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const SOD_TYPES = [
  {
    icon: "fas fa-seedling",
    title: "Bahia Grass",
    desc: "The go-to choice for horse pastures in South Florida. Bahia is drought-tolerant, low-maintenance, and handles heavy hoof traffic without thinning out. Great for large paddocks and turnout areas.",
  },
  {
    icon: "fas fa-leaf",
    title: "Bermuda Grass",
    desc: "Dense, resilient, and fast-growing. Bermuda stands up to heavy equestrian use and recovers quickly from wear. Ideal for high-traffic paddocks and riding paths.",
  },
  {
    icon: "fas fa-spa",
    title: "St. Augustine",
    desc: "Thick, lush turf that thrives in Florida shade and sun. Perfect for lawns, barn surrounds, and areas where you want a manicured look alongside your working paddocks.",
  },
  {
    icon: "fas fa-tree",
    title: "Zoysia Grass",
    desc: "Fine-bladed and carpet-like with excellent drought tolerance. Zoysia works well for show barns, entryways, and properties that need to look sharp year-round.",
  },
];

const FAQS = [
  {
    question:
      "What type of sod is best for horse paddocks in South Florida?",
    answer:
      "Bahia grass is the most popular choice for horse paddocks in Palm Beach County. It handles heavy hoof traffic, requires minimal fertilization, and tolerates Florida heat and rain. For higher-end properties, Bermuda offers a denser surface that recovers quickly from wear.",
  },
  {
    question: "How long does sod installation take?",
    answer:
      "Most paddock and pasture sod jobs take 1-3 days depending on acreage. We handle everything from old turf removal and grading to soil prep and sod placement. A typical half-acre paddock can be completed in a single day.",
  },
  {
    question: "Do you remove old grass before installing new sod?",
    answer:
      "Yes. We strip old turf, grade the surface for proper drainage, and amend the soil as needed before laying new sod. Proper site prep is critical for healthy root establishment, especially on horse properties where drainage matters.",
  },
  {
    question: "How soon can horses go back on new sod?",
    answer:
      "We recommend keeping horses off new sod for 2-3 weeks to allow root establishment. In South Florida's warm climate, roots typically take hold quickly. We will give you specific care instructions when the job is done.",
  },
  {
    question: "How much does sod installation cost?",
    answer:
      "Pricing depends on acreage, sod variety, site prep needed, and accessibility. We provide free on-site estimates with transparent pricing and no hidden fees. Call us or request a quote online for your specific project.",
  },
];

export default function SodInstallationPage() {
  return (
    <>
      <Hero
        title="Sod Installation Services"
        tagline="Bahia &bull; Bermuda &bull; St.&nbsp;Augustine &bull; Zoysia"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=sod_installation"
      />
      <main>
        {/* Types of Sod */}
        <section className="py-20 md:py-28 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 md:text-4xl text-gray-900">
              Types of Sod We Install
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
              We source premium Florida-grown sod selected for equestrian
              properties. Every variety we install is proven to handle Palm Beach
              County&apos;s heat, rain, and heavy use.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SOD_TYPES.map((item) => (
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
                <h3 className="text-xl font-bold mb-2">Site Assessment</h3>
                <p className="text-green-200">
                  We visit your property, measure the area, evaluate soil and
                  drainage, and recommend the right sod variety for your needs.
                  Free estimates, no pressure.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Prep &amp; Grade</h3>
                <p className="text-green-200">
                  We strip old turf, grade the surface for proper water flow,
                  and condition the soil. This is the step most companies skip
                  &mdash; and it&apos;s the most important one.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Install &amp; Water</h3>
                <p className="text-green-200">
                  Fresh sod is delivered and laid tight with no gaps. We water it
                  in and give you a care sheet so your new turf roots fast and
                  stays green.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 md:text-4xl text-gray-900">
              Why Horse Owners Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Equestrian specialists</strong> &mdash; we know what
                    horses need underfoot
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Full site prep included</strong> &mdash; grading,
                    old turf removal, soil conditioning
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Premium FL-grown sod</strong> &mdash; sourced from
                    local farms, delivered fresh
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-check-circle text-primary mt-1" />
                  <span>
                    <strong>Heavy equipment on-site</strong> &mdash; skid steer
                    and loader for efficient install
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
                    <strong>Fast turnaround</strong> &mdash; most jobs completed
                    in 1-3 days
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
              We install sod on horse farms, pastures, paddocks, and residential
              properties throughout Palm Beach County. Whether you need a single
              paddock re-sodded or an entire property done, we&apos;ll get it
              handled.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "Wellington", href: "/sod-installation" },
                { name: "Loxahatchee", href: "/sod-installation" },
                { name: "West Palm Beach", href: "/sod-installation" },
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
            Ready to Transform Your Paddock?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Get a free on-site estimate or call us now. We&apos;ll recommend the
            right sod for your property and get it installed fast.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=sod_installation"
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
          serviceType: "Sod Installation",
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
            "Professional sod installation for horse paddocks, pastures, arenas, and lawns in Palm Beach County FL. Bahia, Bermuda, St. Augustine, and Zoysia grass varieties with full site prep, grading, and expert installation.",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Sod Varieties",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Bahia Grass Installation",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Bermuda Grass Installation",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "St. Augustine Grass Installation",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Zoysia Grass Installation",
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
              name: "Sod Installation",
              item: "https://www.myhorsefarm.com/sod-installation",
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
