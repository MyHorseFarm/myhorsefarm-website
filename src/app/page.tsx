import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AnimatedStats from "@/components/AnimatedStats";
import WhyChooseUs from "@/components/WhyChooseUs";
import CtaBanner from "@/components/CtaBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqAccordion from "@/components/FaqAccordion";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
  EMAIL_SALES,
  SOCIAL,
  ADDRESS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Professional Dog Grooming in Austin, TX | Aaron's Dog Grooming",
  description:
    "Premium dog grooming services in Austin, TX. Full grooming, baths, nail trims, de-shedding & more. Certified groomers, natural products. Book today!",
  robots: "index, follow",
  authors: [{ name: "Aaron's Dog Grooming" }],
  openGraph: {
    title: "Aaron's Dog Grooming – Professional Dog Grooming in Austin, TX",
    description:
      "Your pup deserves the best. Full grooming, baths, nail trims, de-shedding treatments & spa packages. Certified groomers using natural, hypoallergenic products.",
    type: "website",
    siteName: "Aaron's Dog Grooming",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaron's Dog Grooming – Professional Dog Grooming in Austin, TX",
    description:
      "Your pup deserves the best. Full grooming, baths, nail trims, de-shedding treatments & spa packages. Certified groomers using natural, hypoallergenic products.",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.aaronsdoggrooming.com/#organization",
  name: "Aaron's Dog Grooming",
  description:
    "Aaron's Dog Grooming provides professional dog grooming services in Austin, Texas, including full grooming, baths, nail trims, de-shedding treatments, teeth brushing, and spa packages.",
  url: "https://www.aaronsdoggrooming.com",
  logo: "https://www.aaronsdoggrooming.com/logo.png",
  telephone: "(555) DOG-WASH",
  email: "info@aaronsdoggrooming.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Pawsome Lane",
    addressLocality: "Austin",
    addressRegion: "TX",
    postalCode: "78701",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Austin" },
    { "@type": "City", name: "Round Rock" },
    { "@type": "City", name: "Cedar Park" },
    { "@type": "City", name: "Pflugerville" },
    { "@type": "City", name: "Georgetown" },
  ],
  founder: { "@type": "Person", name: "Aaron" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "(555) DOG-WASH",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
  sameAs: [
    SOCIAL.facebook,
    SOCIAL.instagram,
    SOCIAL.youtube,
    SOCIAL.google,
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dog Grooming Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full Grooming" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bath & Brush" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Puppy's First Groom" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Nail Trim & Ear Clean" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "De-Shedding Treatment" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spa Package" } },
    ],
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
        text: "We're located in Austin, TX and serve the greater Austin area including Round Rock, Cedar Park, Pflugerville, Georgetown, and Lakeway.",
      },
    },
    {
      "@type": "Question",
      name: "How is pricing determined?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on your dog's breed, size, coat condition, and the services requested. A full grooming starts at $45 for small dogs. We provide transparent pricing before every appointment.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer same-day appointments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we keep a few slots open each day for same-day appointments, subject to availability.",
      },
    },
    {
      "@type": "Question",
      name: "Is Aaron's Dog Grooming licensed and insured?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We are fully licensed and insured. All of our groomers are professionally certified and trained in breed-specific grooming techniques and pet first aid.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book an appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book online using our scheduling system, call us directly, or fill out the contact form on our website.",
      },
    },
    {
      "@type": "Question",
      name: "What if my dog is anxious or aggressive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We specialize in handling anxious and nervous dogs. Aaron and our team use gentle, fear-free grooming techniques. We'll work at your dog's pace and take breaks as needed.",
      },
    },
    {
      "@type": "Question",
      name: "What products do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use premium, all-natural, hypoallergenic shampoos and conditioners that are safe for sensitive skin. All products are cruelty-free and eco-friendly.",
      },
    },
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aaron's Dog Grooming",
  url: "https://www.aaronsdoggrooming.com",
  publisher: { "@id": "https://www.aaronsdoggrooming.com/#organization" },
};

