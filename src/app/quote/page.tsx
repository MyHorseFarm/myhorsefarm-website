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

          <ul className="max-w-2xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
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

          <div id="quote-form" className="scroll-mt-24">
            <QuoteForm services={services} referralCode={referralCode} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
