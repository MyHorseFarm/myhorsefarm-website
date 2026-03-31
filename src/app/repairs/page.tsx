import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Horse Farm Repairs & Maintenance Services | My Horse Farm",
  description:
    "Professional horse farm repairs in Wellington, Loxahatchee & Royal Palm Beach FL. Fence repair, barn & stall fixes, arena resurfacing, gate repair, driveway patching, pressure washing. Licensed & insured. Call (561) 576-7667.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/repairs" },
  openGraph: {
    title: "Horse Farm Repairs & Maintenance Services | My Horse Farm",
    description:
      "Professional horse farm repairs in Wellington, Loxahatchee & Royal Palm Beach FL. Fence repair, barn & stall fixes, arena resurfacing, gate repair, driveway patching, pressure washing.",
    type: "website",
    url: "https://www.myhorsefarm.com/repairs",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Horse Farm Repairs & Maintenance Services",
    description:
      "Professional horse farm repairs in Wellington, Loxahatchee & Royal Palm Beach FL. Fence repair, barn & stall fixes, arena resurfacing, gate repair, driveway patching, pressure washing.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const REPAIR_TYPES = [
  {
    icon: "fas fa-grip-lines",
    title: "Fence Repair",
    desc: "Board replacement, post repair, wire tightening, PVC fence fixes. We work with wood, vinyl, wire, and pipe fencing common on equestrian properties.",
  },
  {
    icon: "fas fa-warehouse",
    title: "Barn & Stall Repair",
    desc: "Stall doors, kick boards, wall patching, roof leaks, tongue and groove ceilings. We fix structural and cosmetic barn damage.",
  },
  {
    icon: "fas fa-horse-head",
    title: "Arena & Paddock Repair",
    desc: "Footing leveling, drainage fixes, soft spot repair, fence line maintenance. Keep your riding arena and paddocks safe for horses.",
  },
  {
    icon: "fas fa-door-open",
    title: "Gate Repair & Installation",
    desc: "Hinges, latches, automatic gate systems, sliding gates, and swing gates. We repair or replace gates that drag, stick, or won't latch.",
  },
  {
    icon: "fas fa-road",
    title: "Driveway & Road Repair",
    desc: "Gravel, limerock, pothole patching, grading, and drainage. We fix farm roads and driveways that take a beating from heavy equipment and trailers.",
  },
  {
    icon: "fas fa-spray-can",
    title: "Pressure Washing & Painting",
    desc: "Barn exteriors, fences, stalls, concrete, roofs. We clean and paint to protect your structures and keep your property looking sharp.",
  },
];

const WHY_CHOOSE = [
  {
    strong: "Equestrian specialists",
    text: "we know horse farm structures inside and out",
  },
  {
    strong: "Fast turnaround",
    text: "most repairs completed same week",
  },
  {
    strong: "Quality materials",
    text: "pressure-treated lumber, marine-grade hardware",
  },
  {
    strong: "Licensed & insured",
    text: "fully compliant in Palm Beach County",
  },
  {
    strong: "10+ years experience",
    text: "serving 400+ farms across PBC",
  },
  {
    strong: "Fair, upfront pricing",
    text: "no hidden fees or surprise charges",
  },
  {
    strong: "Post-season experts",
    text: "we know what breaks after WEF season",
  },
  {
    strong: "One call, everything fixed",
    text: "full-service, not just fences",
  },
];

const FAQS = [
  {
    q: "What types of fences do you repair?",
    a: "We repair wood board fencing, PVC/vinyl fencing, wire fencing, pipe fencing, and mesh fencing. We also install new fence sections when boards or posts are beyond repair.",
  },
  {
    q: "How quickly can you start repairs?",
    a: "Most repairs are scheduled within 3\u20135 business days. For urgent issues like a broken fence with horses at risk, we offer emergency same-day or next-day service.",
  },
  {
    q: "Do you handle insurance claims for storm damage?",
    a: "Yes. We document damage with photos and provide detailed estimates that you can submit to your insurance company. We work with you through the claims process.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Wellington, Royal Palm Beach, Loxahatchee, Loxahatchee Groves, West Palm Beach, and Palm Beach Gardens in Palm Beach County, Florida.",
  },
  {
    q: "Can you handle large commercial equestrian facilities?",
    a: "Absolutely. We service everything from small private barns to large training centers with 60+ stalls. Our crew and equipment scale to match the job.",
  },
];

const SERVICE_AREAS: { name: string; href?: string }[] = [
  { name: "Wellington", href: "/repairs/wellington" },
  { name: "Loxahatchee", href: "/repairs/loxahatchee" },
  { name: "West Palm Beach", href: "/repairs/west-palm-beach" },
  { name: "Royal Palm Beach" },
  { name: "Palm Beach Gardens" },
  { name: "Loxahatchee Groves" },
];

