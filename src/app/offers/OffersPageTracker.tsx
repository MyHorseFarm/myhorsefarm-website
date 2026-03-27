"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function OffersPageTracker() {
  useEffect(() => {
    trackEvent("view_offers_page", {
      event_category: "email_campaign",
    });
  }, []);

  return null;
}
