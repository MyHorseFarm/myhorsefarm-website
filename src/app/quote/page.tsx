import type { Metadata } from "next";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { getActiveServices } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Get an instant quote for manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental and farm repairs from My Horse Farm.",
  openGraph: {
    title: "Get a Free Quote | My Horse Farm",
    description:
      "Get an instant quote for manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental and farm repairs.",
    url: "https://www.myhorsefarm.com/quote",
  },
  twitter: {
    card: "summary",
    title: "Get a Free Quote | My Horse Farm",
    description:
      "Get an instant quote for manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental and farm repairs.",
  },
  alternates: {
    canonical: "https://www.myhorsefarm.com/quote",
  },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "My Horse Farm – Agricultural Services",
    description:
      "Manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental and farm repairs for equestrian properties in South Florida.",
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

export default async function QuotePage() {
  const services = await getActiveServices();

  return (
    <>
      <ServiceSchema />
      <main className="pt-20 pb-15 px-5 max-md:px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold max-md:text-2xl">
              Get a Free Quote
            </h1>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Select a service, tell us about your property, and get an instant price. Takes less than 2 minutes.
            </p>
          </div>
          <QuoteForm services={services} />
        </div>
      </main>
      <Footer />
    </>
  );
}
