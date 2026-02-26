import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Farm Repairs & Maintenance | My Horse Farm",
  description:
    "Professional farm repairs & maintenance services in Royal Palm Beach, Wellington and Loxahatchee. We fix fences, stalls, barns, arenas and driveways with quality craftsmanship and fast response.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/repairs" },
  openGraph: {
    title: "Farm Repairs & Maintenance | My Horse Farm",
    description:
      "Professional farm repairs & maintenance in Royal Palm Beach, Wellington and Loxahatchee. Fences, stalls, barns, arenas and driveways.",
    type: "website",
    url: "https://www.myhorsefarm.com/repairs",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Farm Repairs & Maintenance | My Horse Farm",
    description:
      "Professional farm repairs & maintenance in Royal Palm Beach, Wellington and Loxahatchee. Fences, stalls, barns, arenas and driveways.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function RepairsPage() {
  return (
    <>
      <Hero
        title="Farm Repairs & Maintenance"
        tagline="Repair & renew your equestrian facilities – we handle fences, stalls, arenas and more."
        ctaText="Schedule a Service"
        ctaHref="/#calendar"
      />
      <Navbar links={NAV_LINKS_SERVICE} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Expert Farm Repairs &amp; Maintenance
          </h2>
          <p>
            Keep your farm facilities safe and functional with our comprehensive
            repair services. We fix broken fences, gates, stalls, barns,
            paddocks, driveways, and other structures to protect your horses and
            enhance property value. Our experienced team uses high-quality
            materials and proven techniques to deliver long&#8209;lasting
            results.
          </p>

          <h3 className="text-primary-dark">
            Why Choose Our Repair Services?
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Experienced craftsmen who understand equestrian facility needs
            </li>
            <li>Flexible scheduling and quick turnaround</li>
            <li>Licensed &amp; insured for your peace of mind</li>
            <li>Compliant with Palm Beach County regulations</li>
            <li>
              Serving Royal Palm Beach, Wellington and Loxahatchee
            </li>
          </ul>

          <p>
            We handle everything from repairing broken fence boards and stall
            doors to resurfacing arenas and patching driveways. Let us take care
            of the hard work so you can focus on caring for your horses.
          </p>
          <p>
            <a
              href="/#calendar"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
            >
              Book Your Repairs
            </a>
          </p>
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
            sameAs: [
              "https://www.facebook.com/myhorsefarmapp",
              "https://www.instagram.com/myhorsefarmservice/",
              "https://www.youtube.com/@horsedadtv9292",
              "https://www.google.com/maps/place/My+Horse+Farm/@26.6957151,-80.2033345,10z/data=!3m1!4b1!4m6!3m5!1s0x6826af3f1557e94b:0xcc8b36039075494b!8m2!3d26.695715!4d-80.2033345!16s%2Fg%2F11p00vldxb?entry=ttu",
            ],
          },
          areaServed: [
            "Royal Palm Beach FL",
            "Wellington FL",
            "Loxahatchee FL",
          ],
          url: "https://www.myhorsefarm.com/repairs",
          description:
            "Professional farm repairs and maintenance services for equestrian facilities including fences, barns, stalls, paddocks and driveways in Royal Palm Beach, Wellington and Loxahatchee.",
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
              name: "Repairs & Maintenance",
              item: "https://www.myhorsefarm.com/repairs",
            },
          ],
        }}
      />
    </>
  );
}
