import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Horse Manure Removal Services | My Horse Farm",
  description:
    "Reliable horse manure removal services in Royal Palm Beach, Wellington & Loxahatchee, Florida. Keep your barn clean and odor\u2011free with My Horse Farm\u2019s eco\u2011friendly manure removal and waste management solutions.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/manure-removal" },
  openGraph: {
    title: "Horse Manure Removal Services | My Horse Farm",
    description:
      "Reliable horse manure removal services in Royal Palm Beach, Wellington & Loxahatchee. Eco-friendly manure removal and waste management solutions.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Horse Manure Removal Services | My Horse Farm",
    description:
      "Reliable horse manure removal services in Royal Palm Beach, Wellington & Loxahatchee. Eco-friendly manure removal and waste management.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function ManureRemovalPage() {
  return (
    <>
      <Hero
        title="Manure Removal Services"
        tagline="Clean stalls, happy horses – let us handle the mess"
        ctaText="Get a Quote"
        ctaHref="/#contact"
      />
      <Navbar links={NAV_LINKS_SERVICE} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Horse Manure Removal in Palm Beach County
          </h2>
          <p>
            Keeping your barn clean doesn&apos;t have to be a chore. At My Horse
            Farm, we provide professional manure removal services to equestrian
            facilities and private barns throughout Royal Palm Beach, Wellington,
            Loxahatchee and nearby communities. Our goal is to keep your stalls
            fresh, minimize odor and flies, and maintain compliance with local
            waste ordinances.
          </p>

          <h3 className="text-primary-dark">Why Choose Our Service?</h3>
          <ul className="pl-5 leading-relaxed">
            <li>Eco&#8209;friendly disposal at approved facilities</li>
            <li>
              Leak&#8209;proof dumpsters and bins that keep waste contained
            </li>
            <li>
              Licensed, insured and fully compliant with Village regulations
            </li>
            <li>
              Fast pickup and flexible scheduling to suit your routine
            </li>
            <li>Friendly drivers and competitive pricing</li>
          </ul>

          <p>
            We understand the regulations that apply to horse manure storage and
            disposal in Wellington and Palm Beach County. Our team handles
            everything from delivery and placement of dumpsters to regular
            pickups, so you can spend more time riding and less time worrying
            about waste.
          </p>

          <h3 className="text-primary-dark">Service Area</h3>
          <p>
            We proudly serve barns and equestrian properties in Royal Palm Beach,{" "}
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
            , Loxahatchee Groves,{" "}
            <a
              href="/manure-removal/west-palm-beach"
              className="text-primary-dark hover:text-primary"
            >
              West Palm Beach
            </a>{" "}
            and the surrounding areas. Whether you manage a small private barn or
            a large training facility, we have a solution to suit your needs.
          </p>

          <h3 className="text-primary-dark">Get Started</h3>
          <p>
            Ready to book manure removal? Click the button below to schedule a
            30&#8209;minute appointment or request a custom quote. Our friendly
            team will reach out to confirm your pickup schedule and answer any
            questions you may have.
          </p>
          <p>
            <a
              href="/#calendar"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
            >
              Book Manure Removal
            </a>
          </p>
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
            "Professional horse manure removal services for equestrian facilities in Palm Beach County. We provide leak-proof dumpsters, flexible scheduling, and eco-friendly disposal.",
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
          ],
        }}
      />
    </>
  );
}
