import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Referral Leaderboard | My Horse Farm",
  description:
    "Refer a friend to My Horse Farm and earn rewards. They get $50 off their first service, you get a reward. See our top referrers on the leaderboard.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/referrals" },
  openGraph: {
    title: "Referral Leaderboard | My Horse Farm",
    description:
      "Refer a friend to My Horse Farm and earn rewards. They get $50 off, you get rewarded. See our top referrers.",
    type: "website",
    url: "https://www.myhorsefarm.com/referrals",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Referral Leaderboard | My Horse Farm",
    description:
      "Refer a friend to My Horse Farm and earn rewards. They get $50 off, you get rewarded.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export const dynamic = "force-dynamic";

interface LeaderboardEntry {
  referrer_name: string;
  referral_count: number;
}

function getRankBadge(rank: number): { label: string; color: string } | null {
  if (rank === 1) return { label: "Gold", color: "bg-[#d4a843] text-[#1a3009]" };
  if (rank === 2) return { label: "Silver", color: "bg-gray-300 text-gray-800" };
  if (rank === 3) return { label: "Bronze", color: "bg-amber-700 text-white" };
  return null;
}

function getRankIcon(rank: number): string {
  if (rank === 1) return "fas fa-trophy";
  if (rank === 2) return "fas fa-medal";
  if (rank === 3) return "fas fa-award";
  return "";
}

function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] || "Anonymous";
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || "";
  return `${firstName} ${lastInitial}.`;
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("referrer_name")
      .eq("status", "completed");

    if (error || !data) return [];

    // Group by referrer_name and count
    const counts: Record<string, { name: string; count: number }> = {};
    for (const row of data) {
      const name = row.referrer_name;
      if (!counts[name]) {
        counts[name] = { name, count: 0 };
      }
      counts[name].count++;
    }

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map((entry) => ({
        referrer_name: entry.name,
        referral_count: entry.count,
      }));
  } catch {
    return [];
  }
}

