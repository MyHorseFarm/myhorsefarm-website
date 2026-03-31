import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Manure Removal in Wellington, FL",
  description:
    "Professional horse manure removal in Wellington, FL. Scheduled pickups, leak-proof bins and eco-friendly disposal for barns, training facilities and equestrian properties. Starting service today.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/manure-removal/wellington",
  },
  openGraph: {
    title: "Manure Removal in Wellington, FL",
    description:
      "Professional horse manure removal in Wellington. Scheduled pickups, leak-proof bins and eco-friendly disposal for equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal/wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Manure Removal in Wellington, FL",
    description:
      "Professional horse manure removal in Wellington. Scheduled pickups, leak-proof bins and eco-friendly disposal.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function ManureRemovalWellingtonPage() {
  return (
    <>
      <Hero
        title="Manure Removal in Wellington"
        tagline="Reliable manure pickup for Wellington's equestrian community"
        ctaText="Book Now"
        ctaHref="/#calendar"
      />
      <main>
        <section className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Wellington Horse Manure Removal Services
          </h2>
          <p>
            Wellington is the heart of South Florida&apos;s equestrian world —
            home to the Winter Equestrian Festival, polo fields and hundreds of
            private barns. With that many horses comes serious waste. My Horse
            Farm provides scheduled manure removal for Wellington barns, training
            centers and boarding facilities so your property stays clean,
            compliant and odor-free.
          </p>

          <h3 className="text-primary-dark">Why Wellington Barns Choose Us</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              We understand Wellington&apos;s{" "}
              <strong>Village waste ordinances</strong> and keep you compliant
            </li>
            <li>
              Leak-proof bins and dumpsters sized for operations from 5 stalls to
              60+
            </li>
            <li>
              Flexible pickup schedules — weekly, bi-weekly or custom to your
              barn&apos;s needs
            </li>
            <li>
              Eco-friendly disposal at approved composting and waste facilities
            </li>
            <li>
              Licensed, insured and trusted by Wellington barn owners for over a
              decade
            </li>
          </ul>

          <p>
            Whether you run a small private barn off Pierson Road or a large
            training facility near the show grounds, we deliver the right
            container, set a schedule and handle everything. You focus on the
            horses — we handle the waste.
          </p>

          <h3 className="text-primary-dark">How It Works</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              <strong>Step 1:</strong> Call or book online — we&apos;ll assess
              your barn size and waste volume
            </li>
            <li>
              <strong>Step 2:</strong> We deliver a leak-proof bin or dumpster to
              your property
            </li>
            <li>
              <strong>Step 3:</strong> Scheduled pickups keep your property clean
              — no calls needed
            </li>
            <li>
              <strong>Step 4:</strong> We dispose of waste at approved,
              eco-friendly facilities
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Serving Wellington and Nearby Communities
          </h3>
          <p>
            Based in Royal Palm Beach, we&apos;re just minutes from Wellington.
            We also serve{" "}
            <Link
              href="/manure-removal/loxahatchee"
              className="text-primary-dark hover:text-primary"
            >
              Loxahatchee
            </Link>
            ,{" "}
            <Link
              href="/manure-removal/west-palm-beach"
              className="text-primary-dark hover:text-primary"
            >
              West Palm Beach
            </Link>
            , Loxahatchee Groves and Palm Beach Gardens.
          </p>
        </section>

        <section
          id="contact"
          className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Book Manure Removal in Wellington
          </h2>
          <p>
            Ready to get started? Call us at{" "}
            <a href="tel:+15615767667" className="text-primary-dark">
              (561) 576&#8209;7667
            </a>{" "}
            or book online. We&apos;ll confirm your schedule and answer any
            questions.
          </p>
          <Link
            href="/#calendar"
            className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
          >
            Schedule Pickup
          </Link>
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
            name: "Wellington",
          },
          description:
            "Professional horse manure removal services in Wellington, FL. Scheduled pickups, leak-proof bins and eco-friendly disposal for equestrian facilities.",
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
              name: "Wellington",
              item: "https://www.myhorsefarm.com/manure-removal/wellington",
            },
          ],
        }}
      />
    </>
  );
}
