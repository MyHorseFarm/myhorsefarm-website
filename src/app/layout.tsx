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
const GADS_ID = "AW-385210685";
const META_PIXEL_ID = "1247574672351702";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myhorsefarm.com"),
  title: {
    default: "Farm & Property Services in Palm Beach County | My Horse Farm",
    template: "%s | My Horse Farm",
  },
  description:
    "Dumpster rentals, junk hauling, sod installation, fill dirt & farm services at the lowest prices in Palm Beach County. Call (561) 576-7667 for a free quote!",
  icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "My Horse Farm",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.myhorsefarm.com/api/og?title=Farm%20%26%20Property%20Services%20in%20Palm%20Beach&description=Dumpster%20rentals%2C%20junk%20hauling%2C%20sod%20installation%20and%20farm%20services",
        width: 1200,
        height: 630,
        alt: "My Horse Farm - Farm & Property Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://www.myhorsefarm.com/api/og?title=Farm%20%26%20Property%20Services%20in%20Palm%20Beach&description=Dumpster%20rentals%2C%20junk%20hauling%2C%20sod%20installation%20and%20farm%20services",
    ],
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
        {/* Font Awesome: loaded async to avoid render-blocking */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          as="style"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </noscript>
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
          className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-colors max-md:hidden"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp text-2xl" />
        </a>
        <ChatWidget />
        <StickyMobileCTA />
        <ConversionTracker />
        <UtmCapture />
        <AudienceSignals />
        <Script id="font-awesome-async" strategy="afterInteractive">
          {`var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';l.crossOrigin='anonymous';document.head.appendChild(l);`}
        </Script>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gads-config" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GADS_ID}',{allow_enhanced_conversions:true});`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