const services = [
  {
    title: "Full Grooming",
    description: "Complete grooming experience: bath, haircut, nail trim, ear cleaning, and styling tailored to your dog's breed.",
    href: "/full-grooming",
    price: "From $45",
    icon: "fas fa-cut",
  },
  {
    title: "Bath & Brush",
    description: "Refreshing bath with premium shampoo, blow dry, thorough brushing, and light detangling. Perfect between full grooms.",
    href: "/bath-and-brush",
    price: "From $30",
    icon: "fas fa-shower",
  },
  {
    title: "Puppy's First Groom",
    description: "Gentle introduction to grooming for puppies. We make the first experience positive and stress-free.",
    href: "/puppy-first-groom",
    price: "From $25",
    icon: "fas fa-paw",
  },
  {
    title: "Nail Trim & Ear Clean",
    description: "Quick nail trimming and ear cleaning service. Walk-ins welcome, no appointment needed.",
    href: "/nail-trim",
    price: "From $15",
    icon: "fas fa-hand-sparkles",
  },
  {
    title: "De-Shedding Treatment",
    description: "Specialized treatment to reduce shedding by up to 80%. Includes deep conditioning and undercoat removal.",
    href: "/de-shedding",
    price: "From $50",
    icon: "fas fa-wind",
  },
  {
    title: "Teeth Brushing",
    description: "Professional teeth brushing with pet-safe enzymatic toothpaste. Keep your pup's smile healthy and breath fresh.",
    href: "/teeth-brushing",
    price: "From $10",
    icon: "fas fa-tooth",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="Your Pup. Pampered."
        tagline="Professional dog grooming in Austin, TX. Certified groomers, natural products, and a stress-free experience your dog will love."
        ctaText="Book Now"
        ctaHref="#contact"
      />

      <main>
        {/* Stats + Trust Badges */}
        <AnimatedStats />

        {/* Social Proof Strip */}
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-yellow-400 text-sm" />
              ))}
            </div>
            <p className="text-gray-600 italic text-sm md:text-base">&ldquo;Aaron is absolutely amazing with our golden retriever. The attention to detail is incredible and our dog always comes out looking and smelling fantastic.&rdquo;</p>
            <p className="text-gray-400 text-xs mt-1">&mdash; Emily R., Austin, TX</p>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <i className="fas fa-scissors text-xs" />
                Our Services
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                Everything Your Pup Needs
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                From a simple nail trim to the full spa experience. Your dog deserves to look and feel their best.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <Link
                  key={svc.title}
                  href={svc.href}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover block p-6"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors">
                    <i className={`${svc.icon} text-primary text-xl`} />
                  </div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <span className="text-xs font-bold text-white bg-primary/90 px-3 py-1.5 rounded-full whitespace-nowrap">
                      {svc.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {svc.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Spa Package Featured Banner */}
            <Link
              href="/spa-package"
              className="group mt-6 flex flex-col md:flex-row bg-gradient-to-r from-primary to-primary-dark rounded-2xl overflow-hidden card-hover"
            >
              <div className="flex-shrink-0 md:w-1/3 bg-primary-dark/30 flex items-center justify-center p-10">
                <i className="fas fa-spa text-white/20 text-[80px]" />
              </div>
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center text-white">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest mb-2">
                  <i className="fas fa-crown text-xs" />
                  PREMIUM SERVICE
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">The Spa Package</h3>
                <p className="text-white/70 leading-relaxed max-w-lg">
                  The ultimate pampering experience. Full groom, blueberry facial, pawdicure, teeth brushing,
                  de-shedding treatment, and a bandana or bow. Your dog leaves looking like royalty.
                </p>
                <div className="mt-5 flex items-center gap-2 text-accent font-semibold">
                  View package details
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-28 bg-[#0f172a] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
              <p className="mt-4 text-lg text-white/50">Three easy steps to a happy, clean pup.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                { step: "01", title: "Book Online", desc: "Choose your service and pick a time that works for you. Same-day slots available.", icon: "fas fa-calendar-check" },
                { step: "02", title: "Drop Off Your Pup", desc: "Bring your dog in. We'll greet them with treats and get started right away.", icon: "fas fa-dog" },
                { step: "03", title: "Pick Up & Smile", desc: "Get a text when they're ready. Pick up a fresh, happy, tail-wagging pup.", icon: "fas fa-heart" },
              ].map((item, i) => (
                <div key={item.step} className="relative text-center md:text-left">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-white/10" />
                  )}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
                    <i className={`${item.icon} text-2xl text-accent`} />
                  </div>
                  <div className="text-xs font-bold text-accent tracking-widest mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light transition-all"
              >
                Book Your Appointment
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* About / Founder */}
        <section id="about" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                  <i className="fas fa-paw text-xs" />
                  Dog Lovers Caring for Dogs
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Where Every Dog<br />Is Treated Like Family.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6">
                  Aaron&apos;s Dog Grooming was born from a simple belief: every dog deserves
                  to be treated with love, patience, and expert care. Based in Austin, TX, we&apos;ve
                  been pampering pups since 2018 with a focus on gentle, fear-free grooming.
                </p>
                <p className="text-gray-500 leading-relaxed mb-8">
                  We use only natural, hypoallergenic products and our certified groomers are trained
                  in breed-specific techniques. Whether it&apos;s a nervous rescue or a show-ready poodle,
                  we treat every dog with the same care and attention.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Book Now
                  </Link>
                  <a
                    href={`tel:${PHONE_OFFICE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors"
                  >
                    <i className="fas fa-phone text-sm" />
                    Call Us
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                {/* Founder card */}
                <div className="bg-warm rounded-2xl p-7 border border-accent/15">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">Aaron</div>
                      <div className="text-sm font-medium text-primary mb-3">Founder &amp; Lead Groomer</div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        A lifelong dog lover and certified professional groomer, Aaron started
                        this business after years of working at corporate pet stores and
                        knowing dogs deserved better. He&apos;s groomed over 5,000 dogs and
                        specializes in anxious and senior dogs who need extra patience and care.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlight badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "fas fa-shield-halved", text: "Fully Licensed & Insured" },
                    { icon: "fas fa-leaf", text: "Natural Products Only" },
                    { icon: "fas fa-heart", text: "Fear-Free Certified" },
                    { icon: "fas fa-certificate", text: "Certified Groomers" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
                      <i className={`${item.icon} text-primary`} />
                      <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative image placeholder */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <i className="fas fa-dog text-primary/20 text-[80px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Proudly Serving the Austin Area
            </h2>
            <p className="text-gray-500 mb-8">Located in Austin, TX &mdash; just minutes from your neighborhood.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Austin",
                "Round Rock",
                "Cedar Park",
                "Pflugerville",
                "Georgetown",
                "Lakeway",
              ].map((area) => (
                <span key={area} className="text-sm font-medium text-gray-600 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                  <i className="fas fa-map-pin text-primary text-xs mr-2" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <FaqAccordion />

        {/* CTA Banner */}
        <CtaBanner />

        {/* Contact */}
        <section id="contact" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Book an Appointment</h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Ready to pamper your pup? Get in touch and we&apos;ll get your dog looking their best.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Jane Smith"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="(555) 123-4567"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="jane@email.com"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="dog-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Dog&apos;s Name</label>
                        <input
                          type="text"
                          id="dog-name"
                          name="dog-name"
                          placeholder="Buddy"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-1.5">Breed</label>
                        <input
                          type="text"
                          id="breed"
                          name="breed"
                          placeholder="Golden Retriever"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-1.5">Service</label>
                        <select
                          id="service"
                          name="service"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        >
                          <option value="">Select a service...</option>
                          <option value="full-grooming">Full Grooming</option>
                          <option value="bath-and-brush">Bath & Brush</option>
                          <option value="puppy-first-groom">Puppy&apos;s First Groom</option>
                          <option value="nail-trim">Nail Trim & Ear Clean</option>
                          <option value="de-shedding">De-Shedding Treatment</option>
                          <option value="teeth-brushing">Teeth Brushing</option>
                          <option value="spa-package">Spa Package</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Any special needs, preferred dates, or anything we should know about your dog..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      Request Appointment
                    </button>
                  </form>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "fas fa-phone", label: "Phone", value: PHONE_OFFICE, href: `tel:${PHONE_OFFICE_TEL}` },
                  { icon: "fas fa-envelope", label: "Email", value: EMAIL_SALES, href: `mailto:${EMAIL_SALES}` },
                  { icon: "fas fa-map-marker-alt", label: "Location", value: ADDRESS },
                  { icon: "fas fa-clock", label: "Hours", value: "Mon-Sat: 8am - 6pm" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                      <i className={`${item.icon} text-primary text-sm`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium text-gray-700">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
                <a
                  href={SOCIAL.google}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <i className="fab fa-google text-primary text-sm" />
                  </div>
                  <span className="text-sm font-semibold text-primary">Find Us on Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaMarkup schema={localBusinessSchema} />
      <SchemaMarkup schema={faqPageSchema} />
      <SchemaMarkup schema={webSiteSchema} />
    </>
  );
}
