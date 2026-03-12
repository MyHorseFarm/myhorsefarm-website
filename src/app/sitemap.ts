import type { MetadataRoute } from "next";

const BASE = "https://www.myhorsefarm.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    "/",
    "/manure-removal",
    "/manure-removal/wellington",
    "/manure-removal/loxahatchee",
    "/manure-removal/west-palm-beach",
    "/junk-removal",
    "/junk-removal/wellington",
    "/junk-removal/loxahatchee",
    "/junk-removal/west-palm-beach",
    "/dumpster-rental",
    "/sod-installation",
    "/fill-dirt",
    "/repairs",
    "/quote",
    "/season-ready",
    "/blog",
    "/blog/wellington-manure-hauler-permits",
    "/blog/get-farm-season-ready-wef",
    "/blog/sod-installation-horse-paddocks",
    "/blog/signs-farm-needs-property-cleanout",
    "/privacy-policy",
    "/terms-of-service",
  ];

  return pages.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
  }));
}
