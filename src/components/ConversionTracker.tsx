"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, trackConversion, generateEventId } from "@/lib/analytics";

export default function ConversionTracker() {
  const pathname = usePathname();

  // Track phone link clicks globally
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackEvent("phone_call_click", {
          phone_number: href.replace("tel:", ""),
          page: pathname,
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // Track HubSpot form submissions via postMessage
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (
        e.data?.type === "hsFormCallback" &&
        e.data?.eventName === "onFormSubmitted"
      ) {
        trackEvent("contact_form_submit", {
          form_id: e.data.id,
          page: pathname,
        });
        const eventId = generateEventId();
        trackConversion(
          "generate_lead",
          {
            source: "contact_form",
            page: pathname,
          },
          {},
          eventId,
        );
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [pathname]);

  return null;
}
