import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "How to Get Your Farm Season-Ready Before WEF",
  description:
    "A step-by-step guide to preparing your Wellington or Loxahatchee horse farm for the Winter Equestrian Festival. Covers manure setup, sod, fill dirt, repairs, and more.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/blog/get-farm-season-ready-wef",
  },
  openGraph: {
    title: "How to Get Your Farm Season-Ready Before WEF",
    description:
      "A step-by-step guide to preparing your horse farm for the Winter Equestrian Festival. Manure setup, sod, fill dirt, repairs, and more.",
    type: "article",
    url: "https://www.myhorsefarm.com/blog/get-farm-season-ready-wef",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Get Your Farm Season-Ready Before WEF",
  description:
    "A step-by-step guide to preparing your Wellington or Loxahatchee horse farm for the Winter Equestrian Festival.",
  author: { "@type": "Organization", name: "My Horse Farm" },
  publisher: { "@type": "Organization", name: "My Horse Farm" },
  datePublished: "2026-02-26",
  dateModified: "2026-02-26",
  url: "https://www.myhorsefarm.com/blog/get-farm-season-ready-wef",
  image: "https://www.myhorsefarm.com/images/hero-farm.jpg",
};

export default function SeasonReadyPost() {
  return (
    <>
      <SchemaMarkup schema={schema} />
      <header
        className="relative flex items-center justify-center text-white bg-cover bg-center h-[30vh] max-md:h-[25vh]"
        style={{ backgroundImage: "url('/images/hero-farm.jpg')" }}
      >
        <div className="text-center bg-black/50 p-5 rounded-lg">
          <Image
            src="/logo.png"
            alt="My Horse Farm logo"
            className="w-[80px] mx-auto mb-3"
            width={80}
            height={80}
          />
          <p className="text-accent text-sm mb-1">
            <Link href="/blog" className="text-accent hover:underline">
              Blog
            </Link>
          </p>
          <h1 className="text-2xl max-md:text-xl max-[480px]:text-lg my-1 max-w-[700px]">
            How to Get Your Farm Season-Ready Before WEF
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            February 26, 2026 &middot; My Horse Farm Team
          </p>
        </div>
      </header>
      <main className="py-16 px-5 max-w-[800px] mx-auto max-md:py-10 max-md:px-4">
        <article className="prose-article">
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            The Winter Equestrian Festival brings thousands of horses, riders,
            and trainers to Wellington and the surrounding areas every year. If
            you own or manage a farm that houses horses during season, the weeks
            leading up to WEF are your window to get everything in order &mdash;
            from waste management to paddock conditions to infrastructure
            repairs.
          </p>
          <p className="text-gray-600 mb-6">
            Here is a step-by-step checklist to make sure your property is ready
            before the first horse arrives.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Step 1: Set Up Manure Removal (October &ndash; November)
          </h2>
          <p className="text-gray-600 mb-4">
            This is the single most important thing to arrange early. During
            season, hauler availability tightens dramatically &mdash; companies
            that handle 20 loads per week in summer may be managing 75 to 100
            loads per week during WEF. If you wait until December, you may end
            up on a waiting list or stuck with an unreliable provider.
          </p>
          <h3 className="text-lg font-semibold text-primary-dark mt-6 mb-3">
            What to Do
          </h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              Contact your manure removal provider by October to confirm your
              schedule and bin size for the season.
            </li>
            <li>
              If you are new to the area or switching providers, get quotes from
              permitted haulers early. In Wellington, your hauler must hold a
              valid Commercial Livestock Waste Hauler Permit.
            </li>
            <li>
              Determine the right pickup frequency based on your expected stall
              count. Farms with 20+ stalls typically need weekly or twice-weekly
              pickup during season.
            </li>
            <li>
              Request leak-proof, covered bins. Open manure piles violate
              Wellington waste ordinances and attract flies.
            </li>
          </ul>
          <p className="text-gray-600 mb-6">
            <strong>Pro tip:</strong> Ask for weight tickets on every load. They
            serve as proof of proper disposal if you are ever inspected.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Step 2: Assess and Repair Fencing, Gates, and Stalls (October &ndash; November)
          </h2>
          <p className="text-gray-600 mb-4">
            Florida&apos;s heat, humidity, and summer storms take a toll on farm
            infrastructure. Before horses arrive, walk every fence line, gate,
            stall, and paddock on your property and note what needs attention.
          </p>
          <h3 className="text-lg font-semibold text-primary-dark mt-6 mb-3">
            Common Issues to Check
          </h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Fence boards:</strong> Cracked, rotted, or missing boards
              are a safety hazard. Replace before horses are turned out.
            </li>
            <li>
              <strong>Gate hardware:</strong> Hinges, latches, and chains wear
              out. A gate that does not close properly is an escape risk.
            </li>
            <li>
              <strong>Stall walls and floors:</strong> Check for protruding
              nails, splintered wood, and drainage issues. Stall mats should be
              level and intact.
            </li>
            <li>
              <strong>Barn roof and gutters:</strong> Leaks and clogged gutters
              cause water damage and create slippery surfaces inside the barn.
            </li>
            <li>
              <strong>Driveways and access roads:</strong> Potholes and eroded
              areas make trailer access difficult. Millings asphalt is an
              affordable resurfacing option.
            </li>
          </ul>
          <p className="text-gray-600 mb-6">
            Getting repairs done in October and November gives you a buffer. Once
            season starts, contractors and service providers are booked solid.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Step 3: Address Paddock and Pasture Conditions (November)
          </h2>
          <p className="text-gray-600 mb-4">
            Paddock quality directly impacts horse safety. Poor footing causes
            slips, strains, and soft tissue injuries. Florida&apos;s rainy
            season (June through October) often leaves paddocks uneven, muddy, or
            bare.
          </p>
          <h3 className="text-lg font-semibold text-primary-dark mt-6 mb-3">
            Options to Consider
          </h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Sod installation:</strong> For paddocks with bare or
              patchy ground, professional sod installation provides immediate
              coverage. We handle site preparation, grading, and soil
              conditioning before laying sod suited to Florida&apos;s climate.
            </li>
            <li>
              <strong>Fill dirt delivery:</strong> Low spots that collect water
              need to be built up before sod or gravel is laid. Screened fill
              dirt is the standard solution for leveling paddocks, building
              berms, and improving drainage.
            </li>
            <li>
              <strong>Arena resurfacing:</strong> If your riding arena has
              compacted or uneven footing, resurfacing with millings asphalt or
              proper footing material improves safety and performance.
            </li>
            <li>
              <strong>Drainage improvements:</strong> If water pools in paddocks
              or around the barn after rain, address grading issues before
              season. Standing water breeds mosquitoes and creates hoof problems.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Step 4: Deep Clean the Property (November &ndash; December)
          </h2>
          <p className="text-gray-600 mb-4">
            Before the season rush, do a full property cleanout. After months of
            off-season accumulation, most farms have debris, broken equipment,
            old fencing, and general clutter that needs to go.
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              Remove old fencing materials, broken equipment, and unused items
              from barns and storage areas.
            </li>
            <li>
              Clear overgrown vegetation along fence lines and around buildings.
            </li>
            <li>
              Haul away accumulated debris, old hay, and waste materials that
              have piled up over the off-season.
            </li>
            <li>
              Pressure wash barn aisles, wash racks, and common areas.
            </li>
          </ul>
          <p className="text-gray-600 mb-6">
            A clean property makes a strong first impression on seasonal
            tenants and clients, and it eliminates safety hazards before horses
            arrive.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Step 5: Confirm Service Providers (December)
          </h2>
          <p className="text-gray-600 mb-4">
            By December, you should have confirmed schedules with every
            service provider you rely on during season &mdash; farriers,
            veterinarians, feed suppliers, manure haulers, and maintenance
            crews. Do not assume your off-season arrangements carry over.
            Providers get booked fast once WEF approaches.
          </p>
          <p className="text-gray-600 mb-6">
            If you need farm maintenance, manure removal, sod installation,
            fill dirt delivery, or property cleanout services to get your
            farm season-ready, contact My Horse Farm early. We serve
            Wellington, Loxahatchee, and the surrounding equestrian
            communities.
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-10">
            <h2 className="text-xl font-bold text-primary-dark mb-3">
              Get Your Farm Ready for WEF
            </h2>
            <p className="text-gray-700 mb-4">
              My Horse Farm provides manure removal, sod installation, fill
              dirt delivery, fence repair, property cleanouts, and full farm
              maintenance for equestrian properties in Wellington,
              Loxahatchee, and the surrounding areas. Call us at{" "}
              <a href="tel:+15615767667" className="text-primary font-semibold hover:underline">(561) 576-7667</a>{" "}
              or{" "}
              <Link href="/quote" className="text-primary font-semibold hover:underline">
                request a free quote
              </Link>{" "}
              to get started.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
