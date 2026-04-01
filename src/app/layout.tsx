import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
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

export const metadata: Metadata = {
  title: {
    default: "Professional Dog Grooming in Austin, TX | Aaron's Dog Grooming",
    template: "%s | Aaron's Dog Grooming",
  },
  description:
    "Premium dog grooming services in Austin, TX. Full grooming, baths, nail trims, de-shedding & more. Certified groomers, natural products. Book today!",
  icons: { icon: "/logo.png" },
  openGraph: {
    siteName: "Aaron's Dog Grooming",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        <Navbar />
        <div className="pt-[60px]">
          {children}
        </div>
      </body>
    </html>
  );
}
