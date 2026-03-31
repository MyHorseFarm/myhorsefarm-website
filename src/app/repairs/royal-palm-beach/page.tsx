import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Horse Farm Repairs in Royal Palm Beach, FL",
  description:
    "Farm repair services in Royal Palm Beach FL. Fence repair, stall fixes, gate maintenance, driveway patching, pressure washing. Same-day response from our local team. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/repairs/royal-palm-beach",
  },
  openGraph: {
    title: "Horse Farm Repairs in Royal Palm Beach, FL",
    description:
      "Farm repair services in Royal Palm Beach FL. Fence repair, stall fixes, gate maintenance, driveway patching, pressure washing. Same-day response from our local team.",
    type: "website",
    url: "https://www.myhorsefarm.com/repairs/royal-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Horse Farm Repairs in Royal Palm Beach, FL",
    description:
      "Farm repair services in Royal Palm Beach FL. Fence repair, stall fixes, gate maintenance, driveway patching, pressure washing.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function RepairsRoyalPalmBeachPage() {
  return (
    <>
      <Hero
        short
        title="Farm Repairs in Royal Palm Beach"
        tagline="Fast, reliable repairs from your neighborhood farm service team"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=repairs"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Royal Palm Beach Farm Repair Services
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            My Horse Farm is headquartered in Royal Palm Beach, which means when
            something breaks on your property — a fence board snapped by a
            spooked horse, a stall door hanging off its hinges, a gate that
            won&apos;t latch — we can often be there the same day. No waiting
            for crews to drive in from across the county. Our shop, our trucks,
            and our materials are right here in your community.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Royal Palm Beach has a growing number of properties on the western
            edge of town that border Loxahatchee and The Acreage. These
            properties deal with the same issues as larger horse farms — aging
            fences, weather-damaged barns, rutted driveways, and worn-out
            gates — but often don&apos;t know where to find a contractor who
            understands equestrian infrastructure. That&apos;s where we come in.
            We specialize in horse farm repairs, not general contracting.
          </p>

          {/* Repair types */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Repairs We Handle in Royal Palm Beach
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Fence Repair</h4>
              <p>
                Board fence, PVC/vinyl fence, wire fence, and electric fence
                repair and replacement. Horses are tough on fences — we fix
                broken rails, leaning posts, damaged mesh, and failed electric
                lines. We carry standard materials on our trucks so most fence
                repairs are completed in a single visit.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Stall &amp; Barn Repairs</h4>
              <p>
                Kick board replacement, stall door repair, latch and hardware
                fixes, wall patching, and structural reinforcement. Florida&apos;s
                humidity accelerates wood rot and metal corrosion, so regular
                stall maintenance prevents small problems from becoming safety
                hazards.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Gate Maintenance</h4>
              <p>
                Hinge replacement, latch repair, automated gate troubleshooting,
                post reinforcement, and full gate replacement. A gate that
                doesn&apos;t close properly is a liability on any horse
                property — we fix them fast so your horses stay safe.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Driveway &amp; Road Fixes</h4>
              <p>
                Pothole filling, limerock regrading, drainage correction, and
                culvert repair. Royal Palm Beach properties on the western
                edge deal with unpaved roads and driveways that deteriorate
                quickly during the rainy season — we restore them to solid,
                driveable condition.
              </p>
            </div>
          </div>

          {/* Additional services */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Additional Repair Services
          </h3>
          <ul className="space-y-3 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Pressure washing</strong> — Barns, fences, concrete
                pads, and wash stalls cleaned of mold, mildew, algae, and dirt
                buildup from Florida&apos;s humid climate
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Arena maintenance</strong> — Footing leveling, edge
                repair, and drainage fixes to keep your riding surface safe and
                consistent
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Water trough and fixture repair</strong> — Fixing leaky
                automatic waterers, replacing damaged troughs, and repairing
                wash rack plumbing
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Storm damage cleanup</strong> — Emergency response for
                fallen trees on fences, wind-damaged roofing, and debris
                removal after tropical storms
              </span>
            </li>
          </ul>

          {/* Why choose us */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            The Home-Base Advantage
          </h3>
          <ul className="pl-5 leading-relaxed space-y-2 mb-10">
            <li>
              We&apos;re based in Royal Palm Beach — same-day response for
              urgent repairs
            </li>
            <li>
              Trucks stocked with common materials — most repairs completed in
              one visit without waiting for special orders
            </li>
            <li>
              Horse farm specialists, not general handymen — we understand
              equestrian safety requirements
            </li>
            <li>
              Transparent pricing with detailed quotes before work begins — no
              surprise charges
            </li>
            <li>
              Licensed, insured, and serving Royal Palm Beach and surrounding
              communities for over a decade
            </li>
          </ul>

          {/* FAQs */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How fast can you respond to an emergency repair?
              </h4>
              <p>
                For Royal Palm Beach properties, we can often respond the same
                day for urgent situations like broken fences where horses could
                escape. Non-urgent repairs are typically scheduled within 2-3
                business days.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Do you repair PVC and vinyl fencing?
              </h4>
              <p>
                Yes. We repair and replace all fence types common on Palm Beach
                County horse properties — wood board, PVC/vinyl, wire mesh, and
                electric. PVC rail replacement is one of our most common calls.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Can you handle repairs on residential properties too?
              </h4>
              <p>
                We primarily serve equestrian and agricultural properties, but
                if you have a residential property in Royal Palm Beach with
                fencing, driveways, or other infrastructure that falls within
                our expertise, we&apos;re happy to help.
              </p>
            </div>
          </div>

          {/* Cross-links */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Serving Royal Palm Beach and Nearby Areas
          </h3>
          <p className="mb-6">
            We also provide farm repair services in{" "}
            <Link
              href="/repairs/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              Wellington
            </Link>
            ,{" "}
            <Link
              href="/repairs/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              Loxahatchee
            </Link>
            ,{" "}
            <Link
              href="/repairs/west-palm-beach"
              className="text-primary-dark hover:text-primary underline"
            >
              West Palm Beach
            </Link>
            , and Loxahatchee Groves. Need additional services? Check out our{" "}
            <Link
              href="/fill-dirt/royal-palm-beach"
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
              Schedule Farm Repairs in Royal Palm Beach
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Call us at{" "}
              <a href="tel:+15615767667" className="text-primary-dark font-semibold">
                (561) 576&#8209;7667
              </a>{" "}
              or send us photos of what needs fixing. We&apos;ll quote it and
              get it scheduled fast.
            </p>
            <Link
              href="/quote?service=repairs"
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
          serviceType: "Horse Farm Repairs and Maintenance",
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
            "Farm repair services in Royal Palm Beach, FL. Fence repair, stall fixes, gate maintenance, driveway patching, and pressure washing for horse farms and equestrian properties.",
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
              name: "Repairs",
              item: "https://www.myhorsefarm.com/repairs",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Royal Palm Beach",
              item: "https://www.myhorsefarm.com/repairs/royal-palm-beach",
            },
          ],
        }}
      />
    </>
  );
}
