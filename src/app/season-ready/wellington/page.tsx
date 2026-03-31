import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Season-Ready Farm Package in Wellington, FL",
  description:
    "Get your Wellington property ready for WEF season. Bundled farm prep including fence repair, fill dirt, sod, dumpster rental, pressure washing, and full property inspection. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/season-ready/wellington",
  },
  openGraph: {
    title: "Season-Ready Farm Package in Wellington, FL",
    description:
      "Get your Wellington property ready for WEF season. Bundled farm prep including fence repair, fill dirt, sod, dumpster rental, pressure washing, and full property inspection.",
    type: "website",
    url: "https://www.myhorsefarm.com/season-ready/wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Season-Ready Farm Package in Wellington, FL",
    description:
      "Get your Wellington property ready for WEF season. Bundled services — fence repair, fill dirt, sod, dumpster rental, and full property inspection.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function SeasonReadyWellingtonPage() {
  return (
    <>
      <Hero
        short
        title="Season-Ready Package in Wellington"
        tagline="One call gets your Wellington property WEF-ready"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=season-ready"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Wellington Season-Ready Farm Preparation
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            Every year, Wellington transforms into the epicenter of the global
            equestrian world when the Winter Equestrian Festival kicks off.
            Trainers, riders, and horse owners from around the country arrive
            expecting properties in pristine condition — fences tight, footing
            perfect, pastures green, driveways smooth, and waste management
            running on schedule. The months leading up to WEF are a scramble for
            Wellington barn owners to get everything done, often coordinating
            with five or six different contractors. My Horse Farm eliminates that
            headache with a single bundled Season-Ready package that covers
            everything.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            We start with a comprehensive property inspection and build a
            custom prep plan based on what your specific property needs. Instead
            of calling a fence guy, a dirt guy, a sod company, a dumpster
            service, and a pressure washer separately, you make one call and we
            handle the entire project from start to finish — on a timeline that
            guarantees your property is ready before the first horse trailer
            pulls in.
          </p>

          {/* What's included */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            What the Season-Ready Package Includes
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Property Inspection</h4>
              <p>
                We walk every inch of your Wellington property — paddocks,
                arenas, barns, driveways, fences, gates, and drainage. We
                document everything that needs attention and prioritize by
                urgency so critical items get handled first.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Fence &amp; Gate Repair</h4>
              <p>
                Board fence replacement, PVC rail repair, electric fence
                testing, gate hardware fixes, and post reinforcement. After a
                hot Florida summer, most Wellington fences need attention before
                tenants and horses arrive for season.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Fill Dirt &amp; Grading</h4>
              <p>
                Paddock leveling, low-spot correction, driveway regrading, and
                drainage improvements. We bring in clean fill, compact it
                properly, and make sure water flows away from barns and high-use
                areas — not into them.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Sod &amp; Pasture Work</h4>
              <p>
                Dead grass replacement, bare-spot sodding, pasture overseeding,
                and turf establishment so your property looks its best. We use
                varieties proven for South Florida equestrian properties that
                hold up under horse traffic.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Dumpster &amp; Waste Setup</h4>
              <p>
                Manure dumpster delivery, junk removal for accumulated off-season
                debris, and scheduled waste pickup set up before horses arrive.
                Wellington&apos;s waste ordinances require proper disposal — we
                make sure you&apos;re compliant from day one.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Pressure Washing</h4>
              <p>
                Barns, stall fronts, wash racks, concrete pads, and fences
                cleaned of mold, mildew, and algae. Wellington&apos;s humidity
                means nine months of biological growth that needs to come off
                before season.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Recommended Wellington Season-Prep Timeline
          </h3>
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-2xl px-4 py-2 font-bold text-sm whitespace-nowrap">
                Aug-Sep
              </div>
              <p>
                <strong>Book your Season-Ready assessment.</strong> We walk
                your property and build a detailed scope of work with pricing.
                Early booking guarantees priority scheduling.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-2xl px-4 py-2 font-bold text-sm whitespace-nowrap">
                Sep-Oct
              </div>
              <p>
                <strong>Major work begins.</strong> Fill dirt delivery and
                grading, fence replacement, structural barn repairs, and
                driveway restoration. Heavy equipment work gets done while the
                property is still empty.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-2xl px-4 py-2 font-bold text-sm whitespace-nowrap">
                Oct-Nov
              </div>
              <p>
                <strong>Finishing touches.</strong> Sod installation, pressure
                washing, painting, dumpster placement, and final walkthrough.
                Everything polished and ready for the first arrivals.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-2xl px-4 py-2 font-bold text-sm whitespace-nowrap">
                Nov-Dec
              </div>
              <p>
                <strong>Season support.</strong> Ongoing manure pickup,
                emergency repairs, and any last-minute adjustments as tenants
                settle in and horses arrive.
              </p>
            </div>
          </div>

          {/* Why choose us */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Why Wellington Property Owners Bundle With Us
          </h3>
          <ul className="pl-5 leading-relaxed space-y-2 mb-10">
            <li>
              One contractor, one invoice, one point of contact — no
              coordinating between five different vendors
            </li>
            <li>
              We know Wellington&apos;s Village regulations, WEF traffic
              patterns, and what visiting trainers expect
            </li>
            <li>
              Bundled pricing saves 15-20% compared to hiring each service
              separately
            </li>
            <li>
              Guaranteed completion timeline — your property is ready when you
              need it, not when it&apos;s convenient for the contractor
            </li>
            <li>
              Over a decade of pre-season prep experience for Wellington barns
              of all sizes
            </li>
          </ul>

          {/* FAQs */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How far in advance should I book my Season-Ready package?
              </h4>
              <p>
                Ideally by August or early September. Wellington pre-season
                demand is intense, and contractors book up fast. The earlier you
                book, the more flexibility we have to schedule heavy work around
                weather and material availability.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Can I choose only some of the bundled services?
              </h4>
              <p>
                Yes. The Season-Ready package is fully customizable. After the
                property inspection, we recommend what&apos;s needed and you
                decide which services to include. Some properties only need
                fence work and pressure washing. Others need the full treatment.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Do you work with property managers and absentee owners?
              </h4>
              <p>
                Absolutely. Many Wellington properties are owned by people who
                aren&apos;t in Florida during the off-season. We coordinate
                directly with property managers, send photos throughout the
                project, and provide a final walkthrough report.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                What if something unexpected comes up during the project?
              </h4>
              <p>
                We contact you before adding any work outside the original
                scope. If we discover a rotten support beam behind a stall wall
                or a drainage issue hidden under overgrown grass, we document
                it, quote the additional work, and wait for your approval.
              </p>
            </div>
          </div>

          {/* Cross-links */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Serving Wellington and Nearby Communities
          </h3>
          <p className="mb-6">
            We offer Season-Ready packages across Palm Beach County including{" "}
            <Link
              href="/season-ready/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              Loxahatchee
            </Link>
            , Royal Palm Beach, and West Palm Beach. Need individual services?{" "}
            <Link
              href="/repairs/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              Farm repairs
            </Link>
            ,{" "}
            <Link
              href="/fill-dirt/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              fill dirt delivery
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
              href="/manure-removal/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              manure removal
            </Link>{" "}
            are also available as standalone services.
          </p>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get Your Wellington Property Season-Ready
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Call us at{" "}
              <a href="tel:+15615767667" className="text-primary-dark font-semibold">
                (561) 576&#8209;7667
              </a>{" "}
              or request a quote online. We&apos;ll schedule your property
              inspection and build a custom prep plan.
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
            name: "Wellington",
          },
          description:
            "Season-Ready farm preparation for Wellington, FL. Bundled pre-WEF services including fence repair, fill dirt, sod, dumpster rental, pressure washing, and full property inspection.",
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
              name: "Wellington",
              item: "https://www.myhorsefarm.com/season-ready/wellington",
            },
          ],
        }}
      />
    </>
  );
}
