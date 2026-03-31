import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Farm & Property Repairs in West Palm Beach, FL",
  description:
    "Professional farm and property repairs in West Palm Beach FL. Fence repair, barn fixes, pressure washing, gate repair, driveway patching for equestrian and hobby farms. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/repairs/west-palm-beach",
  },
  openGraph: {
    title: "Farm & Property Repairs in West Palm Beach, FL",
    description:
      "Professional farm and property repairs in West Palm Beach FL. Fence repair, barn fixes, pressure washing, gate repair, driveway patching for equestrian and hobby farms. Call (561) 576-7667.",
    type: "website",
    url: "https://www.myhorsefarm.com/repairs/west-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Farm & Property Repairs in West Palm Beach, FL",
    description:
      "Professional farm and property repairs in West Palm Beach FL. Fence repair, barn fixes, pressure washing, gate repair, driveway patching for equestrian and hobby farms.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function RepairsWestPalmBeachPage() {
  return (
    <>
      <Hero
        title="Farm Repairs in West Palm Beach"
        tagline="Property repairs for West Palm Beach farms and equestrian properties"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=repairs"
      />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            West Palm Beach Farm & Property Repair Services
          </h2>
          <p>
            West Palm Beach and its western communities — stretching toward the
            Acreage and along the Southern Blvd corridor — are home to a growing
            mix of hobby farms, small equestrian properties and rural
            residential lots. Fences take a beating from weather and livestock,
            barns need upkeep, driveways wash out and gates stop working. My
            Horse Farm handles all of it. We keep West Palm Beach properties in
            working shape so owners can focus on their animals, their land and
            their families instead of chasing down repairs.
          </p>

          <h3 className="text-primary-dark">
            Repairs We Handle in West Palm Beach
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Fence repair and replacement for paddocks, pastures and property
              lines
            </li>
            <li>
              Barn and outbuilding repairs — doors, walls, roofing, structural
              fixes
            </li>
            <li>
              Pressure washing — barns, fences, driveways, patios, pool decks
            </li>
            <li>
              Gate repair — manual and automatic gate systems, security gates
            </li>
            <li>
              Driveway repair — gravel, asphalt patching, limerock, grading
            </li>
            <li>
              General property maintenance — anything that needs fixing on your
              farm
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Why West Palm Beach Property Owners Call Us
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Local crew based in nearby Royal Palm Beach — quick response times
            </li>
            <li>We handle farm AND residential property repairs</li>
            <li>Licensed and insured for Palm Beach County work</li>
            <li>Fair pricing with no surprise charges</li>
            <li>
              One contractor for everything — no need to juggle multiple vendors
            </li>
            <li>
              Storm damage specialists — we respond quickly after hurricanes and
              severe weather
            </li>
          </ul>

          <h3 className="text-primary-dark">How It Works</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              <strong>Step 1:</strong> Call or request a quote online — tell us
              what needs fixing
            </li>
            <li>
              <strong>Step 2:</strong> We visit your property and give you a
              clear, honest estimate
            </li>
            <li>
              <strong>Step 3:</strong> Our crew completes the work on schedule —
              no dragging it out
            </li>
            <li>
              <strong>Step 4:</strong> Final walkthrough with you to make sure
              everything looks right
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Serving West Palm Beach and Surrounding Areas
          </h3>
          <p>
            Based in Royal Palm Beach, we serve all of West Palm Beach and
            surrounding areas including{" "}
            <Link
              href="/repairs/wellington"
              className="text-primary-dark hover:text-primary"
            >
              Wellington
            </Link>
            ,{" "}
            <Link
              href="/repairs/loxahatchee"
              className="text-primary-dark hover:text-primary"
            >
              Loxahatchee
            </Link>
            , Royal Palm Beach, Palm Beach Gardens and Lake Worth.
          </p>
        </section>

        <section
          id="contact"
          className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Schedule Repairs in West Palm Beach
          </h2>
          <p>
            Ready to get your property fixed up? Call us at{" "}
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
          serviceType: "Farm and Property Repairs",
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
            name: "West Palm Beach",
          },
          description:
            "Professional farm and property repair services in West Palm Beach, FL. Fence repair, barn fixes, pressure washing, gate repair and driveway patching for equestrian and hobby farms.",
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
              name: "West Palm Beach",
              item: "https://www.myhorsefarm.com/repairs/west-palm-beach",
            },
          ],
        }}
      />
    </>
  );
}
