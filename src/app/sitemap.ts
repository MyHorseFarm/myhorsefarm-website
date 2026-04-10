import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DOMAIN = 'https://www.myhorsefarm.com';

interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Get all blog post slugs from Supabase database
 */
async function getBlogPostsFromDatabase(): Promise<string[]> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured, skipping database blog posts');
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);

    if (error) {
      console.error('Error fetching blog posts from database:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((post: { slug: string }) => post.slug);
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return [];
  }
}

/**
 * Get all blog post slugs by scanning the blog directory
 * Only includes directories that contain a page.tsx file
 */
function getBlogPostsFromFilesystem(): string[] {
  const blogDir = path.join(process.cwd(), 'src/app/blog');
  
  if (!fs.existsSync(blogDir)) {
    return [];
  }
  
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  
  return entries
    .filter(entry => {
      // Skip dynamic routes and non-directories
      if (!entry.isDirectory() || entry.name.startsWith('[')) {
        return false;
      }
      
      // Verify that the directory contains a page.tsx file
      const pagePath = path.join(blogDir, entry.name, 'page.tsx');
      return fs.existsSync(pagePath);
    })
    .map(entry => entry.name);
}

/**
 * Get all city pages for a given service category
 * Only includes directories that contain a page.tsx file
 */
function getCityPages(serviceCategory: string): string[] {
  const serviceDir = path.join(process.cwd(), `src/app/${serviceCategory}`);
  
  if (!fs.existsSync(serviceDir)) {
    return [];
  }
  
  const entries = fs.readdirSync(serviceDir, { withFileTypes: true });
  
  return entries
    .filter(entry => {
      // Skip dynamic routes and non-directories
      if (!entry.isDirectory() || entry.name.startsWith('[')) {
        return false;
      }
      
      // Verify that the directory contains a page.tsx file
      const pagePath = path.join(serviceDir, entry.name, 'page.tsx');
      return fs.existsSync(pagePath);
    })
    .map(entry => entry.name);
}

/**
 * Get all landing page slugs (lp directory)
 * Only includes directories that contain a page.tsx file
 */
function _getLandingPages(): string[] {
  const lpDir = path.join(process.cwd(), 'src/app/lp');
  
  if (!fs.existsSync(lpDir)) {
    return [];
  }
  
  const entries = fs.readdirSync(lpDir, { withFileTypes: true });
  
  return entries
    .filter(entry => {
      // Skip dynamic routes and non-directories
      if (!entry.isDirectory() || entry.name.startsWith('[')) {
        return false;
      }
      
      // Verify that the directory contains a page.tsx file
      const pagePath = path.join(lpDir, entry.name, 'page.tsx');
      return fs.existsSync(pagePath);
    })
    .map(entry => entry.name);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  // Static pages with high priority
  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/quote', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/referrals', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/offers', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/spring-special', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/wellington-manure-regulations', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  entries.push(
    ...staticPages.map(page => ({
      url: `${DOMAIN}${page.url}`,
      priority: page.priority,
      changeFrequency: page.changeFrequency,
    }))
  );

  // Service category pages
  const serviceCategories = [
    { name: 'junk-removal', priority: 0.9 },
    { name: 'manure-removal', priority: 0.9 },
    { name: 'dumpster-rental', priority: 0.8 },
    { name: 'sod-installation', priority: 0.8 },
    { name: 'fill-dirt', priority: 0.8 },
    { name: 'season-ready', priority: 0.8 },
    { name: 'repairs', priority: 0.8 },
  ];

  serviceCategories.forEach(category => {
    // Main category page
    entries.push({
      url: `${DOMAIN}/${category.name}`,
      priority: category.priority,
      changeFrequency: 'monthly' as const,
    });

    // City pages
    const cities = getCityPages(category.name);
    cities.forEach(city => {
      entries.push({
        url: `${DOMAIN}/${category.name}/${city}`,
        priority: category.priority - 0.1,
        changeFrequency: 'monthly' as const,
      });
    });
  });

  // Blog posts - from database (auto-discovers new blog posts)
  const dbBlogPosts = await getBlogPostsFromDatabase();
  dbBlogPosts.forEach(slug => {
    entries.push({
      url: `${DOMAIN}/blog/${slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    });
  });

  // Blog posts - from filesystem (static posts)
  const fsBlogPosts = getBlogPostsFromFilesystem();
  fsBlogPosts.forEach(slug => {
    // Skip if already added from database
    if (!dbBlogPosts.includes(slug)) {
      entries.push({
        url: `${DOMAIN}/blog/${slug}`,
        priority: 0.7,
        changeFrequency: 'monthly' as const,
      });
    }
  });

  // Landing pages excluded from sitemap — they have noindex meta tags

  return entries;
}
