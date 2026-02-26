import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_LOCATION } from "@/lib/constants";

const NAV_LINKS_JUNK_LOCATION = [
  ...NAV_LINKS_LOCATION,
  { label: "Junk Removal West Palm Beach", href: "/junk-removal/west-palm-beach" },
  { label: "Junk Removal Wellington", href: "/junk-removal/wellington" },
  { label: "Junk Removal Loxahatchee", href: "/junk-removal/loxahatchee" },
];

export const metadata: Metadata = {
  title: "Junk Removal in Wellington – Same-Day Service | My Horse Farm",
  description:
    "Need junk removed in Wellington? My Horse Farm offers same-day junk removal starting at $75 per ton in Wellington and the surrounding Palm Beach County area. Book now!",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/junk-removal/wellington",
  },
  openGraph: {
    title: "Junk Removal in Wellington – Same-Day Service | My Horse Farm",
    description:
      "Same-day junk removal starting at $75 per ton in Wellington and surrounding Palm Beach County. Book now!",
    type: "website",
    url: "https://www.myhorsefarm.com/junk-removal/wellington",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Junk Removal in Wellington – Same-Day Service | My Horse Farm",
    description:
      "Same-day junk removal starting at $75 per ton in Wellington and surrounding Palm Beach County.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function JunkRemovalWellingtonPage() {
  return (
    <>
      <Hero
        title="Junk Removal in Wellington"
        tagline="Affordable & same&#8209;day junk removal across Palm Beach County"
        ctaText="Book Now"
        ctaHref="#contact"
      />
      <Navbar links={NAV_LINKS_JUNK_LOCATION} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Wellington Junk Removal Services
          </h2>
          <p>
            Clearing out clutter has never been easier. Our team offers fast,
            eco&#8209;friendly junk removal for barns, stables, yards and homes
            in Wellington. From broken fencing and old tack to appliances, yard
            waste and debris, we load it up and haul it away—starting at just $75
            per ton.
          </p>
        </section>

        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">Why Choose Us?</h2>
          <ul className="pl-5 leading-relaxed">
            <li>Affordable pricing from $75 per ton</li>
            <li>Same&#8209;day and next&#8209;day service options</li>
            <li>Eco&#8209;friendly disposal and recycling</li>
            <li>Licensed &amp; insured local business</li>
            <li>Trusted by horse farms, homeowners and businesses</li>
          </ul>
        </section>

        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">Service Areas</h2>
          <ul className="pl-5 leading-relaxed">
            <li>Wellington</li>
            <li>Royal Palm Beach</li>
            <li>Loxahatchee</li>
            <li>West Palm Beach</li>
            <li>Palm Beach Gardens</li>
          </ul>
        </section>

        <section
          id="contact"
          className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">Book Your Junk Removal</h2>
          <p>
            Ready to clear out that junk? Call us at{" "}
            <a href="tel:+15615767667" className="text-primary-dark">
              (561) 576&#8209;7667
            </a>{" "}
            or book online now.
          </p>
          <a
            href="/#calendar"
            className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
          >
            Schedule Now
          </a>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://www.myhorsefarm.com/#organization",
          name: "My Horse Farm Junk Removal - Wellington",
          url: "https://www.myhorsefarm.com/junk-removal/wellington",
          image: "https://www.myhorsefarm.com/logo.png",
          telephone: "(561) 576-7667",
          email: "sales@myhorsefarm.com",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Royal Palm Beach",
            addressRegion: "FL",
            postalCode: "33411",
            addressCountry: "US",
          },
          serviceArea: [
            { "@type": "City", name: "Wellington" },
            { "@type": "City", name: "Royal Palm Beach" },
            { "@type": "City", name: "Loxahatchee" },
            { "@type": "City", name: "West Palm Beach" },
            { "@type": "City", name: "Palm Beach Gardens" },
          ],
          areaServed: [
            "Wellington",
            "Royal Palm Beach",
            "Loxahatchee",
            "West Palm Beach",
            "Palm Beach Gardens",
          ],
          description:
            "Same\u2011day junk removal starting at $75 per ton in Wellington, FL.",
          sameAs: [
            "https://www.facebook.com/myhorsefarmapp",
            "https://www.instagram.com/myhorsefarmservice/",
            "https://www.youtube.com/@horsedadtv9292",
            "https://www.google.com/maps/place/My+Horse+Farm/@26.6957151,-80.2033345,10z/data=!3m1!4b1!4m6!3m5!1s0x6826af3f1557e94b:0xcc8b36039075494b!8m2!3d26.695715!4d-80.2033345!16s%2Fg%2F11p00vldxb?entry=ttu",
          ],
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
              name: "Wellington",
              item: "https://www.myhorsefarm.com/junk-removal/wellington",
            },
          ],
        }}
      />
    </>
  );
}
