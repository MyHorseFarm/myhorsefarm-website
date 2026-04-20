import type { Metadata } from "next";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { getActiveServices } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Get an instant quote for dumpster rental, waste removal, junk hauling, sod installation, fill dirt delivery and farm repairs from My Horse Farm.",
  openGraph: {
    title: "Get a Free Quote",
    description:
      "Get an instant quote for dumpster rental, waste removal, junk hauling, sod installation, fill dirt delivery and farm repairs.",
    url: "https://www.myhorsefarm.com/quote",
  },
  twitter: {
    card: "summary",
    title: "Get a Free Quote",
    description:
      "Get an instant quote for dumpster rental, waste removal, junk hauling, sod installation, fill dirt delivery and farm repairs.",
  },
  alternates: {
    canonical: "https://www.myhorsefarm.com/quote",
  },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "My Horse Farm – Farm & Property Services",
    description:
      "Dumpster rental, waste removal, junk hauling, sod installation, fill dirt delivery and farm repairs for equestrian properties in South Florida.",
    provider: {
      "@type": "LocalBusiness",
      name: "My Horse Farm",
      url: "https://www.myhorsefarm.com",
      telephone: "+15615767667",
      areaServed: {
        "@type": "Place",
        name: "South Florida",
      },
    },
    url: "https://www.myhorsefarm.com/quote",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const services = await getActiveServices();
  const { ref: referralCode } = await searchParams;

  return (
    <>
      <ServiceSchema />
      <main className="pt-20 pb-16 px-5 max-md:px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-6 max-md:mb-4">
            <h1 className="text-3xl font-bold max-md:text-2xl">
              Get a Free Quote in Under 2 Minutes
            </h1>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Instant price. No site visit required for most services. Serving South Florida since 2015.
            </p>
            {referralCode && (
              <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-lg px-5 py-2">
                <p className="text-sm text-green-800 font-medium">
                  <i className="fas fa-gift mr-1.5" />
                  Referral discount will be applied to your quote!
                </p>
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:+15615767667"
              className="flex items-center justify-center gap-3 rounded-lg bg-primary text-white font-semibold py-4 px-5 shadow-sm hover:bg-primary-dark transition-colors"
              aria-label="Call My Horse Farm now"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M2.25 6.75A4.5 4.5 0 016.75 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423a1.125 1.125 0 01-.54 1.275l-1.964 1.123a11.26 11.26 0 005.852 5.852l1.123-1.964a1.125 1.125 0 011.275-.54l4.423 1.106c.501.125.852.575.852 1.091v1.372a4.5 4.5 0 01-4.5 4.5h-.75C9.514 21.75 2.25 14.486 2.25 5.25v-.75z" />
              </svg>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs font-normal opacity-90">Call for fastest answer</span>
                <span>(561) 576-7667</span>
              </div>
            </a>
            <a
              href="#quote-form"
              className="flex items-center justify-center gap-3 rounded-lg border-2 border-primary text-primary font-semibold py-4 px-5 hover:bg-green-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
              </svg>
              <span>Start Online Quote</span>
            </a>
          </div>

          <ul className="max-w-2xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
            {[
              "Instant price \u2014 no waiting",
              "Local, family-owned",
              "Flexible scheduling",
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* E-E-A-T: Experience \u2014 owner bio with image. Replace placeholder with real photo of Jose / crew. */}
          <section className="max-w-4xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <div
              role="img"
              aria-label="Photo of Jose, owner of My Horse Farm"
              className="w-full h-56 md:h-60 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500 text-center px-3"
            >
              [Image: Jose with crew<br />at a South Florida farm]
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-primary uppercase mb-2">Owner-Operated Since 2015</p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Hi, I&rsquo;m Jose. I run every job we quote.
              </h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                I&rsquo;ve been hauling manure, dropping dumpsters, and cleaning up equestrian properties across Palm Beach County for over 10 years. My son rides, so I understand the mess a working barn makes \u2014 and the standard a horse property has to hold. When you book with us, you get a quote from me, not a call center.
              </p>
            </div>
          </section>

          {/* E-E-A-T: Authority + Trust \u2014 stats and credentials. Update numbers as the business grows. */}
          <section className="max-w-4xl mx-auto mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { stat: "10+", label: "Years in South Florida" },
              { stat: "500+", label: "Jobs completed" },
              { stat: "6", label: "Palm Beach County cities served" },
              { stat: "A+", label: "Licensed & insured" },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-gray-200 rounded-lg px-3 py-4">
                <p className="text-2xl md:text-3xl font-bold text-primary leading-none">{item.stat}</p>
                <p className="text-xs text-gray-600 mt-1 leading-tight">{item.label}</p>
              </div>
            ))}
          </section>

          {/* AIDA: Interest \u2014 what we handle, with image placeholders. */}
          <section className="max-w-4xl mx-auto mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-1">What we handle</h2>
            <p className="text-sm text-gray-600 text-center mb-5 max-w-xl mx-auto">
              Every service priced on this page is work we do ourselves with our own trucks and crew.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { title: "Manure Removal", blurb: "Weekly, bi-weekly, or one-time hauls" },
                { title: "Dumpster Rental", blurb: "10\u201340 yard, dropped same week" },
                { title: "Junk Hauling", blurb: "Property cleanouts, estate cleanup" },
                { title: "Sod & Fill Dirt", blurb: "Graded, rolled, delivered" },
              ].map((svc) => (
                <div key={svc.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    role="img"
                    aria-label={`Photo of ${svc.title} service`}
                    className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 border-b border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-500 text-center px-2"
                  >
                    [Image: {svc.title}]
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{svc.title}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-snug">{svc.blurb}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AIDA: Desire + E-E-A-T: Trust \u2014 testimonials. Swap placeholders for real reviews w/ permission. */}
          <section className="max-w-4xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="flex text-amber-500" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434L10.788 3.21z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-700"><strong>4.9</strong> rating from local clients</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  quote: "Booked Monday, truck was here Wednesday. Paddock looked brand new. Price matched the quote exactly.",
                  name: "Sarah M.",
                  city: "Wellington, FL",
                },
                {
                  quote: "Used three other junk haulers in the past decade. Jose\u2019s crew was the first to show up when they said they would.",
                  name: "Mike R.",
                  city: "Loxahatchee, FL",
                },
                {
                  quote: "Ordered a 30-yard dumpster for a barn cleanout. Dropped, picked up, no surprise fees. I\u2019ll be calling again.",
                  name: "Diane T.",
                  city: "Royal Palm Beach, FL",
                },
              ].map((t) => (
                <figure key={t.name} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
                  <blockquote className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 flex items-center gap-3">
                    <div
                      role="img"
                      aria-label={`Photo of ${t.name}`}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-500 flex-shrink-0"
                    >
                      [Photo]
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.city}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* AIDA: Action \u2014 final nudge before form. */}
          <section className="max-w-2xl mx-auto mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Ready for your price?</h2>
            <p className="text-sm text-gray-600">
              Most quotes take under 2 minutes. Call <a href="tel:+15615767667" className="text-primary font-semibold hover:underline">(561) 576-7667</a> if you&rsquo;d rather talk it through.
            </p>
          </section>

          <div id="quote-form" className="scroll-mt-24">
            <QuoteForm services={services} referralCode={referralCode} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
