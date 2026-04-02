import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-5 py-20 max-md:py-12 max-md:px-4">
      <div className="max-w-xl w-full text-center">
        {/* Large 404 badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
          <span className="text-4xl font-bold text-primary font-[family-name:var(--font-heading)]">
            404
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-earth font-[family-name:var(--font-heading)] mb-3">
          Page Not Found
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The page you&apos;re looking for may have been moved or no longer
          exists. Let&apos;s get you back on track.
        </p>

        {/* Primary CTA */}
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-md"
        >
          Back to Homepage
        </Link>

        {/* Service links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Our Services
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/manure-removal", label: "Manure Removal" },
              { href: "/junk-removal", label: "Junk Removal" },
              { href: "/dumpster-rental", label: "Dumpster Rental" },
              { href: "/sod-installation", label: "Sod Installation" },
              { href: "/quote", label: "Get a Quote" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full border border-primary/20 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Phone CTA */}
        <p className="mt-8 text-gray-600">
          Need help?{" "}
          <a
            href="tel:+15615767667"
            className="text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Call (561) 576-7667
          </a>
        </p>
      </div>
    </main>
  );
}
