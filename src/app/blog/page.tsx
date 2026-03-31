import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the My Horse Farm blog for tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/blog" },
  openGraph: {
    title: "Blog",
    description:
      "Tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
    type: "website",
    url: "https://www.myhorsefarm.com/blog",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Blog",
    description:
      "Tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

// Hardcoded posts that also have static page.tsx files
const staticPosts = [
  {
    title:
      "Sod Installation for Horse Paddocks: What Florida Equestrians Need to Know",
    description:
      "A comprehensive guide to paddock sod installation in Florida. Covers the best sod types for equestrian use, site preparation, installation process, post-care schedules, common mistakes, and why professional installation makes the difference for horse safety.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/sod-installation-horse-paddocks",
    category: "Paddock Care",
  },
  {
    title: "5 Signs Your Farm Needs a Full Property Cleanout",
    description:
      "Is clutter piling up on your farm? From overflowing barns to debris-covered paddocks, here are five clear signs it\u2019s time for a professional property cleanout \u2014 and what the process looks like from start to finish.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/signs-farm-needs-property-cleanout",
    category: "Property Cleanout",
  },
  {
    title:
      "Complete Guide to Wellington Manure Hauler Permits & Regulations",
    description:
      "Everything horse farm owners need to know about Wellington\u2019s manure hauler permits, waste ordinances, approved disposal sites, and how to stay compliant year-round.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/wellington-manure-hauler-permits",
    category: "Regulations",
  },
  {
    title: "How to Get Your Farm Season-Ready Before WEF",
    description:
      "A step-by-step checklist for preparing your Wellington or Loxahatchee horse farm before the Winter Equestrian Festival.",
    date: "February 26, 2026",
    dateValue: "2026-02-26",
    slug: "/blog/get-farm-season-ready-wef",
    category: "Seasonal Prep",
  },
];

// Legacy posts without dedicated pages
const legacyPosts = [
  {
    title: "Benefits of Proper Manure Management",
    description:
      "Keeping barns clean isn\u2019t just about aesthetics\u2014it\u2019s essential for horse health and environmental stewardship. In this post, we explore why regular manure removal prevents pests, reduces odors and improves pasture quality.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
    category: "Manure Management",
  },
  {
    title: "Maintaining Safe, Lush Paddocks",
    description:
      "A well-kept paddock provides sure footing and reduces risk of injury. Discover how sod installation and regular resurfacing can make arenas safer and more comfortable for your horses.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
    category: "Paddock Care",
  },
  {
    title: "Eco-Friendly Equestrian Practices",
    description:
      "From reducing runoff to recycling materials, sustainability is part of modern farm management. Learn how choosing recycled asphalt millings and scheduling waste removal can reduce your environmental impact.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
    category: "Farm Tips",
  },
  {
    title: "Essential Equipment for Farm Maintenance",
    description:
      "Running a farm requires the right tools. We look at indispensable equipment\u2014like dumpsters for clean-ups, compact tractors for hauling, and the right fencing materials.",
    date: "February 25, 2026",
    dateValue: "2026-02-25",
    category: "Farm Tips",
  },
];

interface BlogPost {
  title: string;
  description: string;
  date: string;
  dateValue: string;
  slug?: string;
  category: string;
  image_url?: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function getSupabasePosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "title, description, slug, category, image_url, published_at",
      )
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error || !data) return [];

    return data.map(
      (post: {
        title: string;
        description: string;
        slug: string;
        category: string;
        image_url: string | null;
        published_at: string;
      }) => ({
        title: post.title,
        description: post.description,
        date: formatDate(post.published_at),
        dateValue: post.published_at.split("T")[0],
        slug: `/blog/${post.slug}`,
        category: post.category,
        image_url: post.image_url,
      }),
    );
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const supabasePosts = await getSupabasePosts();

  // Merge all posts and sort by date descending
  const allPosts: BlogPost[] = [
    ...supabasePosts,
    ...staticPosts,
    ...legacyPosts,
  ].sort(
    (a, b) =>
      new Date(b.dateValue).getTime() - new Date(a.dateValue).getTime(),
  );

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "My Horse Farm Blog",
    description:
      "Tips on manure management, paddock maintenance, eco-friendly farm practices and essential equestrian equipment advice.",
    url: "https://www.myhorsefarm.com/blog",
    publisher: {
      "@type": "Organization",
      name: "My Horse Farm",
      url: "https://www.myhorsefarm.com",
    },
    blogPost: allPosts
      .filter((p) => p.slug)
      .map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        datePublished: p.dateValue,
        url: `https://www.myhorsefarm.com${p.slug}`,
        author: {
          "@type": "Organization",
          name: "My Horse Farm",
        },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <Hero
        title="Our Blog"
        tagline="Insights and tips for horse owners and farm managers"
        ctaText="Contact Us"
        ctaHref="/#contact"
      />
      <main className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
        <h2 className="text-2xl max-md:text-xl mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allPosts.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              {post.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span
                    className="text-xs text-gray-400"
                    itemProp="datePublished"
                    content={post.dateValue}
                  >
                    {post.date}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-primary-dark mb-2 leading-snug"
                  itemProp="headline"
                >
                  {post.slug ? (
                    <Link
                      href={post.slug}
                      className="text-primary-dark hover:text-primary transition-colors no-underline"
                    >
                      {post.title}
                    </Link>
                  ) : (
                    post.title
                  )}
                </h3>
                <p
                  className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3"
                  itemProp="description"
                >
                  {post.description}
                </p>
                {post.slug && (
                  <Link
                    href={post.slug}
                    className="text-primary font-semibold hover:underline text-sm mt-auto"
                  >
                    Read full article &rarr;
                  </Link>
                )}
                <meta
                  itemProp="author"
                  content="My Horse Farm Team"
                />
                <meta itemProp="publisher" content="My Horse Farm" />
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
