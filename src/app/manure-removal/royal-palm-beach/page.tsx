import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Manure Removal in Royal Palm Beach, FL",
  description:
    "Horse manure removal in Royal Palm Beach, FL. Same-day pickups, leak-proof bins and eco-friendly disposal from our home base. Call (561) 576-7667 for a free quote.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical: "https://www.myhorsefarm.com/manure-removal/royal-palm-beach",
  },
  openGraph: {
    title: "Manure Removal in Royal Palm Beach, FL",
    description:
      "Horse manure removal in Royal Palm Beach. Same-day pickups, leak-proof bins and eco-friendly disposal from our home base.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal/royal-palm-beach",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Manure Removal in Royal Palm Beach, FL",
    description:
      "Horse manure removal in Royal Palm Beach. Same-day pickups and eco-friendly disposal from our home base.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function ManureRemovalRoyalPalmBeachPage() {
  return (
    <>
      <Hero
        short
        title="Manure Removal in Royal Palm Beach"
        tagline="Your local team — right in your backyard"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Royal Palm Beach Horse Manure Removal
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Royal Palm Beach is where My Horse Farm calls home, and that means
            faster response times, same-day availability and a crew that knows
            every back road between Crestwood and the Commons. Equestrian
            properties along Southern Boulevard, hobby farms near Sparrow Drive
            and acreage lots west of Royal Palm Beach Boulevard all generate
            steady volumes of horse waste that Florida&apos;s heat turns into a
            fly-and-odor problem fast. We keep your property clean so you can
            focus on your horses.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Because our trucks are already in the neighborhood, Royal Palm Beach
            clients enjoy the shortest scheduling windows in our service area.
            Need a bin dropped off before a weekend event at Commons Park? We can
            usually get there the same afternoon.
          </p>
        </section>

        {/* Services Detail */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Manure Removal Services in Royal Palm Beach
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Scheduled Pickups
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Weekly, bi-weekly or custom schedules tailored to your barn
                size. We track volume over time and adjust frequency so you
                never overflow a bin or pay for pickups you don&apos;t need.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Leak-Proof Containers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our sealed bins and dumpsters prevent runoff into the soil
                and keep odors contained, which matters when your neighbors
                in Crestwood are close by. Sizes range from compact 2-yard
                bins to 30-yard roll-offs.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Eco-Friendly Disposal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All waste goes to approved composting facilities in Palm
                Beach County. We&apos;re working toward a biochar processing
                program that will turn horse waste into valuable soil
                amendment.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                One-Time Cleanouts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Moving onto a new property? Inheriting a barn that&apos;s
                been neglected? We handle full-property manure cleanouts
                with same-day turnaround in Royal Palm Beach.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Royal Palm Beach Farm Owners Choose Us
          </h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Home-base advantage</strong> — our yard is in Royal Palm
                Beach, so you get the fastest response times in our entire
                service area
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Local knowledge</strong> — we know Palm Beach County
                waste regulations and the specific requirements for
                agricultural-zoned properties along Southern Blvd
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Trusted for over a decade</strong> — licensed, insured
                and recommended by Royal Palm Beach barn owners since day one
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Flexible sizing</strong> — from a 3-stall hobby barn
                to a 40-horse boarding facility, we match the right bin to
                your operation
              </span>
            </li>
          </ul>
        </section>

        {/* Service Area Cross-Links */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Serving Royal Palm Beach and Nearby Communities
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In addition to Royal Palm Beach, we provide manure removal
            across western Palm Beach County. Our trucks run daily routes
            through these neighboring communities:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/manure-removal/wellington"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Wellington
            </Link>
            <Link
              href="/manure-removal/loxahatchee-groves"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee Groves
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
            <Link
              href="/manure-removal/loxahatchee"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Manure Removal FAQ for Royal Palm Beach
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How quickly can you start service in Royal Palm Beach?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Because our operations are based right here in Royal Palm Beach,
                we can often deliver a bin the same day you call. Most new
                clients are fully set up within 24 hours.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What size bins do you offer for small hobby farms?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We carry compact 2-yard and 4-yard bins that fit easily next to
                a barn or along a fence line. These are popular with Royal Palm
                Beach properties that have 2 to 6 horses.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you handle waste from properties near the Commons Park area?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely. We serve equestrian properties throughout Royal Palm
                Beach, including lots near Commons Park, the Crestwood
                community, and acreage parcels along Southern Boulevard and
                Royal Palm Beach Boulevard.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I combine manure removal with junk removal?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. Many of our Royal Palm Beach clients bundle{" "}
                <Link
                  href="/junk-removal/royal-palm-beach"
                  className="text-green-700 hover:text-green-900 underline"
                >
                  junk removal
                </Link>{" "}
                with scheduled manure pickups. Old fencing, broken equipment and
                barn debris can go on the same truck.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready for reliable manure removal right here in Royal Palm Beach?
            Call us at{" "}
            <a href="tel:+15615767667" className="text-green-700 font-semibold">
              (561) 576&#8209;7667
            </a>{" "}
            or request a quote online.
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
            name: "Royal Palm Beach",
          },
          description:
            "Horse manure removal services in Royal Palm Beach, FL. Same-day pickups, leak-proof bins and eco-friendly disposal from our home base.",
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
              name: "Royal Palm Beach",
              item: "https://www.myhorsefarm.com/manure-removal/royal-palm-beach",
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
              name: "How quickly can you start manure removal service in Royal Palm Beach?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Because our operations are based right here in Royal Palm Beach, we can often deliver a bin the same day you call. Most new clients are fully set up within 24 hours.",
              },
            },
            {
              "@type": "Question",
              name: "What size bins do you offer for small hobby farms in Royal Palm Beach?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We carry compact 2-yard and 4-yard bins that fit easily next to a barn or along a fence line. These are popular with Royal Palm Beach properties that have 2 to 6 horses.",
              },
            },
            {
              "@type": "Question",
              name: "Do you service properties near the Commons Park area?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. We serve equestrian properties throughout Royal Palm Beach, including lots near Commons Park, the Crestwood community, and acreage parcels along Southern Boulevard and Royal Palm Beach Boulevard.",
              },
            },
            {
              "@type": "Question",
              name: "Can I combine manure removal with junk removal in Royal Palm Beach?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Many of our Royal Palm Beach clients bundle junk removal with scheduled manure pickups. Old fencing, broken equipment and barn debris can go on the same truck.",
              },
            },
          ],
        }}
      />
    </>
  );
}
