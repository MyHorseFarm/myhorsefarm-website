import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import ConversionTracker from "@/components/ConversionTracker";
import UtmCapture from "@/components/UtmCapture";
import AudienceSignals from "@/components/AudienceSignals";
import "./globals.css";

const GTM_ID = "GTM-TWDPWRQV";

export const metadata: Metadata = {
  title: {
    default: "Manure Removal & Farm Services in Royal Palm Beach & Wellington, FL | My Horse Farm",
    template: "%s | My Horse Farm",
  },
  description:
    "Manure removal, junk hauling, sod installation, fill dirt & dumpster rental for equestrian properties in Palm Beach County. Call (561) 576-7667 for a free quote!",
  icons: { icon: "/logo.png" },
  openGraph: {
    siteName: "My Horse Farm",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://www.myhorsefarm.com/images/hero-farm.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.myhorsefarm.com/images/hero-farm.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <div className="pt-[60px]">
          {children}
        </div>
        <ChatWidget />
        <ConversionTracker />
        <UtmCapture />
        <AudienceSignals />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
