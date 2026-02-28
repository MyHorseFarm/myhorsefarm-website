import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteDisplay from "@/components/QuoteDisplay";
import { NAV_LINKS_SERVICE } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Quote",
  robots: "noindex",
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const { data: service } = await supabase
    .from("service_pricing")
    .select("display_name")
    .eq("service_key", quote.service_key)
    .single();

  return (
    <>
      <Navbar links={NAV_LINKS_SERVICE} />
      <main className="pt-20 pb-15 px-5 max-md:px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold max-md:text-2xl">Your Quote</h1>
            <p className="text-gray-600 mt-2">
              Review your quote and accept to schedule service.
            </p>
          </div>
          <QuoteDisplay
            quote={{
              ...quote,
              service_display_name: service?.display_name ?? quote.service_key,
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
