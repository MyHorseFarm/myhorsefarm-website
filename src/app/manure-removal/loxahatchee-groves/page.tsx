import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Manure Removal in Loxahatchee Groves, FL",
  description:
    "Manure removal for Loxahatchee Groves horse farms and acreage properties. Scheduled pickups, large-capacity bins and eco-friendly disposal. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/manure-removal/loxahatchee-groves",
  },
  openGraph: {
    title: "Manure Removal in Loxahatchee Groves, FL",
    description:
      "Manure removal for Loxahatchee Groves horse farms and acreage properties. Scheduled pickups and large-capacity bins.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal/loxahatchee-groves",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Manure Removal in Loxahatchee Groves, FL",
    description:
      "Manure removal for Loxahatchee Groves horse farms. Scheduled pickups and eco-friendly disposal.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function ManureRemovalLoxahatcheeGrovesPage() {
  return (
    <>
      <Hero
        short
        title="Manure Removal in Loxahatchee Groves"
        tagline="Built for big farms, dirt roads and serious horse operations"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Loxahatchee Groves Horse Manure Removal
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Loxahatchee Groves is one of South Florida&apos;s last true rural
            equestrian communities. With agricultural zoning that allows
            large-scale horse operations, multi-acre properties along Okeechobee
            Boulevard and Collecting Canal Road, and the kind of wide-open
            acreage that attracts serious equestrians, the Groves generates more
            horse waste per square mile than almost anywhere in Palm Beach
            County. My Horse Farm has been hauling manure out of Loxahatchee
            Groves since our earliest days, and our trucks are built to handle
            the unpaved roads and large volumes that define this community.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            The Groves&apos; dirt roads and agricultural character are part of
            its charm, but they also mean you need a hauler with the right
            equipment. Standard waste companies avoid unpaved access roads. We
            don&apos;t. Our roll-off trucks navigate Loxahatchee Groves&apos;
            shell rock and limestone roads daily, delivering and retrieving bins
            no matter where your barn sits on the property.
          </p>
        </section>

        {/* Services Detail */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Manure Removal Services in Loxahatchee Groves
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Large-Capacity Roll-Offs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Groves properties often run 10, 20 or even 40+ horses.
                We deploy 20-yard and 30-yard roll-off containers that
                match the scale of your operation and reduce pickup
                frequency.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Dirt-Road-Ready Equipment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our trucks are equipped for the unpaved, shell rock roads
                that define the Groves. We access properties on F Road,
                Collecting Canal Road, Folsom Road and every side road in
                between without issue.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Flexible Volume-Based Pricing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Large farms benefit from our volume pricing. The more
                horses you run, the lower your per-unit cost. We work with
                Groves barn managers to find the most economical schedule
                and container size.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Full Property Cleanouts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Buying an acreage property that&apos;s been sitting?
                Groves parcels can accumulate years of manure.
                We handle complete property cleanouts with multiple
                roll-offs and fast turnaround.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Loxahatchee Groves Farm Owners Choose Us
          </h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>We know the Groves</strong> — our crews drive the
                unpaved roads every week and understand the agricultural
                community&apos;s unique needs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Scaled for large operations</strong> — from 10-stall
                barns to 60+ horse training facilities, we have the container
                sizes and pickup frequency to match
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Agricultural compliance</strong> — we help Groves
                property owners meet Palm Beach County waste management
                requirements for agriculturally zoned land
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Reliable schedule</strong> — we never skip a pickup
                because of a dirt road, rain or access difficulty
              </span>
            </li>
          </ul>
        </section>

        {/* Service Area Cross-Links */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Serving Loxahatchee Groves and Surrounding Areas
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Our trucks run daily routes connecting the Groves to neighboring
            equestrian communities across western Palm Beach County:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/manure-removal/loxahatchee"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee
            </Link>
            <Link
              href="/manure-removal/wellington"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Wellington
            </Link>
            <Link
              href="/manure-removal/royal-palm-beach"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Royal Palm Beach
            </Link>
            <Link
              href="/manure-removal/palm-beach-gardens"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Palm Beach Gardens
            </Link>
            <Link
              href="/manure-removal/west-palm-beach"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              West Palm Beach
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Manure Removal FAQ for Loxahatchee Groves
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can your trucks access properties on unpaved Groves roads?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. Our roll-off trucks are built for the shell rock and
                limestone roads throughout Loxahatchee Groves. We service
                properties on F Road, Collecting Canal Road, Folsom Road and
                all connecting unpaved roads.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What container sizes work best for 20+ horse farms?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                For operations with 20 or more horses, we typically recommend
                a 30-yard roll-off with weekly or twice-weekly pickups. For
                farms with 40+, we can place multiple containers and build a
                rotation schedule.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer volume discounts for large Groves properties?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely. Our pricing scales with volume, so larger
                operations pay less per ton. We&apos;ll assess your barn size
                and horse count during a free on-site evaluation and build a
                custom quote.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready for Reliable Manure Removal in the Groves?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We understand Loxahatchee Groves because we work here every day.
            Call us at{" "}
            <a href="tel:+15615767667" className="text-green-700 font-semibold">
              (561) 576&#8209;7667
            </a>{" "}
            or request your free quote.
          </p>
          <Link
            href="/quote"
            className="inline-block rounded-xl bg-green-700 px-8 py-4 text-lg font-bold text-white hover:bg-green-800 transition-colors"
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
            name: "Loxahatchee Groves",
          },
          description:
            "Manure removal for Loxahatchee Groves horse farms and acreage properties. Large-capacity bins, dirt-road-ready trucks and eco-friendly disposal.",
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
              name: "Loxahatchee Groves",
              item: "https://www.myhorsefarm.com/manure-removal/loxahatchee-groves",
            },
          ],
        }}
      />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Can your trucks access properties on unpaved Loxahatchee Groves roads?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Our roll-off trucks are built for the shell rock and limestone roads throughout Loxahatchee Groves. We service properties on F Road, Collecting Canal Road, Folsom Road and all connecting unpaved roads.",
              },
            },
            {
              "@type": "Question",
              name: "What container sizes work best for 20+ horse farms in Loxahatchee Groves?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For operations with 20 or more horses, we typically recommend a 30-yard roll-off with weekly or twice-weekly pickups. For farms with 40+, we can place multiple containers and build a rotation schedule.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer volume discounts for large Loxahatchee Groves properties?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. Our pricing scales with volume, so larger operations pay less per ton. We will assess your barn size and horse count during a free on-site evaluation and build a custom quote.",
              },
            },
          ],
        }}
      />
    </>
  );
}
