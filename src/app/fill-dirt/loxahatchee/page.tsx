import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Fill Dirt Delivery in Loxahatchee, FL",
  description:
    "Fill dirt delivery for Loxahatchee acreage and horse farms. Clean fill, top soil, sand, limerock for large-scale grading, paddock construction, road building and agricultural projects. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/fill-dirt/loxahatchee",
  },
  openGraph: {
    title: "Fill Dirt Delivery in Loxahatchee, FL",
    description:
      "Fill dirt delivery for Loxahatchee acreage and horse farms. Clean fill, top soil, sand, limerock for large-scale grading, paddock construction, and road building.",
    type: "website",
    url: "https://www.myhorsefarm.com/fill-dirt/loxahatchee",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Fill Dirt Delivery in Loxahatchee, FL",
    description:
      "Fill dirt delivery for Loxahatchee acreage and horse farms. Clean fill, top soil, sand, limerock for large-scale grading and paddock construction.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function FillDirtLoxahatcheePage() {
  return (
    <>
      <Hero
        short
        title="Fill Dirt Delivery in Loxahatchee"
        tagline="Large-volume fill dirt for Loxahatchee acreage and horse farms"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=fill-dirt"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Loxahatchee Fill Dirt and Grading Services
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            Loxahatchee and the surrounding Acreage community represent some of
            Palm Beach County&apos;s largest rural properties — 5, 10, even
            20-acre parcels with horse barns, cattle operations, and
            agricultural zoning that allows for substantial earth-moving
            projects. The challenge is that much of this land sits low, with
            poor natural drainage and sandy soil that shifts during heavy rains.
            My Horse Farm delivers high-volume fill dirt, top soil, sand, and
            base materials to Loxahatchee properties to solve these problems at
            scale.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Whether you&apos;re building new paddocks on a recently cleared
            parcel along Collecting Canal Road, raising elevation on a
            flood-prone property near Seminole Pratt Whitney Road, or
            constructing access roads for a multi-barn facility on F Road, we
            have the equipment and material supply to handle projects that
            smaller operators can&apos;t. Loxahatchee&apos;s agricultural
            zoning gives property owners more flexibility, and we take advantage
            of that to get your project done efficiently.
          </p>

          {/* Fill types */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Fill Materials for Loxahatchee Properties
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Clean Fill Dirt</h4>
              <p>
                Bulk screened fill for large-scale elevation projects. Many
                Loxahatchee parcels need significant fill to raise paddocks,
                building pads, and turnout areas above the wet-season water
                table. We deliver in quantities from 20 to several hundred
                cubic yards.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Top Soil</h4>
              <p>
                Fertile top soil for establishing pastures, improving existing
                grazing land, and prepping for sod installation. Loxahatchee&apos;s
                sandy native soil often needs amendment before grass will take
                hold and thrive long-term.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Sand</h4>
              <p>
                Washed sand for arena footing, French drain systems, and
                construction fill. Loxahatchee riders building private arenas
                need the right sand grade for safe, consistent footing that
                drains properly after afternoon storms.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">Limerock &amp; Shell Rock</h4>
              <p>
                Heavy-duty base material for private roads, barn access lanes,
                equipment pads, and trailer parking areas. On large Loxahatchee
                properties, limerock roads are essential for year-round access
                without getting stuck in mud.
              </p>
            </div>
          </div>

          {/* Common projects */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Common Loxahatchee Fill Dirt Projects
          </h3>
          <ul className="space-y-3 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>New property development</strong> — Clearing, grading,
                and filling newly purchased acreage to create usable horse
                paddocks, riding areas, and building pads from raw land
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Flood remediation</strong> — Raising low-lying areas
                that turn into lakes after heavy rains, a constant challenge on
                Loxahatchee properties near canals and swales
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Private road construction</strong> — Building limerock
                access roads across large properties so trucks, trailers, and
                equipment can reach barns year-round
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Pasture restoration</strong> — Top soil application and
                grading to revive compacted, worn-out grazing land and improve
                forage growth
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">&#10003;</span>
              <span>
                <strong>Arena and round pen construction</strong> — Full
                sub-base and footing installation for private riding arenas on
                large acreage properties
              </span>
            </li>
          </ul>

          {/* Why choose us */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Why Loxahatchee Property Owners Choose Us
          </h3>
          <ul className="pl-5 leading-relaxed space-y-2 mb-10">
            <li>
              We handle large-volume projects — 100+ cubic yard deliveries are
              routine for our operation
            </li>
            <li>
              Equipment for spreading and compacting on-site, not just dumping
              at the gate
            </li>
            <li>
              Experience with Loxahatchee&apos;s unique terrain — sandy soil,
              high water tables, and canal-adjacent properties
            </li>
            <li>
              Based in Royal Palm Beach, just east of Loxahatchee — short haul
              distances keep your costs down
            </li>
            <li>
              Familiar with Palm Beach County agricultural zoning requirements
              and land-clearing regulations
            </li>
          </ul>

          {/* FAQs */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Can you deliver large quantities to remote Loxahatchee
                properties?
              </h4>
              <p>
                Yes. We regularly deliver to properties deep into the Acreage
                area, along Collecting Canal Road, F Road, and all the lettered
                roads. As long as trucks can access your property, we can
                deliver. For properties with narrow or unpaved entrances, we
                work with you to stage materials effectively.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How do I know what type of fill material I need?
              </h4>
              <p>
                We do free on-site consultations. After walking your property
                and understanding your goals, we recommend the right material
                and quantity. Different projects need different materials — a
                paddock might need clean fill topped with sand, while a driveway
                needs compacted limerock.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                Do you handle the grading or just delivery?
              </h4>
              <p>
                We do both. Delivery-only is available if you have your own
                equipment, but most Loxahatchee clients want us to spread,
                grade, and compact the material. Proper compaction is critical
                for long-term stability, especially on large acreage projects.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">
                How much fill dirt does a typical 5-acre Loxahatchee property
                need?
              </h4>
              <p>
                It varies widely depending on current elevation and goals. A
                basic leveling project might need 50-100 cubic yards. Raising
                elevation significantly across multiple paddocks can require
                300+ cubic yards. We measure and calculate exactly what you need
                before quoting.
              </p>
            </div>
          </div>

          {/* Cross-links */}
          <h3 className="text-2xl font-semibold text-primary-dark mt-12 mb-4">
            Serving Loxahatchee and Surrounding Areas
          </h3>
          <p className="mb-6">
            We deliver fill dirt across western Palm Beach County including{" "}
            <Link
              href="/fill-dirt/wellington"
              className="text-primary-dark hover:text-primary underline"
            >
              Wellington
            </Link>
            ,{" "}
            <Link
              href="/fill-dirt/royal-palm-beach"
              className="text-primary-dark hover:text-primary underline"
            >
              Royal Palm Beach
            </Link>
            , Loxahatchee Groves, and The Acreage. Need more than fill dirt?
            We also offer{" "}
            <Link
              href="/repairs/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              farm repairs
            </Link>
            ,{" "}
            <Link
              href="/season-ready/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              season-ready packages
            </Link>
            , and{" "}
            <Link
              href="/manure-removal/loxahatchee"
              className="text-primary-dark hover:text-primary underline"
            >
              manure removal
            </Link>{" "}
            for Loxahatchee horse farms.
          </p>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get Fill Dirt Delivered to Your Loxahatchee Property
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Call us at{" "}
              <a href="tel:+15615767667" className="text-primary-dark font-semibold">
                (561) 576&#8209;7667
              </a>{" "}
              or request a free quote. We&apos;ll visit your property, measure
              what&apos;s needed, and give you an honest price.
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
            name: "Loxahatchee",
          },
          description:
            "Fill dirt delivery for Loxahatchee acreage and horse farms. Clean fill, top soil, sand, limerock for large-scale grading, paddock construction, road building, and agricultural projects.",
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
              name: "Loxahatchee",
              item: "https://www.myhorsefarm.com/fill-dirt/loxahatchee",
            },
          ],
        }}
      />
    </>
  );
}
