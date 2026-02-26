import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NAV_LINKS_LEGAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | My Horse Farm",
  description: "Terms of Service for My Horse Farm. Read our terms covering services, scheduling, cancellation, pricing and liability for agricultural services in Palm Beach County.",
  robots: "index, follow",
  authors: [{ name: "My Horse Farm" }],
  alternates: { canonical: "https://www.myhorsefarm.com/terms-of-service" },
  openGraph: {
    title: "Terms of Service | My Horse Farm",
    description: "Terms of Service for My Horse Farm. Read our terms covering services, scheduling, cancellation, pricing and liability.",
    type: "website",
    url: "https://www.myhorsefarm.com/terms-of-service",
    images: [{ url: "https://www.myhorsefarm.com/logo.png" }],
    siteName: "My Horse Farm",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | My Horse Farm",
    description: "Terms of Service for My Horse Farm. Read our terms covering services, scheduling, cancellation, pricing and liability.",
    images: ["https://www.myhorsefarm.com/logo.png"],
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Hero title="Terms of Service" short />
      <Navbar links={NAV_LINKS_LEGAL} />
      <main className="py-15 px-5 max-w-[800px] mx-auto text-left max-md:py-10 max-md:px-4">
        <p><strong>Last Updated:</strong> February 25, 2026</p>

        <p>Welcome to My Horse Farm. By accessing our website at <a href="https://www.myhorsefarm.com" className="text-primary-dark">www.myhorsefarm.com</a> or using our services, you agree to these Terms of Service. Please read them carefully.</p>

        <h2 className="text-primary-dark mt-8">Acceptance of Terms</h2>
        <p>By using our website or booking any of our services, you acknowledge that you have read, understood and agree to be bound by these Terms. If you do not agree, please do not use our website or services.</p>

        <h2 className="text-primary-dark mt-8">Services Description</h2>
        <p>My Horse Farm provides agricultural and equestrian services including but not limited to:</p>
        <ul className="pl-5">
          <li className="mb-1.5">Horse manure bin rental and waste removal</li>
          <li className="mb-1.5">Junk removal and hauling</li>
          <li className="mb-1.5">Dumpster rental</li>
          <li className="mb-1.5">Sod installation</li>
          <li className="mb-1.5">Fill dirt delivery</li>
          <li className="mb-1.5">Farm repairs and maintenance</li>
          <li className="mb-1.5">Millings asphalt delivery</li>
        </ul>
        <p>Service availability, pricing and scope may vary. Specific terms for each service will be discussed and agreed upon prior to commencement of work.</p>

        <h2 className="text-primary-dark mt-8">Scheduling and Cancellation</h2>
        <ul className="pl-5">
          <li className="mb-1.5">Appointments can be booked through our website scheduling system or by phone.</li>
          <li className="mb-1.5">We request at least 24 hours&apos; notice for cancellations or rescheduling.</li>
          <li className="mb-1.5">Same-day cancellations or no-shows may be subject to a cancellation fee.</li>
          <li className="mb-1.5">We reserve the right to reschedule services due to weather, equipment issues or other circumstances beyond our control.</li>
        </ul>

        <h2 className="text-primary-dark mt-8">Pricing and Payment</h2>
        <ul className="pl-5">
          <li className="mb-1.5">Prices are quoted based on the scope of work and may vary by project.</li>
          <li className="mb-1.5">Junk removal services start at $75 per ton. Final pricing is determined at time of service based on weight and materials.</li>
          <li className="mb-1.5">Payment is due upon completion of service unless other arrangements have been made in advance.</li>
          <li className="mb-1.5">We accept cash, check and major credit cards.</li>
        </ul>

        <h2 className="text-primary-dark mt-8">Liability</h2>
        <p>My Horse Farm is licensed and insured. However:</p>
        <ul className="pl-5">
          <li className="mb-1.5">We are not responsible for pre-existing property conditions, underground utilities or structures not disclosed prior to service.</li>
          <li className="mb-1.5">Clients are responsible for ensuring clear access to the work area and removing valuable or fragile items from the service zone.</li>
          <li className="mb-1.5">Our total liability for any claim arising from our services shall not exceed the amount paid for the specific service in question.</li>
        </ul>

        <h2 className="text-primary-dark mt-8">Property Access</h2>
        <p>By scheduling a service, you grant My Horse Farm permission to access your property for the purpose of performing the agreed-upon work. You confirm that you have the authority to grant such access.</p>

        <h2 className="text-primary-dark mt-8">Service Area</h2>
        <p>We primarily serve the following areas in Palm Beach County, Florida:</p>
        <ul className="pl-5">
          <li className="mb-1.5">Royal Palm Beach</li>
          <li className="mb-1.5">Wellington</li>
          <li className="mb-1.5">Loxahatchee and Loxahatchee Groves</li>
          <li className="mb-1.5">West Palm Beach</li>
          <li className="mb-1.5">Palm Beach Gardens</li>
        </ul>
        <p>Service availability outside these areas is subject to our discretion and may incur additional charges.</p>

        <h2 className="text-primary-dark mt-8">Intellectual Property</h2>
        <p>All content on this website, including text, images, logos and design, is the property of My Horse Farm and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our written permission.</p>

        <h2 className="text-primary-dark mt-8">Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Updated terms will be posted on this page with a revised &ldquo;Last Updated&rdquo; date. Continued use of our website or services after changes constitutes acceptance of the new terms.</p>

        <h2 className="text-primary-dark mt-8">Contact Us</h2>
        <p>If you have questions about these Terms of Service, please contact us:</p>
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
