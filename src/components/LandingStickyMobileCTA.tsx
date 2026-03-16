"use client";

import { PHONE_OFFICE_TEL } from "@/lib/constants";

export default function LandingStickyMobileCTA({
  quoteUrl,
}: {
  quoteUrl?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] py-2.5 px-4 flex gap-3 justify-center md:hidden">
      <a
        href={`tel:${PHONE_OFFICE_TEL}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-bold text-sm no-underline"
      >
        <i className="fas fa-phone" /> Call Now
      </a>
      <a
        href={quoteUrl || "/quote"}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-gray-900 rounded-lg font-bold text-sm no-underline"
      >
        <i className="fas fa-calculator" /> Get Quote
      </a>
    </div>
  );
}
