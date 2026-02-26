import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_LOCATION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Manure Removal in West Palm Beach, FL | My Horse Farm",
  description:
    "Manure removal and waste hauling in West Palm Beach, FL. My Horse Farm provides scheduled pickups, leak-proof bins and eco-friendly disposal for equestrian properties and hobby farms.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/manure-removal/west-palm-beach",
  },
  openGraph: {
    title: "Manure Removal in West Palm Beach, FL | My Horse Farm",
    description:
      "Manure removal and waste hauling in West Palm Beach. Scheduled pickups, leak-proof bins and eco-friendly disposal for equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal/west-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Manure Removal in West Palm Beach, FL | My Horse Farm",
    description:
      "Manure removal and waste hauling in West Palm Beach. Scheduled pickups and eco-friendly disposal.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function ManureRemovalWestPalmBeachPage() {
  return (
    <>
      <Hero
        title="Manure Removal in West Palm Beach"
        tagline="Clean properties, happy neighbors — we handle the waste"
        ctaText="Book Now"
        ctaHref="/#calendar"
      />
      <Navbar links={NAV_LINKS_LOCATION} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            West Palm Beach Manure Removal Services
          </h2>
          <p>
            Horse properties in and around West Palm Beach need reliable waste
            management to stay clean, compliant and neighbor-friendly. My Horse
            Farm provides professional manure removal for hobby farms, small
            barns and equestrian properties in the West Palm Beach area — with
            the same service quality we bring to Wellington and
            Loxahatchee&apos;s largest facilities.
          </p>

          <h3 className="text-primary-dark">
            Why Choose Us in West Palm Beach
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Scheduled pickups that keep your property clean without you lifting
              a finger
            </li>
            <li>
              Leak-proof containers that prevent spills, runoff and odor
              complaints
            </li>
            <li>
              Bins sized for small hobby farms up to commercial equestrian
              operations
            </li>
            <li>
              Eco-friendly disposal — we work with approved composting facilities
            </li>
            <li>
              Licensed, insured and fully compliant with Palm Beach County
              regulations
            </li>
          </ul>

          <p>
            Even if you only have a few horses, manure builds up fast in
            Florida&apos;s heat. Regular removal prevents fly infestations, odor
            problems and potential code violations. We make it simple — we bring
            the bin, pick it up on schedule and handle all disposal.
          </p>

          <h3 className="text-primary-dark">Also Need Junk Removal?</h3>
          <p>
            Many of our West Palm Beach clients combine manure removal with{" "}
            <a
              href="/junk-removal/west-palm-beach"
              className="text-primary-dark hover:text-primary"
            >
              junk removal services
            </a>
            . Old fencing, broken equipment, barn debris — we haul it all
            starting at $75 per ton.
          </p>

          <h3 className="text-primary-dark">
            Serving West Palm Beach and Surrounding Areas
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
              href="/manure-removal/loxahatchee"
              className="text-primary-dark hover:text-primary"
            >
              Loxahatchee
            </a>
            , Royal Palm Beach, Loxahatchee Groves and Palm Beach Gardens.
          </p>
        </section>

        <section
          id="contact"
          className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Book Manure Removal in West Palm Beach
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
          serviceType: "Horse Manure Removal",
          provider: {
            "@type": "LocalBusiness",
            "@id": "https://www.myhorsefarm.com/#organization",
            name: "My Horse Farm",
            image: "https://www.myhorsefarm.com/logo.png",
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
            "Manure removal and waste hauling services in West Palm Beach, FL. Scheduled pickups, leak-proof bins and eco-friendly disposal for equestrian properties and hobby farms.",
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
              name: "Manure Removal",
              item: "https://www.myhorsefarm.com/manure-removal",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "West Palm Beach",
              item: "https://www.myhorsefarm.com/manure-removal/west-palm-beach",
            },
          ],
        }}
      />
    </>
  );
}