export default async function ReferralsPage() {
  const leaderboard = await getLeaderboard();

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative bg-[#1a3009] text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d5016] via-[#1a3009] to-[#0f1f05] opacity-90" />
          <div className="relative max-w-[1100px] mx-auto px-5 py-20 text-center max-md:py-14 max-md:px-4">
            <span className="inline-block bg-[#d4a843] text-[#1a3009] font-bold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
              Referral Program
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-4 max-md:text-3xl">
              Refer a Friend, <span className="text-[#d4a843]">Earn Rewards</span>
            </h1>
            <p className="text-xl text-white/80 max-w-[700px] mx-auto mb-3 max-md:text-lg">
              Share the love. Your friend gets <strong className="text-white">$50 off</strong> their first service,
              and you earn a reward for every completed referral.
            </p>
            <p className="text-lg text-[#d4a843] font-semibold mb-8">
              The more you refer, the more you earn.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="#get-your-link"
                className="inline-block bg-[#d4a843] text-[#1a3009] font-bold text-lg px-8 py-4 rounded-lg hover:bg-[#c49a38] transition-colors no-underline"
              >
                Get Your Referral Link
              </a>
              <a
                href="#leaderboard"
                className="inline-block border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white/10 transition-colors no-underline"
              >
                View Leaderboard
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2d5016] mb-10 max-md:text-2xl">
              How the Referral Program Works
            </h2>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
              <div>
                <div className="w-14 h-14 bg-[#2d5016] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#2d5016] mb-2">
                  Share Your Link
                </h3>
                <p className="text-gray-600">
                  Send your personal referral link to friends, neighbors, or anyone
                  with a horse farm in the area.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 bg-[#2d5016] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#2d5016] mb-2">
                  They Save $50
                </h3>
                <p className="text-gray-600">
                  Your friend books a service of $300 or more and automatically gets
                  $50 off. No codes needed.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 bg-[#d4a843] text-[#1a3009] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#2d5016] mb-2">
                  You Get Rewarded
                </h3>
                <p className="text-gray-600">
                  Once their job is completed, you receive your referral reward.
                  The more you refer, the higher you climb on the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section
          id="leaderboard"
          className="bg-[#f8f5ee] py-16 px-5 max-md:py-10 max-md:px-4"
        >
          <div className="max-w-[700px] mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#2d5016] mb-3 max-md:text-2xl">
              Referral Leaderboard
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-[500px] mx-auto">
              Our top referrers who keep spreading the word about My Horse Farm.
            </p>

            {leaderboard.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#d4a843]/30 p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#2d5016]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-[#d4a843] text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-[#2d5016] mb-2">
                  Be the First on the Board
                </h3>
                <p className="text-gray-600 mb-6">
                  No referrals yet. Refer a friend today and claim the top spot.
                </p>
                <a
                  href="#get-your-link"
                  className="inline-block bg-[#d4a843] text-[#1a3009] font-bold px-6 py-3 rounded-lg hover:bg-[#c49a38] transition-colors no-underline"
                >
                  Start Referring
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#d4a843]/30 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_100px] bg-[#2d5016] text-white px-5 py-3 text-sm font-bold uppercase tracking-wide">
                  <span>Rank</span>
                  <span>Name</span>
                  <span className="text-right">Referrals</span>
                </div>

                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const badge = getRankBadge(rank);
                  const icon = getRankIcon(rank);

                  return (
                    <div
                      key={`${entry.referrer_name}-${rank}`}
                      className={`grid grid-cols-[60px_1fr_100px] items-center px-5 py-4 border-b border-gray-100 last:border-b-0 ${
                        rank <= 3 ? "bg-[#f8f5ee]/60" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center gap-2">
                        {badge ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${badge.color}`}
                          >
                            {rank}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                            {rank}
                          </span>
                        )}
                      </div>

                      {/* Name + Badge */}
                      <div className="flex items-center gap-3">
                        {icon && (
                          <i
                            className={`${icon} ${
                              rank === 1
                                ? "text-[#d4a843]"
                                : rank === 2
                                  ? "text-gray-400"
                                  : "text-amber-700"
                            }`}
                          />
                        )}
                        <span className="font-semibold text-[#1a3009]">
                          {maskName(entry.referrer_name)}
                        </span>
                        {badge && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        )}
                      </div>

                      {/* Count */}
                      <div className="text-right">
                        <span className="inline-block bg-[#2d5016]/10 text-[#2d5016] font-bold text-sm px-3 py-1 rounded-full">
                          {entry.referral_count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Get Your Link CTA */}
        <section
          id="get-your-link"
          className="bg-white py-16 px-5 max-md:py-10 max-md:px-4"
        >
          <div className="max-w-[700px] mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2d5016] mb-3 max-md:text-2xl">
              Get Your Referral Link
            </h2>
            <p className="text-gray-600 mb-8 max-w-[500px] mx-auto">
              Ready to start earning? Call or text us with your name and
              we&apos;ll set you up with a personal referral link you can share
              with friends.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 max-md:grid-cols-1">
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="flex items-center justify-center gap-3 bg-gradient-to-b from-[#f8f5ee] to-white border border-[#d4a843]/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow no-underline"
              >
                <div className="w-12 h-12 bg-[#2d5016] rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#2d5016]">Call Us</p>
                  <p className="text-sm text-gray-600">{PHONE_OFFICE}</p>
                </div>
              </a>

              <a
                href={`sms:${PHONE_OFFICE_TEL}?body=Hi! I'd like to get a referral link for My Horse Farm.`}
                className="flex items-center justify-center gap-3 bg-gradient-to-b from-[#f8f5ee] to-white border border-[#d4a843]/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow no-underline"
              >
                <div className="w-12 h-12 bg-[#d4a843] rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-comment-dots text-[#1a3009]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#2d5016]">Text Us</p>
                  <p className="text-sm text-gray-600">{PHONE_OFFICE}</p>
                </div>
              </a>
            </div>

            <p className="text-sm text-gray-500">
              Already have a link? Share it with friends and they can request a
              quote at{" "}
              <Link
                href="/quote"
                className="text-[#2d5016] font-semibold hover:underline"
              >
                myhorsefarm.com/quote
              </Link>{" "}
              with your referral code applied automatically.
            </p>
          </div>
        </section>

        {/* Rewards Breakdown */}
        <section className="bg-[#2d5016] text-white py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[900px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 max-md:text-2xl">
              What You Earn
            </h2>
            <p className="text-center text-white/70 mb-10 max-w-[500px] mx-auto">
              The more friends you refer, the better the rewards.
            </p>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-[#d4a843] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-gift text-[#1a3009] text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#d4a843] mb-1">
                  1st Referral
                </h3>
                <p className="text-white/80 text-sm">
                  $25 credit toward your next service
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-[#d4a843] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-gifts text-[#1a3009] text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#d4a843] mb-1">
                  3+ Referrals
                </h3>
                <p className="text-white/80 text-sm">
                  $50 credit per referral plus leaderboard recognition
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-[#d4a843] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-crown text-[#1a3009] text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#d4a843] mb-1">
                  Top Referrer
                </h3>
                <p className="text-white/80 text-sm">
                  Free service (up to $350 value) at the end of each quarter
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-[#d4a843] to-[#b8912e] text-[#1a3009] py-16 px-5 max-md:py-10 max-md:px-4">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 max-md:text-2xl">
              Know Someone Who Needs Farm Help?
            </h2>
            <p className="text-lg text-[#1a3009]/80 mb-8 max-w-[600px] mx-auto">
              Wellington, Royal Palm Beach, Loxahatchee, and surrounding areas.
              If they have a farm, we can help — and you both win.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="inline-block bg-[#2d5016] text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-[#1a3009] transition-colors no-underline"
              >
                Call to Get Your Link
              </a>
              <Link
                href="/quote"
                className="inline-block bg-white text-[#2d5016] font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors no-underline"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Fine Print */}
        <section className="bg-[#1a3009] text-white/50 py-8 px-5">
          <div className="max-w-[800px] mx-auto text-center text-xs leading-relaxed">
            <p>
              Referral rewards are issued as service credits after the referred
              customer&apos;s first job is completed and paid in full. $50 discount
              for referred customers applies to services totaling $300 or more
              before tax. Referral credits cannot be redeemed for cash. Quarterly
              top referrer prize is based on completed referrals within the
              calendar quarter; ties broken by earliest referral date. My Horse
              Farm reserves the right to modify or end this program at any time.
              Serving Wellington, Royal Palm Beach, Loxahatchee, West Palm Beach,
              and surrounding areas.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
