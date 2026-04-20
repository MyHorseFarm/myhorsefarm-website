import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Current Offers & Perks",
  description:
    "Save $50 on your first service of $300+, plus get a free month at Resilient Fitness and a free dance class at Starpoint Dancesport. Limited time offers from My Horse Farm in Wellington & Royal Palm Beach, FL.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/offers" },
  openGraph: {
    title: "Current Offers & Perks",
    description:
      "Save $50 on your first service of $300+, plus exclusive wellness and dance perks. Limited time offers from My Horse Farm.",
    type: "website",
    url: "https://www.myhorsefarm.com/offers",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Current Offers & Perks",
    description:
      "Save $50 on your first service of $300+, plus exclusive wellness and dance perks. Limited time offers from My Horse Farm.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const services = [
  {
    icon: "fas fa-dumpster",
    name: "Manure Removal",
    desc: "Scheduled pickup with leak-proof bins for farms of all sizes",
  },
  {
    icon: "fas fa-broom",
    name: "Junk Removal",
    desc: "Old fencing, debris, broken equipment hauled away same day",
  },
  {
    icon: "fas fa-seedling",
    name: "Sod Installation",
    desc: "Premium Florida sod for paddocks, arenas, and pastures",
  },
  {
    icon: "fas fa-truck",
    name: "Fill Dirt Delivery",
    desc: "Screened fill for leveling, drainage, and berm construction",
  },
  {
    icon: "fas fa-trash-alt",
    name: "Dumpster Rental",
    desc: "20-yard containers with flexible rental periods",
  },
  {
    icon: "fas fa-wrench",
    name: "Farm Repairs",
    desc: "Fences, gates, stalls, barns, and driveway resurfacing",
  },
];

const testimonials = [
  {
    quote:
      "They showed up on time, cleaned out years of junk from our barn, and had the whole property looking brand new in one day. Best crew in Wellington.",
    author: "Sarah M.",
    location: "Wellington, FL",
  },
  {
    quote:
      "We switched to My Horse Farm for manure removal and the difference is night and day. Reliable schedule, fair pricing, and Jose actually picks up the phone.",
    author: "Carlos R.",
    location: "Loxahatchee, FL",
  },
  {
    quote:
      "Got our paddock re-sodded and fill dirt delivered in the same week. One call, one crew, everything handled. That $50 off made it even better.",
    author: "Diana L.",
    location: "Royal Palm Beach, FL",
  },
];

