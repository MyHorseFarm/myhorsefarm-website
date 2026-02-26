import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { NAV_LINKS_LEGAL } from "@/lib/constants";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Hero title="Page Not Found" short />
      <Navbar links={NAV_LINKS_LEGAL} />
      <main className="py-15 px-5 max-w-[1200px] mx-auto text-center min-h-[40vh] max-md:py-10 max-md:px-4">
        <h2 className="text-2xl max-md:text-xl">Oops! This page doesn&apos;t exist.</h2>
        <p>The page you&apos;re looking for may have been moved or no longer exists. Let&apos;s get you back on track.</p>
        <p className="mt-5">
          <Link href="/" className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors">
            Go to Homepage
          </Link>
        </p>
        <p className="mt-8">Or check out our services:</p>
        <ul className="list-none p-0 mt-2.5">
          <li><Link href="/manure-removal" className="text-primary-dark">Manure Removal</Link></li>
          <li><Link href="/junk-removal" className="text-primary-dark">Junk Removal</Link></li>
          <li><Link href="/dumpster-rental" className="text-primary-dark">Dumpster Rental</Link></li>
          <li><Link href="/sod-installation" className="text-primary-dark">Sod Installation</Link></li>
        </ul>
        <p className="mt-8">Need help? Call us at <a href="tel:+15615767667" className="text-primary-dark">(561) 576-7667</a></p>
      </main>
      <footer className="bg-gray-800 text-white py-5 text-center">
        <p>&copy; {new Date().getFullYear()} My Horse Farm. All rights reserved.</p>
      </footer>
    </>
  );
}
