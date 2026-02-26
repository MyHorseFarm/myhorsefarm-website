import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Junk Removal West Palm Beach | My Horse Farm",
  description:
    "Affordable junk removal and hauling services in West Palm Beach, Florida. We remove appliances, furniture, yard waste, construction debris and more with transparent pricing starting at $75 per ton.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/junk-removal/west-palm-beach",
  },
  openGraph: {
    title: "Junk Removal West Palm Beach | My Horse Farm",
    description:
      "Affordable junk removal and hauling in West Palm Beach, FL. Transparent pricing starting at $75 per ton.",
    type: "website",
    url: "https://www.myhorsefarm.com/junk-removal/west-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Junk Removal West Palm Beach | My Horse Farm",
    description:
      "Affordable junk removal and hauling in West Palm Beach, FL. Starting at $75 per ton.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function JunkRemovalWestPalmBeachPage() {
  return (
    <>
      <Hero
        title="Junk Removal West Palm Beach"
        tagline="Fast & affordable junk removal from $75/ton"
        ctaText="Get a Quote"
        ctaHref="/#contact"
      />
      <Navbar links={NAV_LINKS_SERVICE} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Comprehensive Junk Removal &amp; Hauling in West Palm Beach
          </h2>
          <p>
            Is clutter taking over your property? Our West Palm Beach junk
            removal service handles everything from household items and
            appliances to yard debris and construction waste. With our dump
            trailer and heavy-duty trucks, we&apos;ll haul it all away quickly
            and responsibly.
          </p>

          <h3 className="text-primary-dark">
            Why Choose Our West Palm Beach Junk Removal?
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>Transparent pricing starting at $75 per ton</li>
            <li>Quick scheduling and same-day service available</li>
            <li>Licensed, insured and locally owned</li>
            <li>
              Eco-friendly disposal and recycling whenever possible
            </li>
            <li>Friendly team committed to 5-star service</li>
          </ul>

          <p>
            We help homeowners, equestrian farms and businesses in West Palm
            Beach clear out furniture, appliances, electronics, yard waste,
            construction debris and more. If it can fit in our dump trailer,
            we&apos;ll haul it!
          </p>

          <h3 className="text-primary-dark">Service Area</h3>
          <p>
            We provide junk removal throughout West Palm Beach and nearby
            communities including Royal Palm Beach, Wellington, Loxahatchee and
            Loxahatchee Groves. Contact us if you&apos;re nearby—we may be able
            to accommodate your location.
          </p>

          <h3 className="text-primary-dark">Get Started</h3>
          <p>
            Ready to reclaim your space? Click below to schedule a consultation
            or request a custom quote. We&apos;re happy to discuss the best junk
            removal and hauling options for your project.
          </p>
          <p>
            <a
              href="/#calendar"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
            >
              Book Junk Removal
            </a>
          </p>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Junk Removal",
          provider: {
            "@type": "LocalBusiness",
            "@id": "https://www.myhorsefarm.com/#organization",
            name: "My Horse Farm",
            image: "https://www.myhorsefarm.com/logo.png",
            telephone: "(561) 576-7667",
            email: "sales@myhorsefarm.com",
            priceRange: "$$",
            areaServed: [
              "West Palm Beach FL",
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
            "Affordable junk removal and hauling services in West Palm Beach. We remove furniture, appliances, yard debris and construction waste starting at just $75 per ton.",
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
              name: "Junk Removal",
              item: "https://www.myhorsefarm.com/junk-removal",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "West Palm Beach",
              item: "https://www.myhorsefarm.com/junk-removal/west-palm-beach",
            },
          ],
        }}
      />
    </>
  );
}
