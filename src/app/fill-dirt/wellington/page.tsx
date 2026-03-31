import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Fill Dirt Delivery in Wellington, FL",
  description:
    "Fill dirt delivery and grading for Wellington equestrian properties. Clean fill, top soil, sand, limerock for paddock leveling, arena base, berms and drainage. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/fill-dirt/wellington",
  },
  openGraph: {
    title: "Fill Dirt Delivery in Wellington, FL",
    description:
      "Fill dirt delivery and grading for Wellington equestrian properties. Clean fill, top soil, sand, limerock for paddock leveling, arena base, berms and drainage.",
    type: "website",
    url: "https://www.myhorsefarm.com/fill-dirt/wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Fill Dirt Delivery in Wellington, FL",
    description:
      "Fill dirt delivery and grading for Wellington equestrian properties. Clean fill, top soil, sand, limerock for paddock leveling and arena base.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function FillDirtWellingtonPage() {
  return (
    <>
      <Hero
        short
        title="Fill Dirt Delivery in Wellington"
        tagline="Premium fill materials for Wellington's top equestrian properties"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=fill-dirt"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Wellington Fill Dirt and Grading Services
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            Wellington properties face unique grading challenges. Between the
            flat water table, seasonal flooding, and the demands of world-class
            equestrian facilities near the Winter Equestrian Festival grounds,
            getting the right fill material delivered on time matters. My Horse
            Farm supplies and delivers clean fill dirt, top soil, sand, limerock,
            and shell rock to equestrian properties throughout Wellington — from
            private barns along Pierson Road to large training centers near South
            Shore Boulevard.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            We understand that Wellington&apos;s Village regulations require
            proper grading permits and erosion control for earth-moving projects.
            Our team coordinates with property managers to make sure your fill
            dirt project meets local code requirements while staying on schedule
            for WEF season prep or year-round property improvements.
          </p>

          {/* Fill types */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Fill Materials We Deliver to Wellington
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Clean Fill Dirt</h4>
              <p>
                Screened, debris-free fill for raising elevation, building berms,
                and backfilling around barns and arenas. Essential for Wellington
                properties dealing with high water tables and seasonal flooding
                in low-lying paddocks.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Top Soil</h4>
              <p>
                Nutrient-rich blend for pasture restoration, sod prep, and
                landscaping around Wellington show barns. Our top soil is
                formulated for South Florida growing conditions so your turf
                establishes quickly between seasons.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Sand</h4>
              <p>
                Washed sand for arena footing base layers, drainage
                improvements, and construction fill. We supply the correct grade
                for dressage arenas, jumping rings, and all-weather riding
                surfaces used by Wellington&apos;s top riders.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Limerock &amp; Shell Rock</h4>
              <p>
                Compactable base material for driveways, barn aisles, and
                parking areas that see heavy trailer traffic during show season.
                Limerock creates a solid, well-draining surface that holds up
                under Wellington&apos;s intense rain events.
              </p>
            </div>
          </div>

          {/* Common projects */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Common Fill Dirt Projects in Wellington
          </h3>
          <ul className="space-y-3 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Paddock leveling and drainage</strong> — Raising low
                spots that flood during summer rains, improving turnout
                conditions for horses year-round
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Arena base construction</strong> — Building proper
                sub-base layers for riding arenas with correct compaction and
                grading for consistent footing
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Berm construction</strong> — Creating perimeter berms
                for water management and property boundaries, common around
                Wellington show barns
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Driveway and road repair</strong> — Filling potholes and
                regrading access roads damaged by heavy horse trailer traffic
                during WEF season
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Foundation backfill</strong> — Proper fill and
                compaction around new barn construction, wash stalls, and
                outbuildings
              </span>
            </li>
          </ul>

          {/* Why choose us */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Why Wellington Farms Trust My Horse Farm
          </h3>
          <ul className="pl-5 leading-relaxed space-y-2 mb-10">
            <li>
              We deliver on Wellington&apos;s tight schedules — especially during
              pre-season crunch time before WEF
            </li>
            <li>
              Every load is clean, screened fill — no concrete chunks, debris, or
              contaminated material
            </li>
            <li>
              We handle grading and compaction, not just delivery — your project
              gets done right the first time
            </li>
            <li>
              Based in Royal Palm Beach, we&apos;re less than 15 minutes from
              most Wellington properties
            </li>
            <li>
              Licensed, insured, and experienced with Wellington&apos;s
              permitting and grading requirements
            </li>
          </ul>

          {/* FAQs */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How much fill dirt do I need for my Wellington paddock?
              </h4>
              <p>
                It depends on the area and how much you need to raise elevation.
                We do free on-site assessments and calculate exact yardage so
                you don&apos;t overpay. For a typical Wellington paddock leveling
                project, most properties need between 20 and 80 cubic yards.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Do I need a permit for fill dirt delivery in Wellington?
              </h4>
              <p>
                Wellington requires grading permits for earth-moving projects
                that change property elevation or drainage patterns. Minor
                leveling and top-dressing usually don&apos;t need a permit, but
                larger projects may. We help you determine what&apos;s required.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                What&apos;s the best fill material for horse arena construction?
              </h4>
              <p>
                Arena base typically starts with compacted limerock or crushed
                stone for stability, topped with washed sand or specialized
                footing material. The right combination depends on your
                discipline — dressage, jumping, or all-purpose.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How fast can you deliver fill dirt to Wellington?
              </h4>
              <p>
                Most deliveries happen within 48 hours of confirmation. During
                peak pre-season months (September through November), we
                recommend booking early to guarantee your spot. Emergency
                deliveries are available when conditions require it.
              </p>
            </div>
          </div>

          {/* Cross-links */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Serving Wellington and Nearby Communities
          </h3>
          <p className="mb-6">
            We deliver fill dirt throughout Palm Beach County. We also serve{" "}
            <Link
              href="/fill-dirt/royal-palm-beach"
              className="text-primary-dark hover:text-primary underline"
            >
              Royal Palm Beach
            </Link>
            ,{" "}
            <Link
              href="/fill-dirt/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              Loxahatchee
            </Link>
            , Loxahatchee Groves, and Palm Beach Gardens. Looking for other
            services?{" "}
            <Link
              href="/repairs/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              Farm repairs
            </Link>
            ,{" "}
            <Link
              href="/season-ready/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              season-ready packages
            </Link>
            , and{" "}
            <Link
              href="/manure-removal/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              manure removal
            </Link>{" "}
            are also available for Wellington properties.
          </p>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get Fill Dirt Delivered to Your Wellington Property
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Call us at{" "}
              <a href="tel:+15615767667" className="text-primary-dark font-semibold">
                (561) 576&#8209;7667
              </a>{" "}
              or request a free quote online. We&apos;ll assess your property
              and recommend the right materials and quantities.
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
            name: "Wellington",
          },
          description:
            "Fill dirt delivery and grading services in Wellington, FL. Clean fill, top soil, sand, limerock for paddock leveling, arena base construction, berms, and drainage improvements.",
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
              name: "Wellington",
              item: "https://www.myhorsefarm.com/fill-dirt/wellington",
            },
          ],
        }}
      />
    </>
  );
}
