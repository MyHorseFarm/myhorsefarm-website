import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Season-Ready Farm Package in Loxahatchee, FL",
  description:
    "Prepare your Loxahatchee horse farm for season. Bundled services including fence repair, fill dirt and grading, sod, dumpster rental, road repair and full property inspection. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/season-ready/loxahatchee",
  },
  openGraph: {
    title: "Season-Ready Farm Package in Loxahatchee, FL",
    description:
      "Prepare your Loxahatchee horse farm for season. Bundled services including fence repair, fill dirt and grading, sod, dumpster rental, road repair and full property inspection.",
    type: "website",
    url: "https://www.myhorsefarm.com/season-ready/loxahatchee",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Season-Ready Farm Package in Loxahatchee, FL",
    description:
      "Prepare your Loxahatchee horse farm for season. Bundled fence repair, fill dirt, sod, dumpster rental, road repair, and property inspection.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function SeasonReadyLoxahatcheePage() {
  return (
    <>
      <Hero
        short
        title="Season-Ready Package in Loxahatchee"
        tagline="Complete farm preparation for Loxahatchee's large acreage properties"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=season-ready"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Loxahatchee Season-Ready Farm Preparation
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            Loxahatchee horse farms operate on a different scale than the
            show barns in Wellington. Properties here are larger — 5, 10, 20
            acres or more — with miles of fencing, multiple paddocks, long
            private roads, and infrastructure spread across serious acreage.
            Getting a Loxahatchee property ready for season means tackling more
            ground, more fencing, and more grading than a typical Wellington
            barn. My Horse Farm&apos;s Season-Ready package is built to handle
            that scale with one coordinated effort instead of juggling half a
            dozen different contractors.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Whether you board horses that winter in South Florida, run a private
            breeding operation, or lease your property to trainers who need
            everything turnkey, our Season-Ready assessment identifies every
            repair, improvement, and maintenance item your property needs — then
            we execute the entire plan on a guaranteed timeline. For
            Loxahatchee properties, that often means heavy grading work, long
            fence runs, road restoration, and pasture rehabilitation that
            smaller outfits can&apos;t handle efficiently.
          </p>

          {/* What's included */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            What Loxahatchee Season-Ready Covers
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Full Property Walk-Through</h4>
              <p>
                We inspect every paddock, fence line, gate, road, barn, and
                drainage system on your property. On large Loxahatchee
                acreage, this is critical — problems hide in back paddocks and
                along perimeter fence lines that haven&apos;t been checked in
                months.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Fence Line Restoration</h4>
              <p>
                Board fence, wire fence, and electric fence repair across your
                entire property. Loxahatchee properties often have thousands
                of linear feet of fencing that takes a beating from weather,
                fallen branches, and horse wear. We replace damaged sections
                and reinforce weak areas.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Fill Dirt &amp; Road Work</h4>
              <p>
                Large-volume fill dirt delivery and grading for paddock
                leveling, low-spot correction, and road restoration.
                Loxahatchee&apos;s private roads and driveways take a beating
                during the rainy season — we rebuild them with proper limerock
                base and grading for year-round access.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Pasture &amp; Sod Work</h4>
              <p>
                Overseeding thin pastures, sodding bare areas around barns and
                high-traffic zones, and top-dressing compacted ground.
                Loxahatchee&apos;s sandy soil needs proper preparation for
                grass to establish — we handle grading, top soil, and
                installation.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Waste Management Setup</h4>
              <p>
                Dumpster delivery and scheduled manure pickup established before
                horses arrive. For larger Loxahatchee operations with 15 or
                more horses, we size the containers and pickup frequency to
                match your waste volume.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Barn &amp; Stall Repairs</h4>
              <p>
                Kick boards, stall doors, latches, feed room doors, tack room
                shelving, and structural fixes. Florida&apos;s humidity
                accelerates wood rot and metal corrosion — we replace what
                needs replacing and reinforce what can be saved.
              </p>
            </div>
          </div>

          {/* Loxahatchee-specific challenges */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Challenges Unique to Loxahatchee Properties
          </h3>
          <ul className="space-y-3 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Scale</strong> — More acreage means more fence, more
                grading, more pasture work. We have the crews and equipment to
                handle properties that take smaller operators weeks.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Drainage</strong> — Much of Loxahatchee sits low with
                poor natural drainage. Season prep often includes significant
                fill work to raise paddocks and redirect water flow.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Road access</strong> — Private roads on large parcels
                deteriorate over the summer. Heavy trailers can&apos;t get
                through rutted, washed-out roads — we restore them before
                season starts.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Wildlife damage</strong> — Loxahatchee properties near
                the preserve deal with fence damage from wildlife, overgrown
                fence lines, and tree limbs on structures that need clearing.
              </span>
            </li>
          </ul>

          {/* Why choose us */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Why Loxahatchee Farms Bundle With Us
          </h3>
          <ul className="pl-5 leading-relaxed space-y-2 mb-10">
            <li>
              One team handles everything — no coordinating between a fence
              contractor, dirt hauler, sod company, and handyman
            </li>
            <li>
              Built for large acreage — we don&apos;t shy away from 10-acre
              fence runs or 200-yard fill deliveries
            </li>
            <li>
              Bundled pricing saves 15-20% versus hiring each service
              separately
            </li>
            <li>
              Based in Royal Palm Beach, just east of Loxahatchee — minimal
              travel time and costs
            </li>
            <li>
              Familiar with Palm Beach County agricultural zoning, setback
              requirements, and SFWMD drainage rules
            </li>
          </ul>

          {/* FAQs */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How long does a Season-Ready project take on a large
                Loxahatchee property?
              </h4>
              <p>
                Depending on scope, most Loxahatchee Season-Ready projects take
                2-4 weeks from start to finish. We schedule heavy work first
                (grading, road building, fence replacement) and finish with sod,
                pressure washing, and final touches. We build a timeline
                specific to your property during the initial assessment.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Is the Season-Ready package only for WEF-related prep?
              </h4>
              <p>
                No. While many clients use it for pre-season preparation, the
                package works for any time you need comprehensive farm
                maintenance. Some Loxahatchee owners use it for spring cleanup,
                pre-hurricane prep, or before putting a property on the market.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Can you handle properties with 20+ acres?
              </h4>
              <p>
                Yes. Large acreage is our strength. We have the equipment,
                material supply chains, and crew capacity to handle
                Loxahatchee&apos;s biggest properties efficiently. The initial
                assessment lets us scope the project accurately so there are no
                surprises.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Do I need to be on-site during the work?
              </h4>
              <p>
                Not necessarily. We coordinate access with you or your property
                manager, send regular photo updates, and provide a detailed
                completion report. Many Loxahatchee property owners manage
                remotely and trust us to handle the project independently.
              </p>
            </div>
          </div>

          {/* Cross-links */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Serving Loxahatchee and Surrounding Areas
          </h3>
          <p className="mb-6">
            We offer Season-Ready packages across Palm Beach County including{" "}
            <Link
              href="/season-ready/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              Wellington
            </Link>
            , Royal Palm Beach, Loxahatchee Groves, and The Acreage. Need
            individual services?{" "}
            <Link
              href="/repairs/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              Farm repairs
            </Link>
            ,{" "}
            <Link
              href="/fill-dirt/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              fill dirt delivery
            </Link>
            , and{" "}
            <Link
              href="/manure-removal/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              manure removal
            </Link>{" "}
            are available as standalone services for Loxahatchee properties.
          </p>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get Your Loxahatchee Property Season-Ready
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Call us at{" "}
              <a href="tel:+15615767667" className="text-primary-dark font-semibold">
                (561) 576&#8209;7667
              </a>{" "}
              or request a quote online. We&apos;ll schedule a property
              walk-through and build your custom prep plan.
            </p>
            <Link
              href="/quote?service=season-ready"
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
          serviceType: "Season-Ready Farm Preparation",
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
            name: "Loxahatchee",
          },
          description:
            "Season-Ready farm preparation for Loxahatchee, FL. Bundled services including fence repair, fill dirt and grading, sod, dumpster rental, road repair, and full property inspection for large acreage properties.",
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
              name: "Season-Ready",
              item: "https://www.myhorsefarm.com/season-ready",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Loxahatchee",
              item: "https://www.myhorsefarm.com/season-ready/loxahatchee",
            },
          ],
        }}
      />
    </>
  );
}
