import type { Metadata } from "next";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const GTM_ID = "GTM-TWDPWRQV";

export const metadata: Metadata = {
  title: {
    default: "My Horse Farm – Agricultural Service Company",
    template: "%s | My Horse Farm",
  },
  description:
    "My Horse Farm provides premier agricultural services for equestrians in Royal Palm Beach, Florida.",
  icons: { icon: "/logo.png" },
  openGraph: {
    siteName: "My Horse Farm",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
  },
  twitter: {
    card: "summary",
    images: ["https://www.myhorsefarm.com/logo.png"],
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-p1BmVfeNcOGfm2ZN4xV7G49JGmTWq/m+KQpHUWGEdI8QaTdsK7InMy9lg+2Sp0UQG4I1VL0nZsdZ0wN7/Efc4g=="
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
        {children}
        <ChatWidget />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
