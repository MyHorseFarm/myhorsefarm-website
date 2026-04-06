import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Post-Season Farm Repairs: What Wellington Horse Properties Need After WEF",
  description:
    "WEF season is over — here's what to inspect and repair on your Wellington horse farm. Fence repair, arena resurfacing, barn maintenance, and more. Expert checklist from My Horse Farm.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/blog/post-season-farm-repairs-wellington",
  },
  openGraph: {
    title: "Post-Season Farm Repairs: What Wellington Horse Properties Need After WEF",
    description:
      "WEF season is over — here's what to inspect and repair on your Wellington horse farm. Fence repair, arena resurfacing, barn maintenance, and more. Expert checklist from My Horse Farm.",
    type: "article",
    url: "https://www.myhorsefarm.com/blog/post-season-farm-repairs-wellington",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Post-Season Farm Repairs: What Wellington Horse Properties Need After WEF",
  description:
    "WEF season is over — here's what to inspect and repair on your Wellington horse farm. Fence repair, arena resurfacing, barn maintenance, and more. Expert checklist from My Horse Farm.",
  author: { "@type": "Organization", name: "My Horse Farm" },
  publisher: { "@type": "Organization", name: "My Horse Farm" },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
  url: "https://www.myhorsefarm.com/blog/post-season-farm-repairs-wellington",
  image: "https://www.myhorsefarm.com/images/hero-farm.jpg",
};

