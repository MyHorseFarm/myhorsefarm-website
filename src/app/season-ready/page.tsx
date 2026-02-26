import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import TrustBadges from "@/components/TrustBadges";
import {
  NAV_LINKS_SERVICE,
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Season-Ready Farm Package | My Horse Farm",
  description:
    "Get your Wellington or Loxahatchee horse farm ready for WEF season. One provider handles manure removal setup, sod installation, fill dirt, farm repairs, junk removal, and dumpster rental.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/season-ready" },
  openGraph: {
    title: "Season-Ready Farm Package | My Horse Farm",
    description:
      "Get your Wellington or Loxahatchee horse farm ready for WEF season. One provider handles manure removal setup, sod installation, fill dirt, farm repairs, junk removal, and dumpster rental.",
    type: "website",
    url: "https://www.myhorsefarm.com/season-ready",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Season-Ready Farm Package | My Horse Farm",
    description:
      "Get your Wellington or Loxahatchee horse farm ready for WEF season. One provider handles manure removal setup, sod installation, fill dirt, farm repairs, junk removal, and dumpster rental.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

const bundleServices = [
  {
    icon: "fas fa-dumpster",
    title: "Manure Removal Setup",
    bullets: [
      "Leak-proof bins delivered and positioned",
      "Weekly or bi-weekly pickup schedule set",
      "Wellington-compliant, DEP-approved disposal",
    ],
  },
  {
    icon: "fas fa-seedling",
    title: "Sod Installation",
    bullets: [
      "Site prep, grading, and soil conditioning",
      "Premium Florida sod for paddocks and pastures",
      "Safe footing for horses from day one",
    ],
  },
  {
    icon: "fas fa-truck",
    title: "Fill Dirt Delivery",
    bullets: [
      "Screened fill for leveling paddocks and berms",
      "Drainage improvements before season rains",
      "Large and small load delivery",
    ],
  },
  {
    icon: "fas fa-wrench",
    title: "Farm Repairs",
    bullets: [
      "Fences, gates, stalls, and barns",
      "Driveway resurfacing with millings asphalt",
      "Get everything safe and functional before horses arrive",
    ],
  },
  {
    icon: "fas fa-broom",
    title: "Property Cleanout",
    bullets: [
      "Old fencing, debris, broken equipment removed",
      "Barn and tack room cleanout",
      "Same-day service available",
    ],
  },
  {
    icon: "fas fa-trash-alt",
    title: "Dumpster Rental",
    bullets: [
      "20-yard containers for ongoing projects",
      "Flexible rental periods",
      "Perfect for renovations and large cleanups",
    ],
  },
];

const timeline = [
  {
    month: "October",
    tasks: "Book manure removal, schedule property assessment",
  },
  {
    month: "November",
    tasks: "Repairs, sod installation, fill dirt delivery",
  },
  {
    month: "December",
    tasks: "Deep clean, final inspections, bins in place",
  },
  {
    month: "January",
    tasks: "Season starts \u2014 you\u2019re ready",
  },
];

const metrics = [
  {
    title: "10+ Years Experience",
    description:
      "Serving horse farms across Palm Beach County with care and dedication.",
  },
  {
    title: "400+ Happy Clients",
    description:
      "Trusted by equestrian and residential customers alike.",
  },
  {
    title: "1,000+ Tons Hauled",
    description:
      "We\u2019ve removed thousands of tons of debris and waste responsibly.",
  },
  {
    title: "Same-Day Service Available",
    description:
      "Urgent requests? We move fast so your farm stays on schedule.",
  },
];

export default function SeasonReadyPage() {
  return (
    <>
      <Hero
        title="Get Your Farm Season-Ready"
        tagline="One call. Every service. Ready for WEF."
        ctaText="Get a Free Quote"
        ctaHref="#quote"
        short={true}
      />

      <Navbar links={NAV_LINKS_SERVICE} />

      <main>
        {/* Section 1: Stop Coordinating 5 Different Vendors */}
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">
            Stop Coordinating 5 Different Vendors
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Most farms need a manure hauler, fencing company, landscaper, junk
            removal crew, and dumpster rental&#8212;all before season starts.
            That means five different schedules, five invoices, and five points
            of contact. It&apos;s stressful, time-consuming, and things fall
            through the cracks.
          </p>
          <p className="text-gray-600 leading-relaxed">
            My Horse Farm handles <strong>all of it</strong> under one roof. One
            point of contact, one schedule, one trusted provider. From manure
            bins to sod, fill dirt to property cleanouts&#8212;we get your farm
            ready so you can focus on your horses.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Led by Jose Gomez with nearly 20 years in equestrian services, our
            team are horse owners ourselves. We understand the demands of WEF
            season because we live it, too.
          </p>
        </section>

        {/* Section 2: What's Included */}
        <section className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4 bg-gray-50">
          <h2 className="text-2xl max-md:text-xl">
            What&apos;s Included
          </h2>
          <p className="text-gray-600 mb-8">
            Six essential services, one Season-Ready package.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-5 max-md:grid-cols-1">
            {bundleServices.map((svc) => (
              <div
                key={svc.title}
                className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-left"
              >
                <div className="text-center mb-4">
                  <i
                    className={`${svc.icon} text-[2rem] text-primary`}
                  />
                </div>
                <h3 className="text-xl text-primary mb-3 text-center">
                  {svc.title}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {svc.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: The Season-Ready Timeline */}
        <section className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-center text-2xl max-md:text-xl">
            The Season-Ready Timeline
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Here&apos;s when to tackle each step so your farm is fully prepared
            before WEF kicks off.
          </p>
          <div className="relative max-w-[700px] mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-[3px] bg-primary/20 max-md:left-[20px]" />
            {timeline.map((item, idx) => (
              <div key={item.month} className="relative pl-[72px] pb-10 last:pb-0 max-md:pl-[56px]">
                {/* Dot */}
                <div className="absolute left-[18px] top-[4px] w-[24px] h-[24px] bg-primary rounded-full border-[3px] border-white shadow-[0_0_0_2px_rgba(var(--color-primary),0.3)] max-md:left-[10px] max-md:w-[22px] max-md:h-[22px]" />
                <h3 className="text-primary-dark text-lg font-bold mb-1">
                  {item.month}
                </h3>
                <p className="text-gray-600 leading-relaxed m-0">
                  {item.tasks}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Why Farms Trust Us */}
        <section className="py-15 px-5 bg-gray-50 max-md:py-10 max-md:px-4">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-center text-2xl max-md:text-xl">
              Why Farms Trust Us
            </h2>
            <TrustBadges />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mt-8 max-md:grid-cols-1">
              {metrics.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center"
                >
                  <h3 className="text-xl text-primary mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Quote */}
        <section
          id="quote"
          className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4"
        >
          <h2 className="text-2xl max-md:text-xl">
            Get Your Free Season-Ready Quote
          </h2>
          <p className="text-gray-600 mb-8 max-w-[600px] mx-auto">
            Tell us about your property and we&apos;ll build a custom package.
            Most quotes delivered within 1 business hour.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-phone" />
              {PHONE_OFFICE}
            </a>
            <a
              href="/#calendar"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary border-2 border-primary rounded font-bold text-lg hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fas fa-calendar-alt" />
              Book a Call Online
            </a>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Season-Ready Farm Package",
          serviceType: "Equestrian Farm Preparation Bundle",
          provider: {
            "@type": "LocalBusiness",
            "@id": "https://www.myhorsefarm.com/#organization",
            name: "My Horse Farm",
            image: "https://www.myhorsefarm.com/logo.png",
            telephone: "(561) 576-7667",
            email: "sales@myhorsefarm.com",
            priceRange: "$$",
            areaServed: [
              "Wellington FL",
              "Loxahatchee FL",
              "Royal Palm Beach FL",
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
            "Complete season-ready farm preparation package for Wellington and Loxahatchee horse farms. Includes manure removal setup, sod installation, fill dirt delivery, farm repairs, property cleanout, and dumpster rental — all from one trusted provider.",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Season-Ready Bundle Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Manure Removal Setup",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Sod Installation",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Fill Dirt Delivery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Farm Repairs",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Property Cleanout",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Dumpster Rental",
                },
              },
            ],
          },
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
              name: "Season-Ready Farm Package",
              item: "https://www.myhorsefarm.com/season-ready",
            },
          ],
        }}
      />
    </>
  );
}