export default function OffersPage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative bg-[#1a3009] text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d5016] via-[#1a3009] to-[#0f1f05] opacity-90" />
          <div className="relative max-w-[1100px] mx-auto px-5 py-20 text-center max-md:py-14 max-md:px-4">
            <span className="inline-block bg-[#d4a843] text-[#1a3009] font-bold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
              Limited Time Offer
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-4 max-md:text-3xl">
              Save <span className="text-[#d4a843]">$50</span> on Your Next
              Farm Service
            </h1>
            <p className="text-xl text-white/80 max-w-[700px] mx-auto mb-3 max-md:text-lg">
              Any service of $300 or more. First-time and returning clients welcome.
            </p>
            <p className="text-lg text-[#d4a843] font-semibold mb-8">
              Plus two exclusive bonus perks when you book today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/quote"
                className="inline-block bg-[#d4a843] text-[#1a3009] font-bold text-lg px-8 py-4 rounded-lg hover:bg-[#c49a38] transition-colors no-underline"
              >
                Get Your Quote
              </Link>
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="inline-block border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white/10 transition-colors no-underline"
              >
                Call {PHONE_OFFICE}
              </a>
            </div>
          </div>
        </section>

        {/* Three Perks */}
        <section className="bg-white py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#2d5016] mb-3 max-md:text-2xl">
              Three Reasons to Book Now
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-[600px] mx-auto">
              Every qualifying service comes with these exclusive perks at no extra cost.
            </p>

            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
              {/* Perk 1: $50 Off */}
              <div className="bg-gradient-to-b from-[#f8f5ee] to-white border border-[#d4a843]/30 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#d4a843] rounded-full flex items-center justify-center mx-auto mb-5">
                  <i className="fas fa-tag text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#2d5016] mb-2">
                  $50 OFF
                </h3>
                <p className="text-sm font-semibold text-[#d4a843] uppercase tracking-wide mb-3">
                  Any Service $300+
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Whether you need manure removal, junk hauled away, sod laid down, or
                  your farm repaired, save $50 instantly on jobs of $300 or more.
                  Open to first-time and returning clients.
                </p>
              </div>

              {/* Perk 2: Resilient Fitness */}
              <div className="bg-gradient-to-b from-[#f8f5ee] to-white border border-[#d4a843]/30 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#2d5016] rounded-full flex items-center justify-center mx-auto mb-5">
                  <i className="fas fa-dumbbell text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#2d5016] mb-2">
                  Free Month
                </h3>
                <p className="text-sm font-semibold text-[#d4a843] uppercase tracking-wide mb-3">
                  Resilient Fitness, Wellington
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Get a full month of gym access at Resilient Fitness in Wellington,
                  plus two personal training sessions to kickstart your
                  fitness. A $200+ value, on us.
                </p>
              </div>

              {/* Perk 3: Starpoint Dancesport */}
              <div className="bg-gradient-to-b from-[#f8f5ee] to-white border border-[#d4a843]/30 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#2d5016] rounded-full flex items-center justify-center mx-auto mb-5">
                  <i className="fas fa-music text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#2d5016] mb-2">
                  Free Class
                </h3>
                <p className="text-sm font-semibold text-[#d4a843] uppercase tracking-wide mb-3">
                  Starpoint Dancesport, Wellington
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Enjoy a complimentary dance class at Starpoint Dancesport in
                  Wellington. Bachata, salsa, ballroom, or whatever moves you.
                  A fun reward for taking care of your farm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#f8f5ee] py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2d5016] mb-10 max-md:text-2xl">
              How It Works
            </h2>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
              <div>
                <div className="w-12 h-12 bg-[#2d5016] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#2d5016] mb-2">
                  Request a Quote
                </h3>
                <p className="text-gray-600">
                  Tell us what you need online or call us directly. We respond
                  within hours, not days.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#2d5016] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#2d5016] mb-2">
                  We Handle Everything
                </h3>
                <p className="text-gray-600">
                  Our crew shows up on time and gets the job done right. No
                  surprises, no hidden fees.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#2d5016] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#2d5016] mb-2">
                  Enjoy Your Perks
                </h3>
                <p className="text-gray-600">
                  After your service, we send your gym pass and dance class
                  voucher. Simple as that.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services We Offer */}
        <section className="bg-white py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#2d5016] mb-3 max-md:text-2xl">
              Services That Qualify
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-[600px] mx-auto">
              The $50 discount applies to any of the following services when your job totals $300 or more.
            </p>
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-start gap-4 p-5 rounded-lg border border-gray-100 hover:border-[#d4a843]/40 hover:bg-[#f8f5ee]/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#2d5016]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`${svc.icon} text-[#2d5016]`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2d5016] mb-1">{svc.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[#2d5016] text-white py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 max-md:text-2xl">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
              {testimonials.map((t) => (
                <div
                  key={t.author}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="flex gap-1 mb-4 text-[#d4a843]">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-sm" />
                    ))}
                  </div>
                  <p className="text-white/90 leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="font-bold text-[#d4a843]">
                    {t.author}{" "}
                    <span className="font-normal text-white/60">
                      &mdash; {t.location}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Urgency / Final CTA */}
        <section className="bg-gradient-to-br from-[#d4a843] to-[#b8912e] text-[#1a3009] py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 max-md:text-2xl">
              This Offer Won&apos;t Last Forever
            </h2>
            <p className="text-lg text-[#1a3009]/80 mb-8 max-w-[600px] mx-auto">
              We can only extend the gym membership and dance class perks while our
              partners have availability. Lock in your $50 savings and bonus perks
              before they&apos;re gone.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/quote"
                className="inline-block bg-[#2d5016] text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-[#1a3009] transition-colors no-underline"
              >
                Claim Your $50 Off
              </Link>
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="inline-block bg-white text-[#2d5016] font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors no-underline"
              >
                Call {PHONE_OFFICE}
              </a>
            </div>
            <p className="mt-6 text-sm text-[#1a3009]/60">
              Mention this offer when you call or it will be applied automatically for online quotes.
            </p>
          </div>
        </section>

        {/* Fine Print */}
        <section className="bg-[#1a3009] text-white/50 py-8 px-5">
          <div className="max-w-[800px] mx-auto text-center text-xs leading-relaxed">
            <p>
              $50 discount applies to services totaling $300 or more before tax.
              Cannot be combined with other promotions. Resilient Fitness membership
              is a one-month trial for new gym members; two personal training sessions
              included. Starpoint Dancesport class is one complimentary group class for
              first-time attendees. Partner perks subject to availability and partner
              terms. My Horse Farm reserves the right to modify or end this promotion
              at any time. Serving Wellington, Royal Palm Beach, Loxahatchee, West Palm
              Beach, and surrounding areas.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
