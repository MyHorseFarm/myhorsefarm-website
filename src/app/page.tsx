import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqAccordion from "@/components/FaqAccordion";
import HubSpotCalendar from "@/components/HubSpotCalendar";
import HubSpotForm from "@/components/HubSpotForm";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  NAV_LINKS_HOME,
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
  PHONE_CELL,
  PHONE_CELL_TEL,
  EMAIL_SALES,
  EMAIL_FORM,
  SOCIAL,
  ADDRESS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Horse Farm – Agricultural Service Company",
  description:
    "My Horse Farm provides premier agricultural services for equestrians in Royal Palm Beach, Florida. We offer sod installation, millings asphalt delivery, manure bin rental and waste removal, fill dirt, dumpster rental and farm repairs.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/" },
  openGraph: {
    title:
      "My Horse Farm – Agricultural Service Company in Royal Palm Beach, FL",
    description:
      "Premier agricultural services for equestrians in Royal Palm Beach, FL. Sod installation, manure removal, junk removal, dumpster rental, fill dirt and farm repairs.",
    type: "website",
    url: "https://www.myhorsefarm.com/",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title:
      "My Horse Farm – Agricultural Service Company in Royal Palm Beach, FL",
    description:
      "Premier agricultural services for equestrians in Royal Palm Beach, FL. Sod installation, manure removal, junk removal, dumpster rental, fill dirt and farm repairs.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.myhorsefarm.com/#organization",
  name: "My Horse Farm",
  description:
    "My Horse Farm provides premier agricultural and equestrian services in Royal Palm Beach, Florida, including sod installation, manure removal, junk removal, dumpster rental, fill dirt delivery and farm repairs.",
  url: "https://www.myhorsefarm.com",
  logo: "https://www.myhorsefarm.com/logo.png",
  image: "https://www.myhorsefarm.com/logo.png",
  telephone: "(561) 576-7667",
  email: "sales@myhorsefarm.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Royal Palm Beach",
    addressRegion: "FL",
    postalCode: "33411",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Royal Palm Beach" },
    { "@type": "City", name: "Wellington" },
    { "@type": "City", name: "Loxahatchee" },
    { "@type": "City", name: "West Palm Beach" },
    { "@type": "City", name: "Palm Beach Gardens" },
  ],
  founder: {
    "@type": "Person",
    name: "Jose Gomez",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "(561) 576-7667",
    contactType: "customer service",
    availableLanguage: ["English", "Spanish"],
  },
  sameAs: [
    "https://www.facebook.com/myhorsefarmapp",
    "https://www.instagram.com/myhorsefarmservice/",
    "https://www.youtube.com/@horsedadtv9292",
    "https://www.google.com/maps/place/My+Horse+Farm/@26.6957151,-80.2033345,10z/data=!3m1!4b1!4m6!3m5!1s0x6826af3f1557e94b:0xcc8b36039075494b!8m2!3d26.695715!4d-80.2033345!16s%2Fg%2F11p00vldxb?entry=ttu",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Agricultural & Equestrian Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Sod Installation" },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Manure Bin & Waste Removal",
        },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Junk Removal" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Dumpster Rental" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Fill Dirt Delivery" },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Farm Repairs & Maintenance",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "1",
    bestRating: "5",
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What areas do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve Royal Palm Beach, Wellington, Loxahatchee, Loxahatchee Groves, West Palm Beach and Palm Beach Gardens. If you\u2019re in Palm Beach County and nearby, contact us \u2014 we may be able to accommodate your location.",
      },
    },
    {
      "@type": "Question",
      name: "How is pricing determined?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the type of service and scope of work. Junk removal starts at $75 per ton. For services like sod installation, fill dirt delivery, dumpster rental and manure removal, we provide custom quotes based on your specific needs. Contact us for a free estimate.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer same-day service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer same-day and next-day service for junk removal and many other services, subject to availability. Call us at (561) 576-7667 for urgent requests and we\u2019ll do our best to accommodate your schedule.",
      },
    },
    {
      "@type": "Question",
      name: "Are you licensed and insured?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. My Horse Farm is fully licensed and insured in the state of Florida. We comply with all Palm Beach County regulations for waste disposal, hauling and agricultural services.",
      },
    },
    {
      "@type": "Question",
      name: "How do I schedule a service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book online using our scheduling system on our website, call us at (561) 576-7667, or fill out the contact form. We\u2019ll confirm your appointment and answer any questions you have.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide manure bins, or do I need my own?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide leak-proof manure bins and dumpsters as part of our service. We deliver the container, schedule regular pickups and handle all disposal. You don\u2019t need to supply your own bin.",
      },
    },
    {
      "@type": "Question",
      name: "What makes your disposal eco-friendly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We dispose of waste at approved facilities and recycle materials whenever possible. For manure, we work with composting facilities. For junk removal, we sort items for recycling, donation and responsible disposal to minimize landfill impact.",
      },
    },
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "My Horse Farm",
  url: "https://www.myhorsefarm.com",
  publisher: {
    "@id": "https://www.myhorsefarm.com/#organization",
  },
};

