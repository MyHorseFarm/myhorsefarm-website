"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });
const StickyMobileCTA = dynamic(() => import("@/components/StickyMobileCTA"), { ssr: false });
const ConversionTracker = dynamic(() => import("@/components/ConversionTracker"), { ssr: false });
const UtmCapture = dynamic(() => import("@/components/UtmCapture"), { ssr: false });
const AudienceSignals = dynamic(() => import("@/components/AudienceSignals"), { ssr: false });

export default function ClientGlobals() {
  return (
    <>
      <ChatWidget />
      <StickyMobileCTA />
      <ConversionTracker />
      <UtmCapture />
      <AudienceSignals />
    </>
  );
}
