import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Complete Guide to Wellington Manure Hauler Permits & Regulations",
  description:
    "Everything horse farm owners need to know about Wellington FL manure hauler permits, waste ordinances, approved disposal sites, and how to stay compliant year-round.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/blog/wellington-manure-hauler-permits",
  },
  openGraph: {
    title: "Complete Guide to Wellington Manure Hauler Permits & Regulations",
    description:
      "Everything horse farm owners need to know about Wellington FL manure hauler permits, waste ordinances, approved disposal sites, and how to stay compliant.",
    type: "article",
    url: "https://www.myhorsefarm.com/blog/wellington-manure-hauler-permits",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Complete Guide to Wellington Manure Hauler Permits & Regulations",
  description:
    "Everything horse farm owners need to know about Wellington FL manure hauler permits, waste ordinances, approved disposal sites, and how to stay compliant year-round.",
  author: { "@type": "Organization", name: "My Horse Farm" },
  publisher: { "@type": "Organization", name: "My Horse Farm" },
  datePublished: "2026-02-26",
  dateModified: "2026-02-26",
  url: "https://www.myhorsefarm.com/blog/wellington-manure-hauler-permits",
  image: "https://www.myhorsefarm.com/images/hero-farm.jpg",
};

export default function WellingtonPermitsPost() {
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
            Complete Guide to Wellington Manure Hauler Permits &amp; Regulations
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            February 26, 2026 &middot; My Horse Farm Team
          </p>
        </div>
      </header>
      <main className="py-16 px-5 max-w-[800px] mx-auto max-md:py-10 max-md:px-4">
        <article className="prose-article">
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            If you own or manage a horse farm in Wellington, Florida, manure
            management is not optional &mdash; it is regulated. The Village of
            Wellington sits within one of the largest equestrian communities in
            the world, and with 7,000 to 8,000 horses in residence during peak
            season, proper waste handling is critical for protecting water
            quality, controlling pests, and maintaining the community that makes
            Wellington special.
          </p>
          <p className="text-gray-600 mb-6">
            This guide covers everything you need to know about Wellington&apos;s
            manure hauler permits, waste ordinances, approved disposal locations,
            and how to stay compliant year-round.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Why Wellington Regulates Manure Disposal
          </h2>
          <p className="text-gray-600 mb-4">
            Wellington&apos;s Equestrian Preserve covers roughly 9,000 acres of
            western and southern Wellington. With over 60 private polo fields, 57
            miles of bridle trails, and thousands of stalls, the volume of
            livestock waste generated is enormous &mdash; especially during the
            Winter Equestrian Festival (WEF) from January through March.
          </p>
          <p className="text-gray-600 mb-4">
            Improperly managed manure can contaminate stormwater systems, leach
            nutrients into canals and wetlands, attract flies and rodents, and
            create odor issues for neighboring properties. Wellington&apos;s
            regulations exist to protect the environment, public health, and the
            equestrian lifestyle that drives the local economy.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            The Commercial Livestock Waste Hauler Permit
          </h2>
          <p className="text-gray-600 mb-4">
            Any company that commercially hauls livestock waste within the
            Village of Wellington must hold a valid{" "}
            <strong>Commercial Livestock Waste Hauler Permit</strong>. This is
            not optional &mdash; operating without one can result in fines and
            enforcement action.
          </p>
          <h3 className="text-lg font-semibold text-primary-dark mt-6 mb-3">
            Key Requirements
          </h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Valid permit:</strong> Haulers must obtain and maintain a
              current permit from the Village of Wellington.
            </li>
            <li>
              <strong>Containerization:</strong> All livestock waste must be
              stored in leak-proof, covered containers that prevent stormwater
              from entering or waste from leaking out.
            </li>
            <li>
              <strong>Covered transport:</strong> Waste must be covered during
              transport to prevent spillage on public roads.
            </li>
            <li>
              <strong>Approved disposal:</strong> Waste must be delivered to a
              Florida DEP-approved disposal or composting facility.
            </li>
            <li>
              <strong>Record-keeping:</strong> Haulers should maintain weight
              tickets and disposal records as proof of proper handling.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Manure Storage Best Practices
          </h2>
          <p className="text-gray-600 mb-4">
            Even if you hire a permitted hauler, your farm is responsible for how
            manure is stored on-site between pickups. Wellington&apos;s best
            management practices include:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Use leak-proof bins with lids:</strong> Open manure piles
              are a violation waiting to happen. Covered bins prevent rain from
              mixing with waste and creating contaminated runoff.
            </li>
            <li>
              <strong>Position bins away from waterways:</strong> Keep manure
              containers at least 100 feet from canals, swales, and drainage
              structures.
            </li>
            <li>
              <strong>Schedule regular pickups:</strong> Do not let waste
              accumulate beyond your container capacity. Weekly or bi-weekly
              pickups are standard for most farms.
            </li>
            <li>
              <strong>Prevent stormwater discharge:</strong> Your storage area
              should be graded so that rainwater flows away from the bins, not
              into them.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Approved Disposal Locations
          </h2>
          <p className="text-gray-600 mb-4">
            The Village of Wellington maintains a list of approved waste haulers
            and disposal locations. Waste must be taken to facilities that hold
            valid Florida Department of Environmental Protection (DEP) permits.
            These are typically composting operations or agricultural recycling
            facilities that convert manure into usable soil amendments.
          </p>
          <p className="text-gray-600 mb-4">
            At My Horse Farm, we dispose of all manure at DEP-approved
            composting facilities, turning waste into a resource rather than a
            landfill problem.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Common Violations and How to Avoid Them
          </h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Using an unpermitted hauler:</strong> Always verify your
              hauler holds a current Village of Wellington permit. The cheapest
              option is not always the legal option.
            </li>
            <li>
              <strong>Open or uncovered storage:</strong> Loose manure piles
              without containment are the most common violation. Invest in
              proper bins.
            </li>
            <li>
              <strong>Stormwater contamination:</strong> If runoff from your
              manure storage area reaches a canal or swale, you are liable.
              Proper grading and covered bins prevent this.
            </li>
            <li>
              <strong>Overfilled containers:</strong> Bins filled past capacity
              are considered uncovered waste. Schedule pickups before containers
              are full.
            </li>
            <li>
              <strong>Improper disposal:</strong> Dumping manure on
              unapproved land or in unauthorized locations can result in
              significant fines and environmental remediation costs.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            How My Horse Farm Stays Compliant
          </h2>
          <p className="text-gray-600 mb-4">
            My Horse Farm holds a valid Commercial Livestock Waste Hauler
            Permit from the Village of Wellington. We use leak-proof,
            covered containers, provide weight tickets for every load, and
            dispose of all waste at DEP-approved composting facilities.
          </p>
          <p className="text-gray-600 mb-6">
            We handle manure removal for farms of all sizes throughout
            Wellington, Loxahatchee, and the surrounding equestrian
            communities. Whether you need weekly service during WEF season
            or year-round pickup, we make compliance simple.
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-10">
            <h2 className="text-xl font-bold text-primary-dark mb-3">
              Need a Permitted Manure Hauler in Wellington?
            </h2>
            <p className="text-gray-700 mb-4">
              My Horse Farm provides fully permitted, compliant manure
              removal for horse farms in Wellington, Loxahatchee, and the
              surrounding areas. Call us at{" "}
              <a href="tel:+15615767667" className="text-primary font-semibold hover:underline">(561) 576-7667</a>{" "}
              or{" "}
              <Link href="/quote" className="text-primary font-semibold hover:underline">
                request a free quote
              </Link>{" "}
              to set up your service.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
