"use client";

import { useEffect, useRef, useState } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID } from "@/lib/constants";

export default function HubSpotForm() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hostRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(hostRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const script = document.createElement("script");
    script.src = `https://js-na2.hsforms.net/forms/embed/${HUBSPOT_PORTAL_ID}.js`;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [visible]);

  return (
    <div id="hubspot-form" ref={hostRef} style={{ minHeight: 400 }}>
      {visible && (
        <div
          className="hs-form-frame"
          data-region="na2"
          data-form-id={HUBSPOT_FORM_ID}
          data-portal-id={HUBSPOT_PORTAL_ID}
        />
      )}
    </div>
  );
}
