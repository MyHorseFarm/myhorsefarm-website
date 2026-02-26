import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Fill Dirt Delivery Services | My Horse Farm",
  description:
    "High-quality fill dirt delivery for leveling, berm building and paddock projects in Royal Palm Beach, Wellington & Loxahatchee, Florida. We supply screened dirt and expert service for all your farm construction needs.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/fill-dirt" },
  openGraph: {
    title: "Fill Dirt Delivery Services | My Horse Farm",
    description:
      "High-quality fill dirt delivery for leveling, berm building and paddock projects in Royal Palm Beach, Wellington & Loxahatchee, FL.",
    type: "website",
    url: "https://www.myhorsefarm.com/fill-dirt",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Fill Dirt Delivery Services | My Horse Farm",
    description:
      "High-quality fill dirt delivery for leveling, berm building and paddock projects in Royal Palm Beach, Wellington & Loxahatchee, FL.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function FillDirtPage() {
  return (
    <>
      <Hero
        title="Fill Dirt Delivery Services"
        tagline="Level and build with premium fill dirt"
        ctaText="Get a Quote"
        ctaHref="/#contact"
      />
      <Navbar links={NAV_LINKS_SERVICE} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Fill Dirt Delivery for Farm &amp; Equestrian Projects
          </h2>
          <p>
            Proper grading and construction start with the right materials. Our
            high&#8209;quality fill dirt is screened and selected for farm and
            arena projects. We deliver directly to your property in Royal Palm
            Beach, Wellington, Loxahatchee and surrounding areas, with quantities
            to suit projects big and small.
          </p>

          <h3 className="text-primary-dark">Why Use Our Fill Dirt?</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Clean, screened fill dirt ideal for building berms, leveling and
              raising grades
            </li>
            <li>
              Flexible delivery schedules and load sizes to fit your project
              timeline
            </li>
            <li>
              Experienced drivers who can place material where you need it
            </li>
            <li>Licensed and insured, with competitive pricing</li>
            <li>Locally sourced and eco&#8209;friendly materials</li>
          </ul>

          <p>
            Whether you&apos;re constructing a new paddock, repairing washouts or
            improving drainage, our fill dirt provides a stable foundation. We
            can also combine deliveries with sand or other aggregates upon
            request.
          </p>

          <h3 className="text-primary-dark">Service Area</h3>
          <p>
            We deliver to farms and equestrian properties throughout Royal Palm
            Beach, Wellington, Loxahatchee and Loxahatchee Groves. Contact us if
            you&apos;re nearby—we may be able to serve your location.
          </p>

          <h3 className="text-primary-dark">Get Started</h3>
          <p>
            Need fill dirt delivered? Click below to schedule a consultation or
            request a quote. We&apos;ll review your project and recommend the
            right quantity and schedule.
          </p>
          <p>
            <a
              href="/#calendar"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
            >
              Book Fill Dirt Delivery
            </a>
          </p>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Fill Dirt Delivery",
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
            "Fill dirt delivery services for farm construction and equestrian projects in Palm Beach County. Clean, screened dirt delivered with flexible schedules and competitive pricing.",
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
          ],
        }}
      />
    </>
  );
}