export default function PostSeasonFarmRepairsWellingtonPost() {
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
            Post-Season Farm Repairs: What Wellington Horse Properties Need
            After WEF
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            March 30, 2026 &middot; My Horse Farm Team
          </p>
        </div>
      </header>
      <main className="py-16 px-5 max-w-[800px] mx-auto max-md:py-10 max-md:px-4">
        <article className="prose-article">
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            The Winter Equestrian Festival runs from January through March,
            and for three months Wellington&apos;s horse farms operate at peak
            intensity. Horses ship in from around the world. Trailers roll in
            and out daily. Arenas get ridden on from dawn until dark. Barns
            are full, paddocks are in constant rotation, and every inch of
            your property is working harder than it does the rest of the year.
            Now that the season is wrapping up, it is time to walk your
            property with fresh eyes, identify the damage, and get everything
            repaired before Florida&apos;s summer storms make every problem
            worse.
          </p>
          <p className="text-gray-600 mb-6">
            Post-season farm maintenance is not optional in Wellington. The
            properties here are high-value assets, and the condition of your
            fencing, arenas, barns, and driveways directly affects your lease
            rates, your horses&apos; safety, and your bottom line. Here is
            what to inspect and fix right now.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Fence Inspection and Repair
          </h2>
          <p className="text-gray-600 mb-4">
            Fencing takes more abuse during WEF season than any other time of
            year. More horses means more wear &mdash; horses rub against
            boards, crib on top rails, lean on posts, and kick out panels.
            Three months of that pressure, combined with Florida&apos;s
            humidity and occasional winter rain, leaves most fence lines with
            at least a few problems that need attention.
          </p>
          <p className="text-gray-600 mb-4">
            Walk every fence line on your property. Check for cracked or
            broken boards, loose or leaning posts, sagging wire, and any
            sections where the rails have separated from the posts. Pay
            special attention to high-traffic areas &mdash; paddock gates,
            corners where horses congregate, and any run where horses tend to
            play or roughhouse. These spots take the hardest hits.
          </p>
          <p className="text-gray-600 mb-4">
            Wood board fencing is the Wellington standard, and it looks great
            when it is maintained. But wood rots, especially in South
            Florida&apos;s climate. Posts that were marginal before the season
            may now be soft at the base. Boards that had hairline cracks may
            now be split through. Replace rotten posts and damaged boards now,
            before summer rain accelerates the decay and a horse puts a leg
            through a weakened section.
          </p>
          <p className="text-gray-600 mb-6">
            Do not overlook the hardware. Gate latches wear out and stop
            catching properly. Hinges sag under the weight of heavy wooden
            gates. Automatic gate systems &mdash; common on Wellington
            equestrian properties &mdash; can develop electrical or mechanical
            issues from months of constant use. A gate that does not close
            securely is a loose horse waiting to happen.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Arena and Paddock Maintenance
          </h2>
          <p className="text-gray-600 mb-4">
            If your arena saw daily use during WEF season, the footing has
            taken a beating. Three months of intensive riding compacts the
            surface, pushes material to the edges, and creates uneven spots
            that affect both performance and safety. Low areas develop where
            traffic patterns concentrate &mdash; along the rail, at popular
            schooling spots, and around jump standards that stayed in the same
            position for weeks at a time.
          </p>
          <p className="text-gray-600 mb-4">
            Those low spots are more than a riding inconvenience. They collect
            water, and in a few months you will be dealing with daily
            afternoon thunderstorms that dump inches of rain in under an hour.
            An arena with drainage issues in March becomes an unusable swamp
            in July. Now is the time to regrade the surface, address any
            drainage problems, and add fresh footing material where it has
            worn thin or been displaced.
          </p>
          <p className="text-gray-600 mb-4">
            Paddocks need the same attention. Turnout horses are hard on
            everything &mdash; they chew fence boards, rub against posts, dig
            holes along fence lines, and wear down gate areas to bare dirt.
            Run-in sheds take abuse too: kicked walls, chewed edges, and roofs
            that may have shifted in winter wind events. Inspect every paddock
            for damage to fencing, shelters, water troughs, and ground
            surfaces. Fill holes and ruts before they become ankle-breaking
            hazards in soft summer ground.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Barn and Stall Repairs
          </h2>
          <p className="text-gray-600 mb-4">
            Stall doors and kick boards take the worst beating during season.
            Horses that are in heavy work, adjusting to a new environment, or
            simply stall-sour from a packed schedule will kick, paw, and push
            against stall walls with surprising force. After three months of
            that, check every stall for cracked kick boards, loose hardware,
            bent latches, and sliding doors that have jumped their tracks or
            no longer close flush.
          </p>
          <p className="text-gray-600 mb-4">
            Sliding stall doors are a common problem area. The tracks collect
            dirt and shavings, rollers wear out, and doors that slid smoothly
            in January now require two hands and a shoulder to move. Sticking
            doors are not just annoying &mdash; they are a safety issue. A
            door that does not open quickly can cost critical seconds during
            an emergency, and a door that does not latch properly means a
            horse can push its way out at night.
          </p>
          <p className="text-gray-600 mb-4">
            Inspect your barn roof carefully. Florida summer rain will find
            every weakness &mdash; every lifted shingle, every gap in the
            flashing, every spot where a seal has degraded. A small leak in
            April becomes a serious structural problem by September if water
            is allowed to penetrate the structure unchecked. Check the
            underside of your roof from inside the barn for daylight, water
            stains, and soft spots.
          </p>
          <p className="text-gray-600 mb-6">
            Gutters and downspouts need attention too. Clogged gutters
            overflow, sending water against walls and foundations where it
            causes erosion and rot. Clean them out, repair any damaged
            sections, and make sure water is being directed away from the
            barn and stall areas.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Driveway and Access Road Repairs
          </h2>
          <p className="text-gray-600 mb-4">
            Three months of heavy trailer traffic takes a toll on driveways
            and access roads. Potholes develop, edges erode, and gravel
            surfaces thin out in high-traffic areas. These issues get
            significantly worse once summer rain arrives, so address them
            now while the ground is dry and contractors are available.
          </p>
          <p className="text-gray-600 mb-6">
            Millings asphalt is an affordable and durable option for
            resurfacing farm driveways and parking areas. It compacts well,
            drains properly, and holds up to heavy equipment and trailer
            traffic.
          </p>

          <h2 className="text-xl font-bold text-primary-dark mt-10 mb-4">
            Schedule Your Post-Season Repairs Now
          </h2>
          <p className="text-gray-600 mb-6">
            The window between the end of WEF and the start of Florida&apos;s
            rainy season is short. Every repair you complete now prevents a
            bigger, more expensive problem later. Do not wait until summer
            storms expose every weakness on your property.
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-10">
            <h2 className="text-xl font-bold text-primary-dark mb-3">
              Need Post-Season Farm Repairs?
            </h2>
            <p className="text-gray-700 mb-4">
              My Horse Farm handles fence repair, arena resurfacing, barn
              maintenance, driveway work, and full property cleanouts for
              Wellington equestrian properties. Call us at{" "}
              <a href="tel:+15615767667" className="text-primary font-semibold hover:underline">(561) 576-7667</a>{" "}
              or{" "}
              <Link href="/quote" className="text-primary font-semibold hover:underline">
                request a free quote
              </Link>{" "}
              to get your farm back in shape.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
