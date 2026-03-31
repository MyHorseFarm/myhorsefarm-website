import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Horse Farm Repairs in Wellington, FL",
  description:
    "Professional horse farm repairs in Wellington FL. Fence repair, barn & stall fixes, arena resurfacing, gate repair, pressure washing near WEF show grounds. Licensed & insured. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/repairs/wellington",
  },
  openGraph: {
    title: "Horse Farm Repairs in Wellington, FL",
    description:
      "Professional horse farm repairs in Wellington FL. Fence repair, barn & stall fixes, arena resurfacing, gate repair, pressure washing near WEF show grounds. Licensed & insured.",
    type: "website",
    url: "https://www.myhorsefarm.com/repairs/wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Horse Farm Repairs in Wellington, FL",
    description:
      "Professional horse farm repairs in Wellington FL. Fence repair, barn & stall fixes, arena resurfacing, gate repair, pressure washing.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function RepairsWellingtonPage() {
  return (
    <>
      <Hero
        title="Farm Repairs in Wellington"
        tagline="Expert repairs for Wellington's equestrian properties"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=repairs"
      />
      <main>
        <section className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Wellington Horse Farm Repair Services
          </h2>
          <p>
            Wellington is the equestrian capital of the world, and every season
            puts serious wear on its barns, fences, arenas and infrastructure.
            Hundreds of properties around the WEF show grounds, Pierson Road and
            the South Shore area depend on post-season maintenance to stay safe
            and functional. My Horse Farm handles all types of farm repairs so
            Wellington barn owners can get their properties back in shape fast —
            whether it&apos;s storm damage, normal wear from a busy winter
            season, or long-overdue upgrades that can&apos;t wait any longer.
          </p>

          <h3 className="text-primary-dark">
            What Wellington Farms Need After Season
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              Fence board replacement from horse wear and weather damage
            </li>
            <li>
              Stall door and kick board repairs after heavy winter use
            </li>
            <li>
              Arena footing leveling and drainage fixes from rain washouts
            </li>
            <li>
              Gate repairs — hinges, latches, and automatic systems
            </li>
            <li>
              Barn pressure washing and painting to remove mold and mildew
            </li>
            <li>
              Driveway and road grading after heavy trailer traffic during WEF
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Why Wellington Barn Owners Choose Us
          </h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              We know Wellington&apos;s{" "}
              <strong>Village regulations and permitting requirements</strong>
            </li>
            <li>
              Fast turnaround — most repairs completed within the week
            </li>
            <li>
              Quality materials built to withstand Florida heat, humidity, and
              storms
            </li>
            <li>
              One call handles everything — fences, barns, arenas, driveways,
              gates
            </li>
            <li>
              Licensed, insured, and trusted by Wellington equestrian community
              for over a decade
            </li>
            <li>
              Post-season specialists — we fix what WEF season breaks
            </li>
          </ul>

          <h3 className="text-primary-dark">How It Works</h3>
          <ul className="pl-5 leading-relaxed">
            <li>
              <strong>Step 1:</strong> Text or email photos of what needs fixing
              — we respond within 24 hours
            </li>
            <li>
              <strong>Step 2:</strong> We provide a detailed quote with materials
              and labor breakdown
            </li>
            <li>
              <strong>Step 3:</strong> Our crew arrives with everything needed —
              most jobs done in one visit
            </li>
            <li>
              <strong>Step 4:</strong> Final walkthrough to make sure everything
              meets your standards
            </li>
          </ul>

          <h3 className="text-primary-dark">
            Serving Wellington and Nearby Communities
          </h3>
          <p>
            Based in Royal Palm Beach, we&apos;re just minutes from Wellington.
            We also serve{" "}
            <Link
              href="/repairs/loxahatchee"
              className="text-primary-dark hover:text-primary"
            >
              Loxahatchee
            </Link>
            ,{" "}
            <Link
              href="/repairs/west-palm-beach"
              className="text-primary-dark hover:text-primary"
            >
              West Palm Beach
            </Link>
            , Royal Palm Beach, Loxahatchee Groves, and Palm Beach Gardens.
          </p>
        </section>

        <section
          id="contact"
          className="py-16 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Schedule Farm Repairs in Wellington
          </h2>
          <p>
            Ready to get your property back in shape? Call us at{" "}
            <a href="tel:+15615767667" className="text-primary-dark">
              (561) 576&#8209;7667
            </a>{" "}
            or request a quote online. We&apos;ll get back to you within 24
            hours.
          </p>
          <Link
            href="/quote?service=repairs"
            className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
          >
            Get a Free Quote
          </Link>
        </section>
      </main>
      <Footer />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Horse Farm Repairs and Maintenance",
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
            "Professional horse farm repair services in Wellington, FL. Fence repair, barn and stall fixes, arena resurfacing, gate repair, and pressure washing for equestrian properties.",
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
              name: "Repairs",
              item: "https://www.myhorsefarm.com/repairs",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Wellington",
              item: "https://www.myhorsefarm.com/repairs/wellington",
            },
          ],
        }}
      />
    </>
  );
}
