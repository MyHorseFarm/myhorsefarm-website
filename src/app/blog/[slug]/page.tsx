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

  return {
    title: post.title,
    description: post.description,
    robots: "index, follow",
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://www.myhorsefarm.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://www.myhorsefarm.com/blog/${post.slug}`,
      images: post.image_url
        ? [{ url: post.image_url }]
        : [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
      siteName: "My Horse Farm",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image_url
        ? [post.image_url]
        : ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
    },
  };
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

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-bold text-primary-dark mb-3">
            Need Farm Services in Palm Beach County?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            My Horse Farm provides manure removal, sod installation, fill
            dirt, dumpster rental, farm repairs, and property cleanouts for
            equestrian properties throughout Wellington, Loxahatchee, and
            Royal Palm Beach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-block rounded-xl bg-primary px-7 py-3.5 font-semibold text-white text-lg hover:bg-primary-dark transition-colors no-underline"
            >
              Get a Free Quote
            </Link>
            <Link
              href="tel:+15615767667"
              className="inline-block rounded-xl border-2 border-primary text-primary px-7 py-3.5 font-semibold text-lg hover:bg-primary hover:text-white transition-colors no-underline"
            >
              <i className="fas fa-phone mr-2" />
              (561) 576-7667
            </Link>
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        <p className="text-sm text-gray-400">
          <Link href="/blog" className="text-primary hover:underline">
            &larr; Back to Blog
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
