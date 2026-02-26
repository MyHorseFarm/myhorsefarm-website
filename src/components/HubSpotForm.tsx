"use client";

import { useEffect } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID } from "@/lib/constants";

export default function HubSpotForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://js-na2.hsforms.net/forms/embed/${HUBSPOT_PORTAL_ID}.js`;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="hubspot-form">
      <div
        className="hs-form-frame"
        data-region="na2"
        data-form-id={HUBSPOT_FORM_ID}
        data-portal-id={HUBSPOT_PORTAL_ID}
      />
    </div>
  );
}
