import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NAV_LINKS_LEGAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | My Horse Farm",
  description: "Privacy Policy for My Horse Farm. Learn how we collect, use and protect your personal information when you use our website and services.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | My Horse Farm",
    description: "Privacy Policy for My Horse Farm. Learn how we collect, use and protect your personal information.",
    type: "website",
    url: "https://www.myhorsefarm.com/privacy-policy",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | My Horse Farm",
    description: "Privacy Policy for My Horse Farm. Learn how we collect, use and protect your personal information.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Hero title="Privacy Policy" short />
      <Navbar links={NAV_LINKS_LEGAL} />
      <main className="py-15 px-5 max-w-[800px] mx-auto text-left max-md:py-10 max-md:px-4">
        <p><strong>Last Updated:</strong> February 25, 2026</p>

        <p>My Horse Farm (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use and safeguard your information when you visit our website at <a href="https://www.myhorsefarm.com" className="text-primary-dark">www.myhorsefarm.com</a> or use our services.</p>

        <h2 className="text-primary-dark mt-8">Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="pl-5">
          <li className="mb-1.5"><strong>Contact Information:</strong> Name, email address, phone number and property address when you submit a form, request a quote or book a service.</li>
          <li className="mb-1.5"><strong>Service Details:</strong> Information about your property, services requested and scheduling preferences.</li>
          <li className="mb-1.5"><strong>Website Usage Data:</strong> Pages visited, time spent on site, referring URL, browser type and device information collected through cookies and analytics tools.</li>
        </ul>

        <h2 className="text-primary-dark mt-8">How We Use Your Information</h2>
        <ul className="pl-5">
          <li className="mb-1.5">To respond to inquiries and provide requested services</li>
          <li className="mb-1.5">To schedule appointments and send service confirmations</li>
          <li className="mb-1.5">To improve our website and customer experience</li>
          <li className="mb-1.5">To send occasional service updates or promotions (you may opt out at any time)</li>
        </ul>

        <h2 className="text-primary-dark mt-8">Third-Party Services</h2>
        <p>We use the following third-party services that may collect data on our behalf:</p>
        <ul className="pl-5">
          <li className="mb-1.5"><strong>HubSpot:</strong> We use HubSpot for our contact forms and scheduling system. When you submit a form or book a service, your information is processed through HubSpot&apos;s platform. Please review <a href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noopener" className="text-primary-dark">HubSpot&apos;s Privacy Policy</a> for details on their data practices.</li>
          <li className="mb-1.5"><strong>Google Analytics:</strong> We may use Google Analytics to understand how visitors interact with our website. This data is aggregated and anonymized.</li>
        </ul>

        <h2 className="text-primary-dark mt-8">Cookies</h2>
        <p>Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device. We use cookies for:</p>
        <ul className="pl-5">
          <li className="mb-1.5">Remembering your preferences</li>
          <li className="mb-1.5">Understanding site usage through analytics</li>
          <li className="mb-1.5">Enabling third-party form and scheduling functionality</li>
        </ul>
        <p>You can control cookies through your browser settings. Disabling cookies may affect some site functionality.</p>

        <h2 className="text-primary-dark mt-8">Data Security</h2>
        <p>We take reasonable measures to protect your personal information from unauthorized access, alteration or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-primary-dark mt-8">Your Rights</h2>
        <p>You may request to view, update or delete the personal information we have collected from you by contacting us directly. We will respond to your request within a reasonable timeframe.</p>

        <h2 className="text-primary-dark mt-8">Children&apos;s Privacy</h2>
        <p>Our website and services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children.</p>

        <h2 className="text-primary-dark mt-8">Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.</p>

        <h2 className="text-primary-dark mt-8">Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us:</p>
        <ul className="pl-5">
          <li className="mb-1.5"><strong>Phone:</strong> <a href="tel:+15615767667" className="text-gray-800 hover:text-primary">(561) 576-7667</a></li>
          <li className="mb-1.5"><strong>Email:</strong> <a href="mailto:sales@myhorsefarm.com" className="text-gray-800 hover:text-primary">sales@myhorsefarm.com</a></li>
          <li className="mb-1.5"><strong>Location:</strong> Royal Palm Beach, FL 33411</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
