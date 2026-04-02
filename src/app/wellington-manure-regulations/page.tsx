import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title:
    "Wellington & Palm Beach County Manure Regulations Guide | My Horse Farm",
  description:
    "Complete guide to Wellington manure ordinances, Palm Beach County waste hauling permits, storage rules, and compliance requirements for equestrian properties.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: {
    canonical:
      "https://www.myhorsefarm.com/wellington-manure-regulations",
  },
  openGraph: {
    title:
      "Wellington & Palm Beach County Manure Regulations Guide",
    description:
      "Complete guide to Wellington manure ordinances, Palm Beach County waste hauling permits, storage rules, and compliance for equestrian properties.",
    type: "website",
    url: "https://www.myhorsefarm.com/wellington-manure-regulations",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title:
      "Wellington & Palm Beach County Manure Regulations Guide",
    description:
      "Complete guide to Wellington manure ordinances, Palm Beach County waste hauling permits, storage rules, and compliance for equestrian properties.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

const faqs = [
  {
    question:
      "Do I need a permit to haul manure from my Wellington property?",
    answer:
      "If you are hauling manure commercially in Wellington or Palm Beach County, you need a Commercial Livestock Waste Hauler Permit issued through the county. Private property owners who transport their own waste in small quantities may be exempt, but most equestrian operations rely on a permitted hauler to stay compliant. My Horse Farm holds all required permits so you don't have to worry about the paperwork.",
  },
  {
    question:
      "How often does Wellington require manure to be picked up during WEF season?",
    answer:
      "During the Winter Equestrian Festival season (typically January through March), Wellington strongly encourages more frequent waste pickups due to the higher concentration of horses in the area. Many facilities move to twice-weekly or even daily service during peak season. Outside of WEF, weekly or bi-weekly pickups are standard for most barns. The exact frequency depends on the number of horses and your manure management plan.",
  },
  {
    question:
      "What are the fines for not following Wellington manure regulations?",
    answer:
      "The Village of Wellington enforces its equestrian waste ordinances through its code enforcement division. Violations can result in fines that increase with repeated offenses, and properties may be subject to daily penalties until the issue is resolved. The exact amount depends on the nature and severity of the violation. The simplest way to avoid fines is to work with a compliant hauler and maintain proper storage on your property.",
  },
  {
    question:
      "Can I compost manure on my own property in Palm Beach County?",
    answer:
      "On-site composting is allowed on agricultural-zoned properties in Palm Beach County, but it must be done in a way that prevents runoff, odor complaints, and groundwater contamination. You need to maintain proper setback distances from property lines and waterways, turn the compost regularly, and ensure it does not attract pests. Properties in Loxahatchee and Loxahatchee Groves tend to have more flexibility for composting than those within Wellington's village limits.",
  },
  {
    question:
      "What kind of manure storage containers does Wellington require?",
    answer:
      "Wellington requires that manure be stored in leak-proof, covered containers that prevent runoff and odor. Open piles on the ground are not acceptable. Containers must be placed at required setback distances from property lines, wells, and waterways. My Horse Farm provides leak-proof bins that meet all village storage requirements as part of our service.",
  },
  {
    question:
      "Are the rules different in Loxahatchee compared to Wellington?",
    answer:
      "Yes. Loxahatchee and Loxahatchee Groves are unincorporated areas under Palm Beach County jurisdiction rather than the Village of Wellington. They have more relaxed agricultural zoning, which gives property owners more flexibility for on-site composting and waste management. However, county-level environmental regulations still apply, including rules about water quality, runoff prevention, and proper disposal. If you operate in either area, you still need to follow Palm Beach County solid waste and environmental guidelines.",
  },
];

export default function WellingtonManureRegulationsPage() {
  return (
    <>
      <Hero
        short
        title="Wellington & Palm Beach County Manure Regulations"
        tagline="A complete compliance guide for equestrian property owners"
      />
      <main className="py-16 px-5 max-w-[900px] mx-auto max-md:py-10 max-md:px-4">
        {/* Intro */}
        <p className="text-lg leading-relaxed mb-6">
          Managing manure on an equestrian property in South Florida is not
          just about keeping things clean — it is a legal obligation. The
          Village of Wellington, Palm Beach County, and surrounding
          communities like Loxahatchee and Loxahatchee Groves each have
          their own regulations governing how horse waste must be stored,
          transported, and disposed of. Failing to comply can mean fines,
          code enforcement actions, and environmental damage to the
          waterways and wetlands that surround the equestrian corridor.
        </p>
        <p className="leading-relaxed mb-10">
          This guide breaks down everything equestrian property owners need
          to know about manure regulations in the greater Wellington area.
          Whether you own a small private barn or manage a large training
          facility, understanding these rules is essential — especially
          during the busy Winter Equestrian Festival season when
          enforcement is at its highest.
        </p>

        {/* Section 1: Wellington Ordinances */}
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-12 mb-4">
          Village of Wellington Manure Ordinances
        </h2>
        <p className="leading-relaxed mb-4">
          Wellington is the epicenter of South Florida&apos;s equestrian
          world. With thousands of horses in residence during peak season,
          the village has adopted specific ordinances to manage the volume
          of waste generated by its equestrian community. These rules are
          enforced by the Village of Wellington Code Compliance Division and
          apply to all properties within village limits that house horses
          or other livestock.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Manure Management Plans
        </h3>
        <p className="leading-relaxed mb-4">
          Wellington requires equestrian properties to maintain a manure
          management plan that outlines how waste will be collected, stored,
          and removed. This plan should account for the number of horses on
          the property, the type and size of storage containers used, the
          frequency of pickups, and the name of the permitted waste hauler
          responsible for removal. Properties that host visiting horses
          during WEF season should update their plan to reflect the
          temporary increase in waste volume.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Commercial Livestock Waste Hauler Permits
        </h3>
        <p className="leading-relaxed mb-4">
          Any company that commercially transports livestock waste within
          Palm Beach County must hold a valid Commercial Livestock Waste
          Hauler Permit. This permit ensures that haulers follow approved
          routes, use proper vehicles, and dispose of waste at authorized
          facilities. Property owners should always verify that their
          hauler is currently permitted — using an unpermitted service can
          put the property owner at risk of violations as well. My Horse
          Farm is a fully permitted commercial waste hauler operating
          throughout Palm Beach County, so our customers never have to
          worry about permit compliance.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Manure Storage Requirements
        </h3>
        <p className="leading-relaxed mb-4">
          Wellington mandates that all manure be stored in leak-proof,
          covered containers. Open piles, uncovered dumpsters, and ground
          storage are prohibited. Containers must be positioned at
          appropriate setback distances from property lines, wells, canals,
          and other waterways to prevent contamination. The goal is to
          eliminate runoff during heavy rain events — a common concern in
          South Florida&apos;s subtropical climate where sudden downpours
          can wash untreated waste into the local water table.
        </p>
        <p className="leading-relaxed mb-4">
          The size of your storage container should match the volume of
          waste your operation produces. A five-stall private barn
          generates far less waste than a 40-stall training facility, and
          the village expects your storage solution to be proportional. If
          your container overflows between pickups, that is considered a
          violation.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Pickup Frequency: WEF Season vs. Off-Season
        </h3>
        <p className="leading-relaxed mb-4">
          During the Winter Equestrian Festival — which typically runs from
          January through late March — the horse population in Wellington
          can more than double. This surge creates significantly more waste,
          and the village expects property owners to increase their pickup
          frequency accordingly. Many barns move from weekly service to
          twice-weekly or even daily pickups during this period.
        </p>
        <p className="leading-relaxed mb-4">
          During the off-season (April through December), weekly or
          bi-weekly pickups are standard for most operations. However, the
          appropriate frequency always depends on the number of horses, the
          type of bedding used, and the size of your storage containers.
          Shavings-based bedding produces significantly more volume than
          straw, which should be factored into your pickup schedule.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Enforcement and Fines
        </h3>
        <p className="leading-relaxed mb-4">
          Wellington takes manure compliance seriously. The village&apos;s
          code enforcement officers conduct regular inspections,
          particularly during the winter competition season. Violations can
          include improper storage, overflowing containers, use of
          unpermitted haulers, failure to maintain a manure management plan,
          and illegal dumping. Fines may be assessed per violation and can
          increase with repeated offenses. In some cases, daily penalties
          may apply until the property is brought back into compliance.
          Beyond financial penalties, repeated violations can affect a
          property&apos;s standing with the village and complicate future
          permitting.
        </p>

        {/* Section 2: PBC Regulations */}
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-14 mb-4">
          Palm Beach County Regulations
        </h2>
        <p className="leading-relaxed mb-4">
          In addition to Wellington&apos;s village-level rules, Palm Beach
          County has its own layer of solid waste and environmental
          regulations that apply to all equestrian properties in the
          county, including those in unincorporated areas like Loxahatchee
          and Loxahatchee Groves.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Solid Waste Disposal Regulations
        </h3>
        <p className="leading-relaxed mb-4">
          Palm Beach County classifies livestock manure as solid waste.
          Commercial haulers must transport it to approved disposal or
          composting facilities — dumping on vacant lots, in canals, or at
          unauthorized sites is illegal and subject to significant
          penalties. The county&apos;s Solid Waste Authority oversees
          disposal standards and monitors licensed facilities to ensure
          they meet environmental requirements.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Agricultural Exemptions
        </h3>
        <p className="leading-relaxed mb-4">
          Properties classified as bona fide agricultural operations under
          Florida statute may qualify for certain exemptions from standard
          solid waste rules. For example, agricultural properties may be
          allowed to compost manure on-site or spread it on fields as
          fertilizer, provided they follow best management practices
          established by the Florida Department of Agriculture and Consumer
          Services. However, these exemptions do not override
          environmental protections — agricultural operations must still
          comply with water quality standards and runoff prevention
          measures.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Environmental Compliance and Water Quality
        </h3>
        <p className="leading-relaxed mb-4">
          Palm Beach County sits within the South Florida Water Management
          District, and the region&apos;s network of canals, wetlands, and
          the Everglades makes water quality a top regulatory priority.
          Equestrian properties must ensure that manure storage and
          disposal practices do not contribute to nutrient loading in local
          waterways. Nitrogen and phosphorus from decomposing manure can
          cause algae blooms and degrade water quality in the
          Loxahatchee River basin, the C-51 canal, and other connected
          systems.
        </p>
        <p className="leading-relaxed mb-4">
          To meet these standards, property owners should use impervious
          storage containers, maintain vegetative buffers around manure
          storage areas, and ensure that wash-down water from barns does
          not carry waste into drainage ditches or swales. The South
          Florida Water Management District and the Florida Department of
          Environmental Protection can both conduct inspections and issue
          violations for properties that contribute to water quality
          degradation.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          Required Permits for Commercial Hauling
        </h3>
        <p className="leading-relaxed mb-4">
          At the county level, commercial livestock waste haulers must
          maintain valid business licenses, vehicle registrations, and
          proof of insurance. Haulers must use vehicles equipped to prevent
          spillage during transport — open-bed trucks without tarps or
          liners are not acceptable. The county also requires that
          commercial haulers maintain records of each pickup, including the
          property address, date, volume, and disposal destination. As a
          property owner, you have the right to request these records from
          your hauler to verify that your waste is being disposed of
          properly.
        </p>

        {/* Section 3: Loxahatchee */}
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-14 mb-4">
          Loxahatchee &amp; Loxahatchee Groves Regulations
        </h2>
        <p className="leading-relaxed mb-4">
          Loxahatchee and Loxahatchee Groves occupy a unique regulatory
          space. As unincorporated communities within Palm Beach County,
          they do not have the village-level ordinances that Wellington
          imposes. Instead, they fall under Palm Beach County jurisdiction,
          which generally provides more flexibility for agricultural
          operations.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          More Relaxed Agricultural Zoning
        </h3>
        <p className="leading-relaxed mb-4">
          Much of Loxahatchee and Loxahatchee Groves is zoned
          agricultural-residential (AR), which grants property owners
          broader rights to manage livestock waste on their own land. Many
          properties in these areas have enough acreage to compost on-site
          or spread manure on pastures without running into setback issues.
          This makes waste management simpler for some property owners, but
          it does not eliminate the need for responsible practices.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          County Environmental Rules Still Apply
        </h3>
        <p className="leading-relaxed mb-4">
          Even though zoning is more permissive, the same Palm Beach County
          environmental regulations apply. Manure cannot be stockpiled in a
          way that creates runoff into neighboring properties, canals, or
          wetlands. Properties near the Loxahatchee National Wildlife Refuge
          or the Arthur R. Marshall Loxahatchee National Wildlife Refuge
          face particular scrutiny because of their proximity to protected
          ecosystems. Code enforcement complaints from neighbors about
          odor, flies, or runoff can still trigger county inspections and
          potential violations.
        </p>

        <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-3">
          On-Site Composting Guidelines
        </h3>
        <p className="leading-relaxed mb-4">
          Composting horse manure on agricultural property in Loxahatchee
          is permitted, but it should be managed correctly. Best practices
          include maintaining compost piles at least 100 feet from wells
          and 50 feet from property lines, turning the pile regularly to
          accelerate decomposition and reduce odor, covering or containing
          the pile to prevent rainwater from leaching nutrients into the
          soil, and monitoring for pest activity. Properly composted horse
          manure breaks down into a nutrient-rich soil amendment that can
          be used on pastures and gardens, which many Loxahatchee property
          owners see as an advantage of the area&apos;s more flexible
          zoning.
        </p>

        {/* Section 4: How My Horse Farm Helps */}
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-14 mb-4">
          How My Horse Farm Keeps You Compliant
        </h2>
        <p className="leading-relaxed mb-4">
          Navigating the patchwork of village, county, and state
          regulations can be overwhelming — especially if you are new to
          the area or managing multiple properties. That is where My Horse
          Farm comes in. We have been serving the Wellington equestrian
          community for over a decade, and regulatory compliance is built
          into every aspect of our service.
        </p>
        <ul className="pl-5 leading-relaxed mb-6 space-y-2">
          <li>
            <strong>Fully permitted and insured.</strong> We hold all
            required Commercial Livestock Waste Hauler Permits and maintain
            current business licenses, vehicle registrations, and insurance
            coverage. When you work with us, your property is automatically
            in compliance with hauling requirements.
          </li>
          <li>
            <strong>Leak-proof bins that meet all storage rules.</strong>{" "}
            We provide covered, leak-proof containers sized to your
            operation — from compact bins for small barns to large
            dumpsters for training facilities. Every container we deliver
            meets Wellington&apos;s storage ordinance requirements.
          </li>
          <li>
            <strong>Flexible scheduling for every season.</strong> We
            adjust pickup frequency during WEF season so your property
            never falls behind on waste removal. Our scheduling team
            monitors your account and recommends changes when your horse
            count fluctuates.
          </li>
          <li>
            <strong>Proper disposal at approved facilities.</strong> All
            waste we collect is transported to authorized composting and
            disposal sites. We maintain full documentation of every pickup
            and disposal, which is available to our customers on request.
          </li>
          <li>
            <strong>We handle the paperwork.</strong> Need documentation
            for a code enforcement inquiry or a property inspection? We
            provide pickup logs, permit copies, and compliance records so
            you have everything you need.
          </li>
        </ul>

        {/* Section 5: Compliance Checklist */}
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-14 mb-4">
          Manure Compliance Checklist for Farm Owners
        </h2>
        <p className="leading-relaxed mb-4">
          Use this checklist to make sure your equestrian property meets
          current regulations in Wellington and Palm Beach County. If you
          are unsure about any item, give us a call and we will help you
          sort it out.
        </p>
        <div className="bg-surface-alt rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
          <ul className="space-y-3">
            {[
              "Manure management plan is documented and up to date",
              "Storage containers are leak-proof and covered",
              "Containers are positioned at required setback distances from property lines, wells, and waterways",
              "Pickup frequency matches your current horse count (increase during WEF season)",
              "Your waste hauler holds a valid Commercial Livestock Waste Hauler Permit",
              "Hauler provides proper disposal documentation upon request",
              "Barn wash-down water does not flow into drainage ditches or canals",
              "Vegetative buffers are maintained around manure storage areas",
              "If composting on-site, compost is turned regularly and contained to prevent runoff",
              "No manure is stockpiled in open, uncovered piles on the ground",
              "Contact information for your hauler is posted or easily accessible for inspectors",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded border-2 border-primary/40" />
                <span className="text-sm leading-relaxed text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 6: FAQ */}
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-14 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="border-b border-gray-100 last:border-b-0 group"
            >
              <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                <span className="flex-1 text-base font-semibold text-gray-800">
                  {faq.question}
                </span>
                <svg
                  className="w-5 h-5 text-primary shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading mb-3">
            Stay Compliant Without the Hassle
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Let My Horse Farm handle your manure removal so you never have
            to worry about permits, storage rules, or pickup schedules.
            Get a free quote today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-colors"
            >
              Get a Free Quote
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="tel:+15615767667"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold text-lg rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fas fa-phone text-sm" />
              (561) 576-7667
            </a>
          </div>
        </div>
      </main>
      <Footer />

      {/* Service Schema */}
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Manure Removal & Compliance",
          provider: {
            "@type": "LocalBusiness",
            "@id": "https://www.myhorsefarm.com/#organization",
            name: "My Horse Farm",
            image: "https://www.myhorsefarm.com/images/hero-farm.jpg",
            telephone: "(561) 576-7667",
            email: "sales@myhorsefarm.com",
            priceRange: "$$",
            url: "https://www.myhorsefarm.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Royal Palm Beach",
              addressRegion: "FL",
              postalCode: "33411",
              addressCountry: "US",
            },
          },
          areaServed: [
            { "@type": "City", name: "Wellington" },
            { "@type": "City", name: "Loxahatchee" },
            { "@type": "City", name: "Loxahatchee Groves" },
            { "@type": "AdministrativeArea", name: "Palm Beach County" },
          ],
          description:
            "Complete guide to manure regulations and compliance services for equestrian properties in Wellington, Loxahatchee, and Palm Beach County, FL.",
        }}
      />

      {/* BreadcrumbList Schema */}
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.myhorsefarm.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Wellington Manure Regulations",
              item: "https://www.myhorsefarm.com/wellington-manure-regulations",
            },
          ],
        }}
      />

      {/* FAQPage Schema */}
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />
    </>
  );
}
