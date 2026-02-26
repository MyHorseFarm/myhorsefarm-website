import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NAV_LINKS_SERVICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog – My Horse Farm",
  description: "Read the My Horse Farm blog for tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/blog" },
  openGraph: {
    title: "Blog – My Horse Farm",
    description: "Tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
    type: "website",
    url: "https://www.myhorsefarm.com/blog",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Blog – My Horse Farm",
    description: "Tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

const blogNavLinks = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Schedule", href: "/#calendar" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

const posts = [
  {
    headline: "Benefits of Proper Manure Management",
    description: "Keeping barns clean isn\u2019t just about aesthetics\u2014it\u2019s essential for horse health and environmental stewardship. In this post, we explore why regular manure removal prevents pests, reduces odors and improves pasture quality. You\u2019ll learn practical tips for composting and how our manure bin service can simplify the process.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
  },
  {
    headline: "Maintaining Safe, Lush Paddocks",
    description: "A well\u2011kept paddock provides sure footing and reduces risk of injury. Discover how sod installation and regular resurfacing with millings asphalt can make arenas safer and more comfortable for your horses. We also share seasonal maintenance advice to keep grass thriving in Florida\u2019s climate.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
  },
  {
    headline: "Eco\u2011Friendly Equestrian Practices",
    description: "From reducing runoff to recycling materials, sustainability is part of modern farm management. Learn how choosing recycled asphalt millings, scheduling waste removal, and using high\u2011quality fill dirt can reduce your environmental impact while improving your facilities.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
  },
  {
    headline: "Essential Equipment for Farm Maintenance",
    description: "Running a farm requires the right tools. We look at indispensable equipment\u2014like dumpsters for clean\u2011ups, compact tractors for hauling, and the right fencing materials\u2014to keep your property in peak condition. Plus, when to call in the pros for repairs or upgrades.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
  },
];

export default function BlogPage() {
  return (
    <>
      <Hero
        title="Our Blog"
        tagline="Insights and tips for horse owners and farm managers"
        ctaText="Contact Us"
        ctaHref="/#contact"
      />
      <Navbar links={blogNavLinks} />
      <main className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
        <h2 className="text-2xl max-md:text-xl">Latest Posts</h2>
        {posts.map((post) => (
          <article
            key={post.headline}
            className="bg-white rounded-lg p-5 shadow-[0_2px_4px_rgba(0,0,0,0.1)] mb-5 hover:-translate-y-1 transition-transform"
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2.5 max-md:flex-col max-md:gap-1">
              <span
                className="font-semibold text-primary-dark"
                itemProp="author"
                itemScope
                itemType="https://schema.org/Organization"
              >
                <i className="fas fa-user" />{" "}
                <span itemProp="name">My Horse Farm Team</span>
              </span>
              <span
                className="text-gray-400"
                itemProp="datePublished"
                content={post.dateValue}
              >
                <i className="fas fa-calendar" /> {post.date}
              </span>
            </div>
            <h3 className="mt-0 text-primary-dark" itemProp="headline">
              {post.headline}
            </h3>
            <p itemProp="description">{post.description}</p>
            <meta itemProp="publisher" content="My Horse Farm" />
          </article>
        ))}
      </main>
      <Footer />
    </>
  );
}
