import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Junk Removal in Royal Palm Beach, FL",
  description:
    "Fast junk removal in Royal Palm Beach, FL. Farm debris, old fencing, appliances and yard waste hauled away starting at $75/ton. Call (561) 576-7667 for same-day service.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/junk-removal/royal-palm-beach",
  },
  openGraph: {
    title: "Junk Removal in Royal Palm Beach, FL",
    description:
      "Fast junk removal in Royal Palm Beach. Farm debris, old fencing, appliances and yard waste hauled away starting at $75/ton.",
    type: "website",
    url: "https://www.myhorsefarm.com/junk-removal/royal-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Junk Removal in Royal Palm Beach, FL",
    description:
      "Fast junk removal in Royal Palm Beach. Farm debris, appliances and yard waste starting at $75/ton.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function JunkRemovalRoyalPalmBeachPage() {
  return (
    <>
      <Hero
        short
        title="Junk Removal in Royal Palm Beach"
        tagline="Same-day hauling from our home base — $75 per ton"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Royal Palm Beach Junk Removal Services
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Royal Palm Beach is home base for My Horse Farm, which means when
            you need junk hauled away, we&apos;re already in the neighborhood.
            Broken fencing piled behind the barn, an old water trough that
            finally rusted through, leftover construction materials from a
            paddock renovation, storm debris scattered across the pasture — we
            load it, haul it and dispose of it properly so your property stays
            clean and usable.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our junk removal service isn&apos;t limited to horse farms. We serve
            homeowners throughout Royal Palm Beach, from the Crestwood community
            to properties near Commons Park and along Royal Palm Beach
            Boulevard. Garage cleanouts, furniture removal, appliance hauling,
            yard waste — if it needs to go, we take it. Pricing starts at just
            $75 per ton with no hidden fees.
          </p>
        </section>

        {/* What We Haul */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What We Haul in Royal Palm Beach
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Farm &amp; Barn Debris
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Old fencing, rotted posts, broken stall boards, worn-out
                tack trunks, damaged feed bins and any other barn junk
                taking up space on your Royal Palm Beach property.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Household Items
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Furniture, mattresses, appliances, electronics and general
                household clutter. If you&apos;re cleaning out a garage,
                shed or spare room, we handle the heavy lifting.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Yard &amp; Storm Waste
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fallen branches, palm fronds, brush piles, old landscaping
                materials and post-hurricane debris. We haul yard waste
                year-round and offer rapid storm response.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Royal Palm Beach Residents Choose Us
          </h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Same-day availability</strong> — since we&apos;re based
                in Royal Palm Beach, we can often get a truck to your property
                the same afternoon you call
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Transparent pricing</strong> — $75 per ton with no
                surprise fees, no minimum-load markups and a free estimate
                before we start
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Eco-friendly disposal</strong> — we recycle metals,
                separate green waste for composting and use approved disposal
                facilities for everything else
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Farm-tough crews</strong> — our team handles heavy,
                awkward and oversized items that standard junk removal companies
                won&apos;t touch
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
            We haul junk throughout western Palm Beach County. If you need
            service in a neighboring area, we&apos;re there too:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/junk-removal/wellington"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Wellington
            </Link>
            <Link
              href="/junk-removal/loxahatchee-groves"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee Groves
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
            Also Need Manure Removal?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Many Royal Palm Beach horse farms pair junk removal with our{" "}
            <Link
              href="/manure-removal/royal-palm-beach"
              className="text-green-700 hover:text-green-900 underline"
            >
              scheduled manure removal service
            </Link>
            . Clean out the barn junk and set up ongoing waste management in a
            single visit.
          </p>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Junk Removal FAQ for Royal Palm Beach
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does pricing work for junk removal?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We charge $75 per ton with no hidden fees. We provide a free
                estimate before loading anything. For most residential
                cleanouts in Royal Palm Beach, total cost falls between $150
                and $500 depending on volume and weight.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can you remove old fencing and barn materials?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                That&apos;s one of our specialties. We handle wood fencing,
                metal panels, rotted posts, broken stall boards and any other
                farm infrastructure that needs to go. We&apos;ll pull it down
                and haul it off.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer same-day junk removal in Royal Palm Beach?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. Because our trucks are based right here, we can often
                schedule same-day pickups for Royal Palm Beach properties.
                Call before noon for the best chance at same-day service.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What items won&apos;t you haul?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We cannot haul hazardous materials like chemicals, paint,
                asbestos or medical waste. For everything else — including
                heavy items, construction debris and oversized furniture — we
                have the equipment to handle it.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Clear the Clutter Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to get rid of that junk? Call us at{" "}
            <a href="tel:+15615767667" className="text-green-700 font-semibold">
              (561) 576&#8209;7667
            </a>{" "}
            or request a quote online. Same-day service available.
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
            name: "Royal Palm Beach",
          },
          description:
            "Fast junk removal in Royal Palm Beach, FL. Farm debris, old fencing, appliances and yard waste hauled away starting at $75 per ton.",
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
              name: "Royal Palm Beach",
              item: "https://www.myhorsefarm.com/junk-removal/royal-palm-beach",
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
              name: "How does junk removal pricing work in Royal Palm Beach?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We charge $75 per ton with no hidden fees. We provide a free estimate before loading anything. For most residential cleanouts in Royal Palm Beach, total cost falls between $150 and $500 depending on volume and weight.",
              },
            },
            {
              "@type": "Question",
              name: "Can you remove old fencing and barn materials?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "That is one of our specialties. We handle wood fencing, metal panels, rotted posts, broken stall boards and any other farm infrastructure that needs to go.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer same-day junk removal in Royal Palm Beach?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Because our trucks are based right here, we can often schedule same-day pickups for Royal Palm Beach properties. Call before noon for the best chance at same-day service.",
              },
            },
            {
              "@type": "Question",
              name: "What items won't you haul?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We cannot haul hazardous materials like chemicals, paint, asbestos or medical waste. For everything else, including heavy items, construction debris and oversized furniture, we have the equipment to handle it.",
              },
            },
          ],
        }}
      />
    </>
  );
}
