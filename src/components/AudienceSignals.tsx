"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export default function AudienceSignals() {
  useEffect(() => {
    const segment = getCookie("mhf_segment");
    if (segment) {
      trackEvent("audience_signal", { user_segment: segment });
    }
  }, []);

  return null;
}
