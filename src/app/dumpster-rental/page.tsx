import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dumpster Rental Services | My Horse Farm",
  description:
    "Reliable dumpster rental services for equestrian farms and rural properties in Royal Palm Beach, Wellington & Loxahatchee, Florida. Our 20\u2011yard dumpsters and bins help you manage farm cleanups, renovations and projects with ease.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/dumpster-rental" },
  openGraph: {
    title: "Dumpster Rental Services | My Horse Farm",
    description:
      "Reliable dumpster rental for equestrian farms and rural properties in Royal Palm Beach, Wellington & Loxahatchee, FL.",
    type: "website",
    url: "https://www.myhorsefarm.com/dumpster-rental",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Dumpster Rental Services | My Horse Farm",
    description:
      "Reliable dumpster rental for equestrian farms and rural properties in Royal Palm Beach, Wellington & Loxahatchee, FL.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function DumpsterRentalPage() {
  return (
    <>
      <Hero
        title="Dumpster Rental Services"
        tagline="Keep your farm tidy with our 20&#8209;yard dumpsters"
        ctaText="Get a Quote"
        ctaHref="/#contact"
      />
      <Navbar links={NAV_LINKS_SERVICE} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Dumpster Rental for Equestrian &amp; Farm Projects
          </h2>
          <p>
            Whether you&apos;re cleaning out your barn, starting a construction
            project or preparing for the busy season, our heavy&#8209;duty
            dumpsters make waste removal easy. We deliver and pick up our
            20&#8209;yard containers across Royal Palm Beach, Wellington,
            Loxahatchee and nearby communities.
          </p>

          <h3 className="text-primary-dark">Why Rent Our Dumpsters?</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Leak&#8209;proof and sturdy containers designed for agricultural
              waste
            </li>
            <li>Flexible rental periods and fast delivery/pickup</li>
            <li>
              Licensed and insured team that handles drop&#8209;off and removal
            </li>
            <li>Eco&#8209;friendly waste disposal at approved facilities</li>
            <li>Competitive rates and friendly local service</li>
          </ul>

          <p>
            Our dumpsters are perfect for manure cleanouts, renovation debris,
            landscaping projects and general farm cleanups. Let us help you keep
            your property organized and compliant with local regulations.
          </p>

          <h3 className="text-primary-dark">Service Area</h3>
          <p>
            We serve equestrian and agricultural properties in Royal Palm Beach,
            Wellington, Loxahatchee and Loxahatchee Groves. Call us if you&apos;re
            nearby—we may be able to deliver to your location.
          </p>

          <h3 className="text-primary-dark">Get Started</h3>
          <p>
            Ready to book a dumpster? Click below to schedule a 30&#8209;minute
            consultation or request a custom quote. We&apos;re happy to discuss
            the best rental options for your project.
          </p>
          <p>
            <a
              href="/#calendar"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
            >
              Book Dumpster Rental
            </a>
          </p>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Dumpster Rental",
          provider: {
            "@type": "LocalBusiness",
            "@id": "https://www.myhorsefarm.com/#organization",
            name: "My Horse Farm",
            image: "https://www.myhorsefarm.com/logo.png",
            telephone: "(561) 576-7667",
            email: "sales@myhorsefarm.com",
            priceRange: "$$",
            areaServed: [
              "Royal Palm Beach FL",
              "Wellington FL",
              "Loxahatchee FL",
            ],
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
          description:
            "20\u2011yard dumpster rentals for equestrian and farm projects. Leak\u2011proof containers, flexible terms and eco-friendly disposal in Palm Beach County.",
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
              name: "Dumpster Rental",
              item: "https://www.myhorsefarm.com/dumpster-rental",
            },
          ],
        }}
      />
    </>
  );
}
