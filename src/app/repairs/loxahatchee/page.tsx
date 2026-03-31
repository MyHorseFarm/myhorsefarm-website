import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Farm Repairs & Maintenance in Loxahatchee, FL",
  description:
    "Professional farm repairs in Loxahatchee & Loxahatchee Groves FL. Fence repair, barn fixes, paddock maintenance, gate repair, driveway grading for large equestrian properties. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/repairs/loxahatchee",
  },
  openGraph: {
    title: "Farm Repairs & Maintenance in Loxahatchee, FL",
    description:
      "Professional farm repairs in Loxahatchee & Loxahatchee Groves FL. Fence repair, barn fixes, paddock maintenance, gate repair, driveway grading for large equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/repairs/loxahatchee",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Farm Repairs & Maintenance in Loxahatchee, FL",
    description:
      "Professional farm repairs in Loxahatchee & Loxahatchee Groves FL. Fence repair, barn fixes, paddock maintenance, gate repair, driveway grading.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function RepairsLoxahatcheePage() {
  return (
    <>
      <Hero
        title="Farm Repairs in Loxahatchee"
        tagline="Repairs and maintenance for Loxahatchee's large equestrian properties"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=repairs"
      />
      <main>
        <section className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Loxahatchee Farm Repair Services
          </h2>
          <p>
            Loxahatchee and Loxahatchee Groves are home to some of Palm Beach
            County&apos;s largest equestrian properties — sprawling 5 to 20+
            acre farms with miles of fence line, multiple paddocks, barns, run-in
            sheds and outbuildings. More acreage means more maintenance. Between
            Florida&apos;s relentless humidity, summer storms, termites and the
            daily wear that horses and livestock put on structures, things break
            down fast. My Horse Farm provides hands-on repair and maintenance
            services built for Loxahatchee&apos;s big rural properties so you
            can keep your farm safe, functional and looking its best.
          </p>

          <h3 className="text-primary-dark">
            Common Repairs for Loxahatchee Properties
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              <strong>Long fence line repairs</strong> — board replacement, post
              repair, wire tightening across acres of paddock fencing
            </li>
            <li>
              <strong>Barn and stall structural repairs</strong> — rot from
              Florida humidity, termite damage, storm damage
            </li>
            <li>
              <strong>Paddock gate repairs</strong> — heavy-use gates need
              regular hinge, latch and frame maintenance
            </li>
            <li>
              <strong>Run-in shed and lean-to repairs</strong> — leveling,
              roofing, mat installation
            </li>
            <li>
              <strong>Driveway and limerock road grading</strong> — essential for
              properties with long driveways
            </li>
            <li>
              <strong>Drainage and grading</strong> — Florida&apos;s flat terrain
              and heavy rains mean water management is critical
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Built for Loxahatchee&apos;s Bigger Properties
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Equipment and crew to handle large-acreage jobs efficiently
            </li>
            <li>
              We stock materials for long fence runs — no delays waiting on
              lumber
            </li>
            <li>
              Experience with all fence types: wood board, pipe, wire, PVC and
              mesh
            </li>
            <li>
              We understand Loxahatchee&apos;s unincorporated Palm Beach County
              codes
            </li>
            <li>
              Familiar with the unique needs of breeding farms, training
              facilities and hobby farms
            </li>
            <li>
              Emergency service for storm damage and urgent safety repairs
            </li>
          </ul>

          <h3 className="text-primary-dark">How It Works</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              <strong>Step 1:</strong> Call or request a quote online — we&apos;ll
              visit your Loxahatchee property and assess what needs fixing
            </li>
            <li>
              <strong>Step 2:</strong> We provide a clear estimate with materials,
              labor and timeline
            </li>
            <li>
              <strong>Step 3:</strong> Our crew arrives with equipment and
              materials — most jobs completed same week
            </li>
            <li>
              <strong>Step 4:</strong> We walk the finished work with you to make
              sure everything meets your standards
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Serving Loxahatchee and Nearby Communities
          </h3>
          <p>
            Based in Royal Palm Beach, we&apos;re right next door to
            Loxahatchee. We also provide farm repair services in{" "}
            <Link
              href="/repairs/wellington"
              className="text-primary-dark hover:text-primary"
            >
              Wellington
            </Link>
            ,{" "}
            <Link
              href="/repairs/west-palm-beach"
              className="text-primary-dark hover:text-primary"
            >
              West Palm Beach
            </Link>
            , Loxahatchee Groves, Royal Palm Beach and Palm Beach Gardens.
          </p>
        </section>

        <section
          id="contact"
          className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Schedule Farm Repairs in Loxahatchee
          </h2>
          <p>
            Ready to get your property back in shape? Call us at{" "}
            <a href="tel:+15615767667" className="text-primary-dark">
              (561) 576&#8209;7667
            </a>{" "}
            or request a free quote online. We&apos;ll get back to you fast.
          </p>
          <Link
            href="/quote?service=repairs"
            className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
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
          serviceType: "Farm Repairs and Maintenance",
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
          areaServed: [
            {
              "@type": "City",
              name: "Loxahatchee",
            },
            {
              "@type": "City",
              name: "Loxahatchee Groves",
            },
          ],
          description:
            "Professional farm repair and maintenance services in Loxahatchee, FL. Fence repair, barn fixes, paddock maintenance, gate repair, driveway grading for large equestrian properties.",
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
              name: "Loxahatchee",
              item: "https://www.myhorsefarm.com/repairs/loxahatchee",
            },
          ],
        }}
      />
    </>
  );
}
