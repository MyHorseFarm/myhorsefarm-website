import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Manure Removal in Palm Beach Gardens, FL",
  description:
    "Professional manure removal in Palm Beach Gardens, FL. Scheduled service for horse properties along Northlake Blvd and PGA corridor. Call (561) 576-7667 today.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/manure-removal/palm-beach-gardens",
  },
  openGraph: {
    title: "Manure Removal in Palm Beach Gardens, FL",
    description:
      "Professional manure removal in Palm Beach Gardens. Scheduled service for horse properties along Northlake Blvd and the PGA corridor.",
    type: "website",
    url: "https://www.myhorsefarm.com/manure-removal/palm-beach-gardens",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Manure Removal in Palm Beach Gardens, FL",
    description:
      "Professional manure removal in Palm Beach Gardens. Scheduled pickups for equestrian properties.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function ManureRemovalPalmBeachGardensPage() {
  return (
    <>
      <Hero
        short
        title="Manure Removal in Palm Beach Gardens"
        tagline="Premium waste management for upscale equestrian properties"
      />
      <main>
        {/* Intro */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Palm Beach Gardens Manure Removal Services
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Palm Beach Gardens blends suburban elegance with a quiet but
            thriving equestrian community. Properties west of the Turnpike along
            Northlake Boulevard, estates near Frenchman&apos;s Reserve and horse
            parcels off PGA Boulevard all maintain the kind of meticulous
            standards that make reliable manure removal essential rather than
            optional. My Horse Farm brings the same professional service trusted
            by Wellington&apos;s top barns to every Gardens property we serve.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you board a handful of horses on a private estate or manage a
            small training operation north of Northlake, waste accumulates
            quickly in South Florida&apos;s subtropical climate. Left
            unmanaged, it attracts flies, produces strong odors and can lead to
            groundwater concerns on properties near the Loxahatchee Slough
            Natural Area. We eliminate that problem with scheduled, hassle-free
            pickups.
          </p>
        </section>

        {/* Services Detail */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Manure Removal Services in Palm Beach Gardens
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tailored Pickup Schedules
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We design a pickup cadence around your horse count, stall
                configuration and property layout. Most Gardens clients opt
                for weekly service, but we offer bi-weekly and custom plans
                for smaller operations.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Discreet, Sealed Containers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                For Gardens properties where aesthetics matter, our sealed
                bins prevent odor and keep your grounds looking pristine.
                We position containers out of sightlines and swap them
                before they approach capacity.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Certified Eco Disposal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All waste is transported to approved composting facilities.
                We provide disposal documentation on request, which many
                Gardens HOAs and estate managers appreciate for their
                environmental compliance records.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Storm Season Readiness
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Before hurricane season, we offer priority cleanouts to
                prevent waste from becoming a flood-borne hazard. Gardens
                properties near low-lying areas benefit from pre-storm bin
                removal and rapid post-storm service resumption.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Palm Beach Gardens Farm Owners Choose Us
          </h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Wellington-grade service</strong> — the same crews and
                equipment trusted by the equestrian capital serve your Gardens
                property
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>HOA-compatible operations</strong> — discreet bin
                placement, sealed containers and clean trucks that meet the
                standards of gated communities like Frenchman&apos;s Reserve
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Fully licensed and insured</strong> — we carry
                commercial liability coverage and comply with all Palm Beach
                County hauling regulations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">&#10003;</span>
              <span>
                <strong>Proximity to Wellington corridor</strong> — our daily
                routes from Royal Palm Beach to Wellington pass right through
                the Gardens, so your service slots are convenient and reliable
              </span>
            </li>
          </ul>
        </section>

        {/* Service Area Cross-Links */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Serving Palm Beach Gardens and Beyond
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            We serve equestrian properties across western Palm Beach County, from
            the PGA corridor south through the Wellington equestrian zone:
          </p>
          <div className="flex flex-wrap gap-3">
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
              href="/manure-removal/loxahatchee-groves"
              className="rounded-xl bg-white border border-gray-200 px-5 py-3 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              Loxahatchee Groves
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
            Manure Removal FAQ for Palm Beach Gardens
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you service gated equestrian communities in the Gardens?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. We work with gate codes, access schedules and property
                managers at communities like Frenchman&apos;s Reserve and other
                gated estates along PGA Boulevard. Our drivers are experienced
                with HOA access protocols.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How far north in Palm Beach Gardens do you service?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We cover all of Palm Beach Gardens, including horse properties
                north of PGA Boulevard, along Northlake Boulevard and west
                toward the Beeline Highway corridor. If your property is in
                the Gardens zip codes (33408, 33410, 33418), we serve it.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I only have two or three horses?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Small operations are welcome. We offer right-sized bins and
                bi-weekly pickup schedules that keep costs low for Gardens
                residents with just a few horses on their property.
              </p>
            </div>
            <div className="rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there an environmental benefit to professional manure removal?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Proper disposal prevents nutrient runoff into local waterways
                and the Loxahatchee Slough. Our composting partners turn the
                waste into usable soil amendment rather than sending it to
                landfill.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Schedule Manure Removal in Palm Beach Gardens
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Keep your Gardens property pristine. Call us at{" "}
            <a href="tel:+15615767667" className="text-green-700 font-semibold">
              (561) 576&#8209;7667
            </a>{" "}
            or request a quote online to get started.
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
            name: "Palm Beach Gardens",
          },
          description:
            "Professional manure removal services in Palm Beach Gardens, FL. Scheduled pickups for equestrian properties along Northlake Blvd and the PGA corridor.",
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
              name: "Palm Beach Gardens",
              item: "https://www.myhorsefarm.com/manure-removal/palm-beach-gardens",
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
              name: "Do you service gated equestrian communities in Palm Beach Gardens?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. We work with gate codes, access schedules and property managers at communities like Frenchman's Reserve and other gated estates along PGA Boulevard.",
              },
            },
            {
              "@type": "Question",
              name: "How far north in Palm Beach Gardens do you service?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We cover all of Palm Beach Gardens, including horse properties north of PGA Boulevard, along Northlake Boulevard and west toward the Beeline Highway corridor.",
              },
            },
            {
              "@type": "Question",
              name: "What if I only have two or three horses in Palm Beach Gardens?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Small operations are welcome. We offer right-sized bins and bi-weekly pickup schedules that keep costs low for Gardens residents with just a few horses.",
              },
            },
            {
              "@type": "Question",
              name: "Is there an environmental benefit to professional manure removal?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Proper disposal prevents nutrient runoff into local waterways and the Loxahatchee Slough. Our composting partners turn the waste into usable soil amendment rather than sending it to landfill.",
              },
            },
          ],
        }}
      />
    </>
  );
}
