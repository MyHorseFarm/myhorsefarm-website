import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sod Installation Services | My Horse Farm",
  description:
    "Professional sod installation for equestrian arenas and paddocks in Royal Palm Beach, Wellington & Loxahatchee, Florida. Give your horses safe, lush footing with My Horse Farm\u2019s high\u2011quality sod and expert installation.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/sod-installation" },
  openGraph: {
    title: "Sod Installation Services | My Horse Farm",
    description:
      "Professional sod installation for equestrian arenas and paddocks in Royal Palm Beach, Wellington & Loxahatchee, FL.",
    type: "website",
    url: "https://www.myhorsefarm.com/sod-installation",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sod Installation Services | My Horse Farm",
    description:
      "Professional sod installation for equestrian arenas and paddocks in Royal Palm Beach, Wellington & Loxahatchee, FL.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function SodInstallationPage() {
  return (
    <>
      <Hero
        title="Sod Installation Services"
        tagline="Give your horses lush, durable footing"
        ctaText="Get a Quote"
        ctaHref="/#contact"
      />
      <Navbar links={NAV_LINKS_SERVICE} />
      <main>
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Sod Installation for Equine Arenas &amp; Paddocks
          </h2>
          <p>
            Quality footing is essential for your horses&apos; health and
            performance. Our team specializes in installing lush, durable sod on
            paddocks, arenas and riding paths throughout Royal Palm Beach,
            Wellington, Loxahatchee and nearby communities. We source
            high&#8209;quality turf that stands up to Florida&apos;s climate and
            equestrian wear.
          </p>

          <h3 className="text-primary-dark">Why Choose Our Sod?</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Premium sod varieties selected for durability and drainage
            </li>
            <li>
              Complete site preparation, grading and soil conditioning
            </li>
            <li>
              Experienced installation crew to ensure seamless seams and level
              surfaces
            </li>
            <li>
              Improved footing and reduced dust for horse and rider comfort
            </li>
            <li>
              Locally owned and operated with fast turnaround times
            </li>
          </ul>

          <p>
            From small paddocks to large arenas, we deliver and install sod that
            transforms bare or muddy ground into a beautiful, resilient surface.
            Our service includes removing old turf if necessary, preparing the
            soil and laying new sod for optimal rooting and growth.
          </p>

          <h3 className="text-primary-dark">Service Area</h3>
          <p>
            We proudly serve Royal Palm Beach, Wellington, Loxahatchee and
            surrounding areas. Contact us for projects in Palm Beach
            County—we&apos;re happy to discuss your needs.
          </p>

          <h3 className="text-primary-dark">Get Started</h3>
          <p>
            Ready to upgrade your paddocks or arena? Click below to schedule a
            consultation or request a quote. We&apos;ll review your site and
            recommend the right sod solution for your horses.
          </p>
          <p>
            <a
              href="/#calendar"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
            >
              Book Sod Installation
            </a>
          </p>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Sod Installation",
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
            "Professional sod installation services for equestrian arenas, paddocks and riding paths in Palm Beach County. We provide premium sod and expert installation for safe, lush footing.",
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
              name: "Sod Installation",
              item: "https://www.myhorsefarm.com/sod-installation",
            },
          ],
        }}
      />
    </>
  );
}
