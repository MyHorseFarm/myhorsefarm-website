"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ReferralTracker({ code }: { code: string }) {
  useEffect(() => {
    trackEvent("referral_page_view", { referral_code: code });
  }, [code]);

  return null;
}