export default function RepairsPage() {
  return (
    <>
      <Hero
        title="Farm Repairs & Maintenance"
        tagline="Fences &bull; Barns &bull; Stalls &bull; Arenas &bull; Driveways &bull; Gates"
        ctaText="Get a Free Quote"
        ctaHref="/quote?service=repairs"
      />
      <main>
        {/* Repair Types */}
        <section className="py-16 px-5 bg-gray-50">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 max-md:text-2xl">
              Full-Service Farm Repairs
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              From broken fence boards to leaking barn roofs, we handle every
              repair your horse farm needs. One call gets it all fixed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REPAIR_TYPES.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center"
                >
                  <i
                    className={`${item.icon} text-3xl text-primary mb-4 block`}
                  />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Fix */}
        <section className="py-16 px-5">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 max-md:text-2xl">
              What We Fix
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              If it&apos;s on your farm and it&apos;s broken, we fix it. Here
              are the most common repairs we handle for equestrian properties
              across Palm Beach County.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Broken Fence Boards & Posts",
                  desc: "Cracked, rotted, or kicked-out boards and leaning posts. We replace individual boards or rebuild entire fence runs.",
                },
                {
                  title: "Stall Doors & Kick Boards",
                  desc: "Damaged stall doors, broken latches, splintered kick boards, and chewed wood. We restore stalls to safe, functional condition.",
                },
                {
                  title: "Arena Footing & Drainage",
                  desc: "Uneven footing, puddles, washouts, and drainage issues. We level, grade, and restore your riding surface.",
                },
                {
                  title: "Barn Roof & Siding",
                  desc: "Leaks, missing panels, wind damage, and rust. We patch or replace roofing and siding to keep your barn weathertight.",
                },
                {
                  title: "Driveway Potholes & Grading",
                  desc: "Ruts, potholes, washboard surfaces, and poor drainage. We patch, grade, and add material to restore smooth access.",
                },
                {
                  title: "Gates, Hinges & Latches",
                  desc: "Sagging gates, seized hinges, broken latches, and automatic gate malfunctions. We get your gates working properly again.",
                },
              ].map((svc) => (
                <div
                  key={svc.title}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-primary-dark mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-5 bg-green-900 text-white">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 max-md:text-2xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Send Photos &amp; Details
                </h3>
                <p className="text-green-200">
                  Text or email photos of what needs repair. We&apos;ll give you
                  an honest quote within 24 hours.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">We Show Up Ready</h3>
                <p className="text-green-200">
                  Our crew arrives with materials, tools, and equipment. Most
                  repairs are completed in one visit.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Property Restored</h3>
                <p className="text-green-200">
                  We clean up after ourselves and make sure everything is solid.
                  Your farm is back in top shape.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-5">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 max-md:text-2xl">
              Why Horse Farms Trust Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ul className="space-y-4">
                {WHY_CHOOSE.slice(0, 4).map((item) => (
                  <li key={item.strong} className="flex gap-3">
                    <i className="fas fa-check-circle text-primary mt-1" />
                    <span>
                      <strong>{item.strong}</strong> &mdash; {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-4">
                {WHY_CHOOSE.slice(4).map((item) => (
                  <li key={item.strong} className="flex gap-3">
                    <i className="fas fa-check-circle text-primary mt-1" />
                    <span>
                      <strong>{item.strong}</strong> &mdash; {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="py-16 px-5 bg-gray-50">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 max-md:text-2xl">
              Service Area
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We provide farm repair and maintenance services throughout Palm
              Beach County including Wellington, Loxahatchee, Royal Palm Beach,
              Loxahatchee Groves, West Palm Beach, and Palm Beach Gardens. If
              you&apos;re nearby, give us a call &mdash; we can probably get to
              you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {SERVICE_AREAS.map((area) =>
                area.href ? (
                  <Link
                    key={area.name}
                    href={area.href}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary border border-primary/30 hover:bg-primary hover:text-white transition-colors"
                  >
                    {area.name}
                  </Link>
                ) : (
                  <span
                    key={area.name}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    {area.name}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 max-md:text-2xl">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.q} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-primary-dark mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-5 text-center">
          <h2 className="text-3xl font-bold mb-4 max-md:text-2xl">
            Ready to Fix Your Farm?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Get a free quote online or call us now. Most repairs completed
            within a week.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote?service=repairs"
              className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="inline-block px-8 py-3.5 border-2 border-primary text-primary rounded font-bold text-lg hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fas fa-phone mr-2" />
              {PHONE_OFFICE}
            </a>
          </div>
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
            ],
          },
          areaServed: [
            "Royal Palm Beach FL",
            "Wellington FL",
            "Loxahatchee FL",
            "West Palm Beach FL",
            "Palm Beach Gardens FL",
          ],
          url: "https://www.myhorsefarm.com/repairs",
          description:
            "Professional horse farm repairs and maintenance services including fence repair, barn and stall fixes, arena resurfacing, gate repair, driveway patching, and pressure washing in Palm Beach County FL.",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Farm Repair Services",
            itemListElement: REPAIR_TYPES.map((rt) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: rt.title,
                description: rt.desc,
              },
            })),
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
              name: "Repairs & Maintenance",
              item: "https://www.myhorsefarm.com/repairs",
            },
          ],
        }}
      />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }}
      />
    </>
  );
}
