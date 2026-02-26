import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8T0GW54XK3"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-8T0GW54XK3");`}
        </Script>
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","1505630082897177");fbq("track","PageView");`}
        </Script>
      </body>
    </html>
  );
}
