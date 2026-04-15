import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript\s*:/gi, 'blocked:')
    .replace(/<iframe\b[^>]*>/gi, '');
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string | null;
  published_at: string;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return data as BlogPost;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const publishedDate = post.published_at.split("T")[0];
  const canonicalUrl = `https://www.myhorsefarm.com/blog/${post.slug}`;
  const ogImageUrl = post.image_url || "https://www.myhorsefarm.com/images/hero-farm.jpg";

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags && post.tags.length > 0 ? post.tags.join(", ") : undefined,
    robots: "index, follow",
    authors: [{ name: post.author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/jpeg",
        },
      ],
      siteName: "My Horse Farm",
      locale: "en_US",
      publishedTime: publishedDate,
      authors: [post.author],
      tags: post.tags && post.tags.length > 0 ? post.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
      creator: "@myhorsefarm",
    },
  };
}

const staticPosts = [
  {
    slug: "/blog/sod-installation-horse-paddocks",
    title: "Sod Installation for Horse Paddocks",
    description:
      "A comprehensive guide to paddock sod installation in Florida.",
    date: "February 26, 2026",
    category: "Paddock Care",
  },
  {
    slug: "/blog/signs-farm-needs-property-cleanout",
    title: "5 Signs Your Farm Needs a Full Property Cleanout",
    description:
      "Five clear signs it's time for a professional property cleanout.",
    date: "February 26, 2026",
    category: "Property Cleanout",
  },
  {
    slug: "/blog/wellington-manure-hauler-permits",
    title: "Wellington Manure Hauler Permits & Regulations",
    description:
      "Everything about Wellington's manure hauler permits and waste ordinances.",
    date: "February 26, 2026",
    category: "Regulations",
  },
  {
    slug: "/blog/get-farm-season-ready-wef",
    title: "How to Get Your Farm Season-Ready Before WEF",
    description:
      "Step-by-step checklist for preparing your farm before Winter Equestrian Festival.",
    date: "February 26, 2026",
    category: "Seasonal Prep",
  },
];

async function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  // Fetch recent published posts from Supabase (excluding current)
  const { data: dbPosts } = await supabase
    .from("blog_posts")
    .select("slug, title, description, published_at, category")
    .eq("published", true)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(10);

  // Normalize DB posts to common shape
  const normalizedDb = (dbPosts || []).map((p) => ({
    slug: `/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    date: new Date(p.published_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }),
    category: p.category,
  }));

  // Merge with static posts, exclude current slug
  const currentPath = `/blog/${currentSlug}`;
  const allCandidates = [
    ...normalizedDb,
    ...staticPosts.filter(
      (sp) =>
        sp.slug !== currentPath &&
        !normalizedDb.some((dp) => dp.slug === sp.slug)
    ),
  ];

  if (allCandidates.length === 0) return null;

  // Pick 3 deterministic-but-varied posts (stable for SSR/purity)
  const seeded = allCandidates
    .map((post) => {
      const key = `${currentSlug}:${post.slug}`;
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
      }
      return { post, hash };
    })
    .sort((a, b) => a.hash - b.hash);

  const selected = seeded.slice(0, 3).map((entry) => entry.post);

  return (
    <section className="mt-16 mb-4">
      <h2 className="text-2xl font-bold text-primary-dark mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selected.map((rp) => (
          <Link
            key={rp.slug}
            href={rp.slug}
            className="rounded-2xl shadow-sm border border-gray-100 card-hover overflow-hidden flex flex-col no-underline group"
          >
            <div className="p-5 flex flex-col flex-1">
              <span className="inline-block self-start px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-3">
                {rp.category}
              </span>
              <h3 className="text-base font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {rp.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                {rp.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-400">{rp.date}</span>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Read more &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.published_at.split("T")[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: "My Horse Farm" },
    publisher: { "@type": "Organization", name: "My Horse Farm" },
    datePublished: publishedDate,
    dateModified: publishedDate,
    url: `https://www.myhorsefarm.com/blog/${post.slug}`,
    image:
      post.image_url ||
      "https://www.myhorsefarm.com/images/hero-farm.jpg",
  };

  return (
    <>
      <SchemaMarkup schema={schema} />
      <header className="relative flex items-center justify-center text-white h-[30vh] max-md:h-[25vh] overflow-hidden">
        <Image
          src={post.image_url || "/images/hero-farm.jpg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center p-5">
          <Image
            src="/logo.png"
            alt="My Horse Farm logo"
            width={80}
            height={80}
            className="mx-auto mb-3"
          />
          <p className="text-accent text-sm mb-1">
            <Link href="/blog" className="text-accent hover:underline">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span>{post.category}</span>
          </p>
          <h1 className="text-2xl max-md:text-xl max-[480px]:text-lg my-1 max-w-[700px]">
            {post.title}
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            {formatDate(post.published_at)} &middot; {post.author}
          </p>
        </div>
      </header>

      <main className="py-20 md:py-28 max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="text-sm text-primary font-medium hover:underline"
          >
            &larr; Back to Blog
          </Link>
        </nav>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <article
          className="blog-content [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-primary-dark [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-primary-dark [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:text-gray-600 [&>p]:text-base [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-gray-600 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:text-gray-600 [&>ol]:mb-6 [&>ol]:space-y-2 [&_strong]:text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />

        {/* Related Posts Section */}
        <RelatedPosts currentSlug={post.slug} />

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-bold text-primary-dark mb-3">
            Need Farm Services in Palm Beach County?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            My Horse Farm provides manure removal, sod installation, fill
            dirt, dumpster rental, farm repairs, property cleanouts, and
            junk removal services across Wellington, Loxahatchee, and the
            greater West Palm Beach area.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
