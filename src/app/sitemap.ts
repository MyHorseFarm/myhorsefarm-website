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
  { path: "/spring-special", lastModified: "2026-04-02", changeFrequency: "monthly", priority: 0.9 },
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

  // Manure removal - new cities
  { path: "/manure-removal/royal-palm-beach", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/manure-removal/palm-beach-gardens", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/manure-removal/loxahatchee-groves", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },

  // Junk removal - new cities
  { path: "/junk-removal/royal-palm-beach", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.7 },
  { path: "/junk-removal/palm-beach-gardens", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.7 },
  { path: "/junk-removal/loxahatchee-groves", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.7 },

  // Sod installation
  { path: "/sod-installation", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sod-installation/wellington", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sod-installation/royal-palm-beach", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sod-installation/loxahatchee", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },

  // Dumpster rental
  { path: "/dumpster-rental", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/dumpster-rental/wellington", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/dumpster-rental/royal-palm-beach", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/dumpster-rental/loxahatchee", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },

  // Fill dirt
  { path: "/fill-dirt", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fill-dirt/wellington", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fill-dirt/royal-palm-beach", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fill-dirt/loxahatchee", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },

  // Repairs
  { path: "/repairs", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.9 },
  { path: "/repairs/wellington", lastModified: "2026-03-30", changeFrequency: "monthly", priority: 0.8 },
  { path: "/repairs/loxahatchee", lastModified: "2026-03-30", changeFrequency: "monthly", priority: 0.8 },
  { path: "/repairs/west-palm-beach", lastModified: "2026-03-30", changeFrequency: "monthly", priority: 0.8 },
  { path: "/repairs/royal-palm-beach", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.8 },

  // Season-ready
  { path: "/season-ready", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.7 },
  { path: "/season-ready/wellington", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.7 },
  { path: "/season-ready/loxahatchee", lastModified: "2026-03-31", changeFrequency: "monthly", priority: 0.7 },

  // Blog
  { path: "/blog", lastModified: "2026-03-20", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog/wellington-manure-hauler-permits", lastModified: "2026-02-15", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/get-farm-season-ready-wef", lastModified: "2026-02-01", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/sod-installation-horse-paddocks", lastModified: "2026-02-20", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/signs-farm-needs-property-cleanout", lastModified: "2026-03-05", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog/post-season-farm-repairs-wellington", lastModified: "2026-03-30", changeFrequency: "yearly", priority: 0.7 },

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
