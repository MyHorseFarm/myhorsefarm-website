import type { MetadataRoute } from "next";

const BASE = "https://www.myhorsefarm.com";

type SitemapEntry = {
  path: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const pages: SitemapEntry[] = [
  // Core pages
  { path: "/", lastModified: "2026-03-30", changeFrequency: "weekly", priority: 1.0 },
  { path: "/quote", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.9 },
  { path: "/offers", lastModified: "2026-03-20", changeFrequency: "weekly", priority: 0.8 },
  { path: "/referrals", lastModified: "2026-03-10", changeFrequency: "monthly", priority: 0.6 },

  // Manure removal
  { path: "/manure-removal", lastModified: "2026-03-25", changeFrequency: "monthly", priority: 0.9 },
  { path: "/manure-removal/wellington", lastModified: "2026-03-25", changeFrequency: "monthly", priority: 0.8 },
  { path: "/manure-removal/loxahatchee", lastModified: "2026-03-25", changeFrequency: "monthly", priority: 0.8 },
  { path: "/manure-removal/west-palm-beach", lastModified: "2026-03-25", changeFrequency: "monthly", priority: 0.8 },

  // Junk removal
  { path: "/junk-removal", lastModified: "2026-03-20", changeFrequency: "monthly", priority: 0.8 },
  { path: "/junk-removal/wellington", lastModified: "2026-03-20", changeFrequency: "monthly", priority: 0.7 },
  { path: "/junk-removal/loxahatchee", lastModified: "2026-03-20", changeFrequency: "monthly", priority: 0.7 },
  { path: "/junk-removal/west-palm-beach", lastModified: "2026-03-20", changeFrequency: "monthly", priority: 0.7 },

  // Other services
  { path: "/dumpster-rental", lastModified: "2026-03-10", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sod-installation", lastModified: "2026-03-10", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fill-dirt", lastModified: "2026-03-10", changeFrequency: "monthly", priority: 0.8 },
  { path: "/repairs", lastModified: "2026-03-10", changeFrequency: "monthly", priority: 0.7 },
  { path: "/season-ready", lastModified: "2026-03-10", changeFrequency: "monthly", priority: 0.7 },

  // Landing pages
  { path: "/lp/manure-removal-wellington", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lp/manure-removal-loxahatchee", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lp/manure-removal-west-palm-beach", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lp/junk-removal-wellington", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lp/junk-removal-loxahatchee", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lp/junk-removal-west-palm-beach", lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },

  // Blog
  { path: "/blog", lastModified: "2026-03-20", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog/wellington-manure-hauler-permits", lastModified: "2026-02-15", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/get-farm-season-ready-wef", lastModified: "2026-02-01", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/sod-installation-horse-paddocks", lastModified: "2026-02-20", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/signs-farm-needs-property-cleanout", lastModified: "2026-03-05", changeFrequency: "yearly", priority: 0.6 },

  // Legal
  { path: "/privacy-policy", lastModified: "2026-01-15", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", lastModified: "2026-01-15", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));
}
