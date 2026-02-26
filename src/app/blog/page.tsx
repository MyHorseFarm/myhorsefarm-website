import type { Metadata } from "next";
import Link from "next/link";
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
    headline: "Sod Installation for Horse Paddocks: What Florida Equestrians Need to Know",
    description: "A comprehensive guide to paddock sod installation in Florida. Covers the best sod types for equestrian use, site preparation, installation process, post-care schedules, common mistakes, and why professional installation makes the difference for horse safety.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/sod-installation-horse-paddocks",
  },
  {
    headline: "5 Signs Your Farm Needs a Full Property Cleanout",
    description: "Is clutter piling up on your farm? From overflowing barns to debris-covered paddocks, here are five clear signs it\u2019s time for a professional property cleanout \u2014 and what the process looks like from start to finish.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/signs-farm-needs-property-cleanout",
  },
  {
    headline: "Complete Guide to Wellington Manure Hauler Permits & Regulations",
    description: "Everything horse farm owners need to know about Wellington\u2019s manure hauler permits, waste ordinances, approved disposal sites, and how to stay compliant year-round. Covers the Commercial Livestock Waste Hauler Permit, storage best practices, common violations, and peak-season considerations.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/wellington-manure-hauler-permits",
  },
  {
    headline: "How to Get Your Farm Season-Ready Before WEF",
    description: "A step-by-step checklist for preparing your Wellington or Loxahatchee horse farm before the Winter Equestrian Festival. Covers manure setup, fence and stall repairs, paddock improvements with sod and fill dirt, property cleanout, and permit verification.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/get-farm-season-ready-wef",
  },
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
              {"slug" in post && post.slug ? (
                <Link href={post.slug} className="text-primary-dark hover:text-primary transition-colors no-underline">
                  {post.headline}
                </Link>
              ) : (
                post.headline
              )}
            </h3>
            <p itemProp="description">{post.description}</p>
            {"slug" in post && post.slug && (
              <Link href={post.slug} className="text-primary font-semibold hover:underline text-sm">
                Read full article &rarr;
              </Link>
            )}
            <meta itemProp="publisher" content="My Horse Farm" />
          </article>
        ))}
      </main>
      <Footer />
    </>
  );
}
