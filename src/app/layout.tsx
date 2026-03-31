import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConversionTracker from "@/components/ConversionTracker";
import UtmCapture from "@/components/UtmCapture";
import AudienceSignals from "@/components/AudienceSignals";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const GTM_ID = "GTM-TWDPWRQV";

export const metadata: Metadata = {
  title: {
    default: "Farm & Property Services in Palm Beach County | My Horse Farm",
    template: "%s | My Horse Farm",
  },
  description:
    "Dumpster rentals, junk hauling, sod installation, fill dirt & farm services at the lowest prices in Palm Beach County. Call (561) 576-7667 for a free quote!",
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
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
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
        <a
          href="https://wa.me/15615767667?text=Hi%2C%20I%20need%20a%20quote%20for%20farm%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-colors max-md:bottom-36"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp text-2xl" />
        </a>
        <ChatWidget />
        <StickyMobileCTA />
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
