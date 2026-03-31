import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Junk Removal in Palm Beach Gardens, FL",
  description:
    "Professional junk removal in Palm Beach Gardens, FL. Estate cleanouts, barn debris, appliances and yard waste hauled away. Starting at $75/ton. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/junk-removal/palm-beach-gardens",
  },
  openGraph: {
    title: "Junk Removal in Palm Beach Gardens, FL",
    description:
      "Professional junk removal in Palm Beach Gardens. Estate cleanouts, barn debris and yard waste hauled away starting at $75/ton.",
    type: "website",
    url: "https://www.myhorsefarm.com/junk-removal/palm-beach-gardens",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Junk Removal in Palm Beach Gardens, FL",
    description:
      "Professional junk removal in Palm Beach Gardens. Estate cleanouts and debris hauled away starting at $75/ton.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function JunkRemovalPalmBeachGardensPage() {
  return (
    <>
      <Hero
        short
        title="Junk Removal in Palm Beach Gardens"
        tagline="Clean properties, clear space — from PGA Blvd to Northlake"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Palm Beach Gardens Junk Removal Services
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Palm Beach Gardens is known for manicured landscapes, upscale
            communities and properties held to a high standard. When junk
            accumulates on a Gardens estate — whether it&apos;s old outdoor
            furniture by the pool, storm-damaged landscaping, outdated
            appliances or barn debris on a horse property off Northlake
            Boulevard — you need a removal team that works efficiently and
            leaves the site spotless. That&apos;s what My Horse Farm delivers.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We started as a horse farm service company, which means we&apos;re
            equipped for the heavy, awkward and oversized items that standard
            junk haulers avoid. Concrete troughs, metal gates, lumber piles,
            rusted equipment — we load it all. But we also handle residential
            cleanouts for non-equestrian Gardens homes. From Frenchman&apos;s
            Reserve to Mirasol to the estates along PGA Boulevard, we serve
            all of Palm Beach Gardens at $75 per ton.
          </p>
        </section>

        {/* What We Haul */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What We Remove in Palm Beach Gardens
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Estate &amp; Home Cleanouts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Full or partial property cleanouts for homeowners,
                estate managers and realtors preparing a Gardens property
                for sale. We clear furniture, appliances, decor and
                storage items room by room.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Equestrian Property Debris
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Old fencing, broken jump standards, worn arena footing,
                damaged tack rooms, rusted water tanks and any other
                barn-related junk on Gardens horse properties along
                Northlake and the western corridors.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Storm &amp; Landscape Debris
              </h3>
              <p className="text-gray-600 leading-relaxed">
                After a hurricane or heavy storm, we offer rapid-response
                debris removal. Fallen trees, damaged pergolas, broken
                outdoor structures and scattered landscape materials
                cleared fast.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Palm Beach Gardens Homeowners Choose Us
          </h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Premium service standards</strong> — we treat your
                Gardens property with care, protecting driveways, landscaping
                and gates during the removal process
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>HOA and gated community experience</strong> — we work
                within the access rules and scheduling requirements of
                Frenchman&apos;s Reserve, Mirasol, Old Palm and other gated
                communities
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Straightforward pricing</strong> — $75 per ton, weighed
                at the disposal facility, with a free on-site estimate so you
                know the cost before we start
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Responsible disposal</strong> — we recycle metals and
                divert reusable materials from the landfill wherever possible
              </span>
            </li>
          </ul>
        </section>

        {/* Service Area Cross-Links */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Junk Removal Across Palm Beach County
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            We serve the entire western Palm Beach County corridor. Need
            service outside the Gardens? We&apos;re there:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/junk-removal/wellington"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Wellington
            </Link>
            <Link
              href="/junk-removal/royal-palm-beach"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Royal Palm Beach
            </Link>
            <Link
              href="/junk-removal/loxahatchee-groves"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee Groves
            </Link>
            <Link
              href="/junk-removal/west-palm-beach"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              West Palm Beach
            </Link>
            <Link
              href="/junk-removal/loxahatchee"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee
            </Link>
          </div>
        </section>

        {/* Also offer manure removal */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Horse Property? Add Manure Removal
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Gardens equestrian property owners often combine junk removal with
            our{" "}
            <Link
              href="/manure-removal/palm-beach-gardens"
              className="text-green-700 hover:text-green-900 underline"
            >
              scheduled manure removal service
            </Link>
            . Clear the debris, then set up ongoing waste management — all from
            one trusted provider.
          </p>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Junk Removal FAQ for Palm Beach Gardens
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can you work within my HOA&apos;s restrictions?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. We coordinate with gate access, respect noise and
                scheduling rules, and leave the property clean. We
                regularly work in Frenchman&apos;s Reserve, Mirasol, Old
                Palm and other gated Gardens communities.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How quickly can you get to Palm Beach Gardens?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re based in Royal Palm Beach, about 15 minutes
                south. Most Gardens jobs can be scheduled within 1 to 2
                business days, and same-day service is often available
                depending on our route that day.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you handle full estate cleanouts?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely. We work with estate managers, realtors and
                homeowners to clear entire properties. We can handle
                multi-day cleanouts for larger Gardens estates and
                provide dumpster placement for extended projects.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a minimum load charge?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No minimum load fees. You pay $75 per ton based on the
                actual weight at the disposal facility. For small loads,
                your total may be well under $150.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Schedule Junk Removal in Palm Beach Gardens
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            From a single truckload to a full estate cleanout, we handle it.
            Call{" "}
            <a href="tel:+15615767667" className="text-green-700 font-semibold">
              (561) 576&#8209;7667
            </a>{" "}
            or get a quote online.
          </p>
          <Link
            href="/quote"
            className="inline-block rounded-xl bg-green-700 px-8 py-4 text-lg font-bold text-white hover:bg-green-800 transition-colors"
          >
            Get a Free Quote
          </Link>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Junk Removal",
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
            name: "Palm Beach Gardens",
          },
          description:
            "Professional junk removal in Palm Beach Gardens, FL. Estate cleanouts, barn debris, appliances and yard waste starting at $75 per ton.",
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
              name: "Junk Removal",
              item: "https://www.myhorsefarm.com/junk-removal",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Palm Beach Gardens",
              item: "https://www.myhorsefarm.com/junk-removal/palm-beach-gardens",
            },
          ],
        }}
      />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Can you work within my HOA's restrictions in Palm Beach Gardens?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. We coordinate with gate access, respect noise and scheduling rules, and leave the property clean. We regularly work in Frenchman's Reserve, Mirasol, Old Palm and other gated Gardens communities.",
              },
            },
            {
              "@type": "Question",
              name: "How quickly can you get to Palm Beach Gardens for junk removal?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We're based in Royal Palm Beach, about 15 minutes south. Most Gardens jobs can be scheduled within 1 to 2 business days, and same-day service is often available.",
              },
            },
            {
              "@type": "Question",
              name: "Do you handle full estate cleanouts in Palm Beach Gardens?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. We work with estate managers, realtors and homeowners to clear entire properties. We can handle multi-day cleanouts for larger Gardens estates.",
              },
            },
            {
              "@type": "Question",
              name: "Is there a minimum load charge for junk removal?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No minimum load fees. You pay $75 per ton based on the actual weight at the disposal facility. For small loads, your total may be well under $150.",
              },
            },
          ],
        }}
      />
    </>
  );
}
