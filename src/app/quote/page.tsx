import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { NAV_LINKS_SERVICE } from "@/lib/constants";
import { getActiveServices } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Get an instant quote for manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental and farm repairs from My Horse Farm.",
};

export default async function QuotePage() {
  const services = await getActiveServices();

  return (
    <>
      <Navbar links={NAV_LINKS_SERVICE} />
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
