import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "You've Been Referred!",
  description:
    "A friend recommended My Horse Farm for your property. Get $50 off your first service.",
  robots: "noindex",
};

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: referral } = await supabase
    .from("referrals")
    .select("referrer_name, referral_code, referee_discount_amount, status")
    .eq("referral_code", code)
    .single();

  if (!referral) notFound();

  const discount = Number(referral.referee_discount_amount) || 50;
  const referrerFirst = referral.referrer_name.split(" ")[0];
  const alreadyUsed = referral.status !== "pending";

  return (
    <>
      <main className="pt-24 pb-16 px-5 max-md:px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-6 py-8 text-white">
              <p className="text-sm opacity-80 mb-2">Referred by</p>
              <p className="text-2xl font-bold">{referrerFirst}</p>
            </div>

            <div className="p-8">
              {alreadyUsed ? (
                <>
                  <h1 className="text-2xl font-bold mb-3">
                    This Referral Has Been Used
                  </h1>
                  <p className="text-gray-600 mb-6">
                    This referral link has already been redeemed. You can still
                    get a quote at regular pricing.
                  </p>
                  <Link
                    href="/quote"
                    className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Get a Quote
                  </Link>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-gift text-primary text-2xl" />
                  </div>

                  <h1 className="text-2xl font-bold mb-3">
                    {referrerFirst} Thinks You&rsquo;ll Love Us
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {referrerFirst} recommended My Horse Farm for your property
                    services. As a thank-you, you get{" "}
                    <strong className="text-primary">${discount} off</strong>{" "}
                    your first service.
                  </p>

                  {/* Discount badge */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 mb-6 inline-block">
                    <p className="text-3xl font-bold text-amber-700">${discount} OFF</p>
                    <p className="text-sm text-amber-600">Your first service</p>
                  </div>

                  {/* Services list */}
                  <div className="text-left bg-gray-50 rounded-lg p-5 mb-6">
                    <p className="font-semibold text-sm mb-3">Our services include:</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-primary text-xs" />
                        Manure Removal &amp; Hauling
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-primary text-xs" />
                        Junk Removal &amp; Farm Cleanouts
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-primary text-xs" />
                        Sod Installation &amp; Fill Dirt
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-primary text-xs" />
                        Dumpster Rental &amp; Bin Service
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-primary text-xs" />
                        Farm Repairs &amp; Maintenance
                      </li>
                    </ul>
                  </div>

                  <Link
                    href={`/quote?ref=${encodeURIComponent(code)}`}
                    className="block w-full px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-center"
                  >
                    Get Your Discounted Quote
                  </Link>

                  <p className="text-xs text-gray-400 mt-4">
                    Discount applied automatically. Serving Wellington,
                    Loxahatchee, Royal Palm Beach &amp; surrounding areas.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Trust section */}
          <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 text-xs">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-shield-alt" />
              Insured
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fas fa-star" />
              5-Star Rated
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fas fa-check-circle" />
              Licensed
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Trusted by 400+ farm owners across South Florida
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
