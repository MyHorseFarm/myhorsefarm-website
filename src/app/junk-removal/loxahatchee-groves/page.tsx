import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Junk Removal in Loxahatchee Groves, FL",
  description:
    "Junk removal for Loxahatchee Groves farms and acreage properties. Old fencing, equipment, debris and yard waste hauled away. $75/ton. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/junk-removal/loxahatchee-groves",
  },
  openGraph: {
    title: "Junk Removal in Loxahatchee Groves, FL",
    description:
      "Junk removal for Loxahatchee Groves farms and acreage properties. Old fencing, equipment and debris hauled away at $75/ton.",
    type: "website",
    url: "https://www.myhorsefarm.com/junk-removal/loxahatchee-groves",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Junk Removal in Loxahatchee Groves, FL",
    description:
      "Junk removal for Loxahatchee Groves farms and acreage. Old fencing, equipment and debris at $75/ton.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function JunkRemovalLoxahatcheeGrovesPage() {
  return (
    <>
      <Hero
        short
        title="Junk Removal in Loxahatchee Groves"
        tagline="Heavy-duty hauling for acreage properties and working farms"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Loxahatchee Groves Junk Removal Services
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Loxahatchee Groves properties accumulate the kind of junk that
            standard haulers won&apos;t touch. Years of farming leaves behind
            rusted-out equipment, collapsed fencing runs, rotted lumber stacks,
            old water tanks, decommissioned trailers and piles of debris that
            have been sitting so long they&apos;ve become part of the landscape.
            My Horse Farm specializes in exactly this kind of work. We have the
            trucks, the manpower and the dirt-road experience to clear
            Loxahatchee Groves properties that other companies drive right past.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            The Groves&apos; agricultural heritage and large-acreage zoning mean
            properties often span 5, 10 or 20 acres with junk scattered across
            multiple paddocks, outbuildings and tree lines. We don&apos;t just
            pull from the driveway — we bring equipment onto the property,
            navigate the shell rock roads and clear debris from wherever it sits.
            Pricing starts at $75 per ton, and we provide a free walk-through
            estimate for larger Groves jobs.
          </p>
        </section>

        {/* What We Haul */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What We Haul From Loxahatchee Groves Properties
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Farm Equipment &amp; Metal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Rusted trailers, broken mowers, old water heaters, metal
                gates, livestock panels and scrap metal of all kinds. We
                separate ferrous and non-ferrous metals for recycling.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fencing &amp; Lumber
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Collapsed fence lines, rotted posts, damaged cross rails,
                old pallets and scrap lumber. We pull fence posts, load
                the material and haul it off in a single visit.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Brush &amp; Land Clearing Debris
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Overgrown Groves properties often have years of brush,
                fallen trees and vegetation piles. We clear these areas
                so you can reclaim usable pasture and paddock space.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Household &amp; Construction Waste
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Old appliances, renovation debris, broken furniture and
                general household junk. If you&apos;re remodeling a
                Groves farmhouse or barn, we handle the tear-out
                materials.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Loxahatchee Groves Property Owners Choose Us
          </h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Dirt-road capable</strong> — our trucks navigate the
                unpaved roads on Collecting Canal, F Road, Folsom and every
                side road without getting stuck or tearing up your access
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Large-property experience</strong> — we clear debris
                from multi-acre parcels, not just driveway piles. We bring
                equipment onto the property and work across paddocks and
                outbuildings
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Heavy-item capability</strong> — concrete troughs,
                steel gates, old tractors, water tanks — we have the
                equipment to load items that weigh hundreds of pounds
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Fair, weight-based pricing</strong> — $75 per ton
                keeps costs predictable, and free estimates mean no surprises
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
            We haul junk from properties throughout western Palm Beach County.
            Wherever you are, we cover it:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/junk-removal/loxahatchee"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee
            </Link>
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
              href="/junk-removal/palm-beach-gardens"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Palm Beach Gardens
            </Link>
            <Link
              href="/junk-removal/west-palm-beach"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              West Palm Beach
            </Link>
          </div>
        </section>

        {/* Also offer manure removal */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Running a Horse Farm? Add Manure Removal
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Most Loxahatchee Groves horse farms need both junk removal and
            ongoing{" "}
            <Link
              href="/manure-removal/loxahatchee-groves"
              className="text-green-700 hover:text-green-900 underline"
            >
              manure removal service
            </Link>
            . Clear the accumulated debris, then set up scheduled waste pickups
            with large-capacity roll-off containers built for Groves-sized
            operations.
          </p>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Junk Removal FAQ for Loxahatchee Groves
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can you access my property if I&apos;m on an unpaved road?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. Our trucks are built for the Groves. We drive shell
                rock, limestone and dirt roads daily. No property in
                Loxahatchee Groves is too remote for our crew to reach.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do you handle junk scattered across a large property?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We bring equipment onto the property and work section by
                section. For larger acreage jobs, we stage a roll-off on
                site and make multiple passes. We provide a free
                walk-through estimate so you know the scope and cost upfront.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can you haul old farm equipment and heavy metal?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely. Rusted trailers, broken mowers, steel gates,
                water tanks and scrap metal are common on Groves
                properties. We have the loading capacity to handle items
                that weigh hundreds of pounds each.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you provide dumpster rental for extended cleanout projects?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. For multi-day or ongoing cleanouts on large Groves
                properties, we can place a 20-yard or 30-yard roll-off
                container on site. You fill it at your pace, and we pick
                it up when it&apos;s full.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Clear Your Loxahatchee Groves Property
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            No property is too big and no load is too heavy. Call us at{" "}
            <a href="tel:+15615767667" className="text-green-700 font-semibold">
              (561) 576&#8209;7667
            </a>{" "}
            or request a free estimate online.
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
            name: "Loxahatchee Groves",
          },
          description:
            "Junk removal for Loxahatchee Groves farms and acreage properties. Old fencing, equipment, debris and yard waste hauled away starting at $75 per ton.",
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
              name: "Loxahatchee Groves",
              item: "https://www.myhorsefarm.com/junk-removal/loxahatchee-groves",
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
              name: "Can your trucks access properties on unpaved Loxahatchee Groves roads?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Our trucks are built for the Groves. We drive shell rock, limestone and dirt roads daily. No property in Loxahatchee Groves is too remote for our crew to reach.",
              },
            },
            {
              "@type": "Question",
              name: "How do you handle junk scattered across a large Loxahatchee Groves property?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We bring equipment onto the property and work section by section. For larger acreage jobs, we stage a roll-off on site and make multiple passes. We provide a free walk-through estimate.",
              },
            },
            {
              "@type": "Question",
              name: "Can you haul old farm equipment and heavy metal from Loxahatchee Groves?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. Rusted trailers, broken mowers, steel gates, water tanks and scrap metal are common on Groves properties. We have the loading capacity to handle items that weigh hundreds of pounds.",
              },
            },
            {
              "@type": "Question",
              name: "Do you provide dumpster rental for extended cleanout projects in Loxahatchee Groves?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. For multi-day or ongoing cleanouts on large Groves properties, we can place a 20-yard or 30-yard roll-off container on site. You fill it at your pace, and we pick it up when it is full.",
              },
            },
          ],
        }}
      />
    </>
  );
}
