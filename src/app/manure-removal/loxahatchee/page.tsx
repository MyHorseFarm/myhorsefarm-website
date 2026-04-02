import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Farm & Property Services in Loxahatchee, FL | Waste Removal",
  description:
    "Farm and property services in Loxahatchee and Loxahatchee Groves, FL — waste removal, dumpster rental, junk hauling, and more. We handle 40+ stall facilities, provide leak-proof bins and offer flexible pickup schedules for large equestrian properties.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/manure-removal/loxahatchee",
  },
  openGraph: {
    title: "Farm & Property Services in Loxahatchee, FL | Waste Removal",
    description:
      "Farm and property services in Loxahatchee and Loxahatchee Groves. Waste removal, dumpster rental, junk hauling, and eco-friendly disposal for large equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal/loxahatchee",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Farm & Property Services in Loxahatchee, FL | Waste Removal",
    description:
      "Farm and property services in Loxahatchee and Loxahatchee Groves. Waste removal, dumpster rental, and flexible schedules.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function ManureRemovalLoxahatcheePage() {
  return (
    <>
      <Hero
        title="Farm & Property Services in Loxahatchee"
        tagline="Dependable waste removal and full farm services for Loxahatchee's horse properties"
        ctaText="Book Now"
        ctaHref="/#calendar"
      />
      <main>
        <section className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Loxahatchee Waste Removal &amp; Farm Services
          </h2>
          <p>
            Loxahatchee and Loxahatchee Groves are home to some of Palm Beach
            County&apos;s largest equestrian properties — sprawling farms with
            dozens of stalls generating serious volumes of waste. My Horse Farm
            specializes in high-volume manure removal for Loxahatchee&apos;s
            boarding facilities, breeding farms and private barns.
          </p>

          <h3 className="text-primary-dark">
            Built for Large Loxahatchee Properties
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              We handle facilities with <strong>40+ stalls</strong> and
              60-yard loads without issues
            </li>
            <li>
              Weight tickets provided on every haul for your records
            </li>
            <li>
              Leak-proof bins and heavy-duty dumpsters that contain waste and
              odor
            </li>
            <li>
              Flexible scheduling — weekly, bi-weekly or on-demand pickups
            </li>
            <li>
              Eco-friendly disposal at approved composting and waste facilities
            </li>
          </ul>

          <p>
            Loxahatchee properties tend to be larger and more remote than those
            closer to town. We know the area, we know the roads and we show up
            on time. Whether your farm is off Okeechobee Boulevard, Seminole
            Pratt Whitney or deep in the Groves, we&apos;ll get there.
          </p>

          <h3 className="text-primary-dark">
            Emergency Cleanups Before Inspections
          </h3>
          <p>
            Need an emergency manure haul before an inspection or event?
            We&apos;ve helped Loxahatchee farms with last-minute cleanups for
            years. Call us at{" "}
            <a href="tel:+15615767667" className="text-primary-dark">
              (561) 576-7667
            </a>{" "}
            and we&apos;ll work you in as fast as possible.
          </p>

          <h3 className="text-primary-dark">
            Serving Loxahatchee and Surrounding Areas
          </h3>
          <p>
            We also serve{" "}
            <a
              href="/manure-removal/wellington"
              className="text-primary-dark hover:text-primary"
            >
              Wellington
            </a>
            ,{" "}
            <a
              href="/manure-removal/west-palm-beach"
              className="text-primary-dark hover:text-primary"
            >
              West Palm Beach
            </a>
            , Royal Palm Beach, Loxahatchee Groves and Palm Beach Gardens.
          </p>
        </section>

        <section
          id="contact"
          className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Book Farm Services in Loxahatchee
          </h2>
          <p>
            Ready to get started? Call us at{" "}
            <a href="tel:+15615767667" className="text-primary-dark">
              (561) 576&#8209;7667
            </a>{" "}
            or book online. We&apos;ll confirm your schedule and answer any
            questions.
          </p>
          <a
            href="/#calendar"
            className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
          >
            Schedule Pickup
          </a>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Farm & Property Services",
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
            { "@type": "City", name: "Loxahatchee" },
            { "@type": "City", name: "Loxahatchee Groves" },
          ],
          description:
            "Farm and property services in Loxahatchee and Loxahatchee Groves, FL. Waste removal, dumpster rental, junk hauling, and eco-friendly disposal for large equestrian properties.",
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
              name: "Waste Removal",
              item: "https://www.myhorsefarm.com/manure-removal",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Loxahatchee",
              item: "https://www.myhorsefarm.com/manure-removal/loxahatchee",
            },
          ],
        }}
      />
    </>
  );
}
