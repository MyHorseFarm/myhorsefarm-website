import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Fill Dirt Delivery in Royal Palm Beach, FL",
  description:
    "Local fill dirt delivery in Royal Palm Beach FL. Clean fill, top soil, sand, limerock for horse farms, residential grading, driveways and drainage projects. Same-day available. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/fill-dirt/royal-palm-beach",
  },
  openGraph: {
    title: "Fill Dirt Delivery in Royal Palm Beach, FL",
    description:
      "Local fill dirt delivery in Royal Palm Beach FL. Clean fill, top soil, sand, limerock for horse farms, residential grading, driveways and drainage projects.",
    type: "website",
    url: "https://www.myhorsefarm.com/fill-dirt/royal-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Fill Dirt Delivery in Royal Palm Beach, FL",
    description:
      "Local fill dirt delivery in Royal Palm Beach FL. Clean fill, top soil, sand, limerock for horse farms, residential grading, and drainage projects.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function FillDirtRoyalPalmBeachPage() {
  return (
    <>
      <Hero
        short
        title="Fill Dirt Delivery in Royal Palm Beach"
        tagline="Your local source for fill dirt, top soil, and base materials"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=fill-dirt"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Royal Palm Beach Fill Dirt Delivery Services
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            My Horse Farm is headquartered right here in Royal Palm Beach, which
            means fill dirt delivery to your property is as fast and affordable
            as it gets. No long haul fees, no waiting for trucks coming from
            across the county. Whether you&apos;re leveling a horse paddock off
            Crestwood Boulevard, regrading a residential lot near the Commons,
            or building up a driveway in Acreage-adjacent neighborhoods, we
            deliver the right material in the right quantity — often the same
            day you call.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Royal Palm Beach sits at the boundary between suburban Palm Beach
            County and the rural acreage communities to the west. That mix of
            residential properties and small horse farms means we handle
            everything from a few yards of top soil for a backyard project to
            50-plus yards of clean fill for paddock construction. Our proximity
            means lower delivery costs and faster turnaround than any competitor.
          </p>

          {/* Fill types */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Fill Materials Available for Royal Palm Beach
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Clean Fill Dirt</h4>
              <p>
                Screened fill for raising elevation, backfilling foundations, and
                improving drainage on residential and equestrian properties.
                Ideal for Royal Palm Beach lots that sit low and collect water
                during the wet season.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Top Soil</h4>
              <p>
                Rich, organic-blend top soil for lawn establishment, garden
                beds, sod installation, and pasture improvement. Perfect for
                Royal Palm Beach homeowners and horse farm owners looking to
                establish healthy turf quickly.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Sand</h4>
              <p>
                Washed fill sand and mason sand for drainage layers, arena
                footing, and construction projects. We stock the grades most
                commonly used for equestrian and residential applications in
                Palm Beach County.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Limerock &amp; Shell Rock</h4>
              <p>
                Hard-compacting base material for driveways, parking pads, barn
                aisles, and access roads. Limerock holds up under heavy use
                and drains well — critical for Royal Palm Beach properties
                dealing with Florida&apos;s afternoon downpours.
              </p>
            </div>
          </div>

          {/* Common projects */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Popular Fill Dirt Projects in Royal Palm Beach
          </h3>
          <ul className="space-y-3 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Yard grading and elevation</strong> — Fixing low spots
                that pool water after every rain, improving drainage across
                your property
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Driveway base and repair</strong> — Building or
                restoring limerock driveways that hold up under daily traffic
                and Florida storms
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Horse paddock construction</strong> — Leveling and
                raising turnout areas so horses aren&apos;t standing in mud
                during the wet months
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Sod prep and landscaping</strong> — Proper grading and
                top soil application before laying new sod or seeding pastures
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Pool and patio backfill</strong> — Filling and
                compacting around new construction, retaining walls, and
                hardscape installations
              </span>
            </li>
          </ul>

          {/* Why choose us */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            The Local Advantage
          </h3>
          <ul className="pl-5 leading-relaxed space-y-2 mb-10">
            <li>
              Based in Royal Palm Beach — no long-haul surcharges, fastest
              response times in the area
            </li>
            <li>
              Same-day delivery available for most materials and quantities
            </li>
            <li>
              We handle delivery and spreading — not just dumping a pile in your
              driveway
            </li>
            <li>
              Free on-site estimates with accurate yardage calculations so you
              don&apos;t overspend
            </li>
            <li>
              Licensed, insured, and trusted by Royal Palm Beach homeowners and
              horse farm owners for over a decade
            </li>
          </ul>

          {/* FAQs */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How much does fill dirt delivery cost in Royal Palm Beach?
              </h4>
              <p>
                Pricing depends on material type and quantity. Because we&apos;re
                based locally, Royal Palm Beach deliveries cost less than
                surrounding areas. Contact us for a free quote — we&apos;ll
                calculate exact yardage and give you a price before we start.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Can you deliver fill dirt to my residential property?
              </h4>
              <p>
                Yes. We deliver to both residential and equestrian properties in
                Royal Palm Beach. For smaller residential jobs, we use
                appropriately sized trucks to avoid damaging driveways or lawns.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                What&apos;s the difference between fill dirt and top soil?
              </h4>
              <p>
                Fill dirt is primarily for raising elevation and structural
                support — it compacts well but doesn&apos;t support plant growth.
                Top soil is nutrient-rich and designed for lawns, gardens, and
                pastures. Many projects use fill dirt for base grading, then top
                soil for the final layer before sodding.
              </p>
            </div>
          </div>

          {/* Cross-links */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Serving Royal Palm Beach and Surrounding Areas
          </h3>
          <p className="mb-6">
            We also deliver fill dirt to{" "}
            <Link
              href="/fill-dirt/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              Wellington
            </Link>
            ,{" "}
            <Link
              href="/fill-dirt/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              Loxahatchee
            </Link>
            , Loxahatchee Groves, West Palm Beach, and Palm Beach Gardens.
            Need other services? Check out our{" "}
            <Link
              href="/repairs/royal-palm-beach"
              className="text-primary-dark hover:text-primary underline"
            >
              farm repairs
            </Link>
            ,{" "}
            <Link
              href="/sod-installation"
              className="text-primary-dark hover:text-primary underline"
            >
              sod installation
            </Link>
            , and{" "}
            <Link
              href="/manure-removal/west-palm-beach"
              className="text-primary-dark hover:text-primary underline"
            >
              manure removal
            </Link>{" "}
            services.
          </p>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Order Fill Dirt in Royal Palm Beach Today
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Call us at{" "}
              <a href="tel:+15615767667" className="text-primary-dark font-semibold">
                (561) 576&#8209;7667
              </a>{" "}
              or request a quote online. Same-day delivery available for most
              materials.
            </p>
            <Link
              href="/quote?service=fill-dirt"
              className="inline-block px-8 py-3 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Fill Dirt Delivery and Grading",
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
            ],
          },
          areaServed: {
            "@type": "City",
            name: "Royal Palm Beach",
          },
          description:
            "Local fill dirt delivery in Royal Palm Beach, FL. Clean fill, top soil, sand, limerock for horse farms, residential grading, driveways, and drainage improvements.",
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
              name: "Fill Dirt",
              item: "https://www.myhorsefarm.com/fill-dirt",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Royal Palm Beach",
              item: "https://www.myhorsefarm.com/fill-dirt/royal-palm-beach",
            },
          ],
        }}
      />
    </>
  );
}
