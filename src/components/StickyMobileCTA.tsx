"use client";

import { usePathname } from "next/navigation";
import LandingStickyMobileCTA from "./LandingStickyMobileCTA";

/**
 * Renders the sticky mobile CTA bar on all pages except /lp/* routes
 * (those pages render their own LandingStickyMobileCTA with custom quoteUrl).
 */
export default function StickyMobileCTA() {
  const pathname = usePathname();

  // LP pages already include their own LandingStickyMobileCTA with a custom quoteUrl
  if (pathname.startsWith("/lp")) return null;

  return <LandingStickyMobileCTA />;
}