const services = [
  {
    title: "Sod Installation",
    description:
      "Transform your paddocks and arenas with lush, durable sod. We deliver and install high-quality pallets to give your horses the best footing year\u2011round.",
  },
  {
    title: "Millings Asphalt Delivery",
    description:
      "Need to stabilize driveways or arenas? We deliver 20\u2011yard loads of recycled asphalt millings for a strong, cost\u2011effective base.",
  },
  {
    title: "Manure Bin & Waste Removal",
    description:
      "Keep your barns clean and odor\u2011free with our eco\u2011friendly manure bin rentals and scheduled waste removal services.",
  },
  {
    title: "Junk Removal",
    description:
      "Affordable junk removal starting at $75 per ton. Clear out yard waste, old furniture and farm debris quickly and sustainably.",
  },
  {
    title: "Fill Dirt",
    description:
      "High-quality fill dirt for leveling, berm construction and new paddock projects. We deliver directly to your property.",
  },
  {
    title: "Dumpster Rental",
    description:
      "Clear out clutter with our 20\u2011yard dumpsters\u2014perfect for farm cleanups, renovations and large projects.",
  },
  {
    title: "Repairs & Maintenance",
    description:
      "From fences and stalls to paddocks and driveways, our team keeps your farm facilities in top shape.",
  },
];

const metrics = [
  {
    title: "10+ Years Experience",
    description:
      "Serving horse farms across Palm Beach County with care and dedication.",
  },
  {
    title: "400+ Happy Clients",
    description:
      "Trusted by equestrian and residential customers alike.",
  },
  {
    title: "1,000+ Tons Hauled",
    description:
      "We've removed thousands of tons of debris and waste responsibly.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="My Horse Farm"
        tagline="Top-notch agricultural services for your equestrian needs"
        ctaText="Get a Quote"
        ctaHref="#contact"
      />

      <Navbar links={NAV_LINKS_HOME} />

      <main>
        {/* Metrics / Why Choose Us */}
        <section id="metrics" className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">Why Choose Us</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-5 max-md:grid-cols-1">
            {metrics.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                <h3 className="text-xl text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Services */}
        <section id="services" className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4">
          <h2 className="text-2xl max-md:text-xl">Our Services</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-5 max-md:grid-cols-1">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                <h3 className="text-xl text-primary mb-2">{svc.title}</h3>
                <p className="text-gray-600">{svc.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-center text-2xl max-md:text-xl">About Us</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Based in Royal Palm Beach, Florida, My Horse Farm specializes in
            comprehensive equestrian services&#8212;from installing lush sod and
            delivering recycled millings asphalt to providing manure bins, waste
            removal, high&#8209;quality fill dirt, dumpsters and skilled farm
            repairs. We&rsquo;re horse owners ourselves, so we know what horses
            (and their owners) need for safe, clean and functional spaces. We
            proudly sponsor local equestrian events and are committed to
            eco&#8209;friendly practices and exceptional service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder Bio */}
            <div className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <div className="font-bold text-lg text-gray-800">Jose Gomez</div>
              <div className="text-primary font-semibold mb-3">
                Founder, My Horse Farm Services
              </div>
              <p className="text-gray-600 leading-relaxed">
                With nearly 20 years in the livestock waste and equestrian
                support industry, Jose Gomez built My Horse Farm Services into a
                trusted name among farm owners, boarding facilities and property
                managers throughout Palm Beach County. What started as a hauling
                operation grew into a dependable service business centered around
                one core principle: consistency. Jose remains actively involved
                in operations, client relationships and strategic growth &#8212;
                bringing grit, hands-on leadership and a deep understanding of
                farm operations to every job.
              </p>
            </div>

            {/* Team Highlights */}
            <div className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <h3 className="text-xl text-primary mb-3">
                What Sets Our Team Apart
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  Horse owners who understand equestrian property needs
                </li>
                <li>
                  Over a decade of experience in Palm Beach County
                </li>
                <li>
                  Licensed, insured and compliant with local regulations
                </li>
                <li>
                  Committed to eco-friendly disposal and sustainable practices
                </li>
                <li>Proud sponsors of local equestrian events</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <FaqAccordion />

        {/* Calendar */}
        <HubSpotCalendar />

        {/* Contact */}
        <section id="contact" className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
          <h2 className="text-center text-2xl max-md:text-xl">Contact Us</h2>
          <p className="text-center text-gray-600 mb-8">
            Have questions or ready to book a service? Fill out the form below
            and we&rsquo;ll get back to you promptly.
          </p>

          <HubSpotForm />

          <ul className="list-none mt-8 space-y-3 max-w-[600px] mx-auto text-gray-700">
            <li>
              <i className="fas fa-phone text-primary mr-2" /> Office:{" "}
              <a
                href={`tel:${PHONE_OFFICE_TEL}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {PHONE_OFFICE}
              </a>
            </li>
            <li>
              <i className="fas fa-phone text-primary mr-2" /> Cell:{" "}
              <a
                href={`tel:${PHONE_CELL_TEL}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {PHONE_CELL}
              </a>
            </li>
            <li>
              <i className="fas fa-envelope text-primary mr-2" />{" "}
              <a
                href={`mailto:${EMAIL_FORM}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {EMAIL_FORM}
              </a>
            </li>
            <li>
              <i className="fas fa-envelope text-primary mr-2" />{" "}
              <a
                href={`mailto:${EMAIL_SALES}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {EMAIL_SALES}
              </a>
            </li>
            <li>
              <i className="fas fa-map-marker-alt text-primary mr-2" />{" "}
              {ADDRESS}
            </li>
            <li>
              <i className="fab fa-google text-primary mr-2" />{" "}
              <a
                href={SOCIAL.google}
                target="_blank"
                rel="noopener"
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Find Us on Google
              </a>
            </li>
          </ul>
        </section>
      </main>

      <Footer />

      {/* Structured Data */}
      <SchemaMarkup schema={localBusinessSchema} />
      <SchemaMarkup schema={faqPageSchema} />
      <SchemaMarkup schema={webSiteSchema} />

      {/* HubSpot Meetings Embed */}
      <Script
        src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
        strategy="afterInteractive"
      />
    </>
  );
}
