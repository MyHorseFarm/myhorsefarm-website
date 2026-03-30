import Link from "next/link";
import Image from "next/image";
import {
  SOCIAL,
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
  EMAIL_SALES,
  ADDRESS,
  SERVICE_DROPDOWN,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e1c] text-white">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="My Horse Farm"
                width={44}
                height={44}
                className="w-11 h-11"
              />
              <span className="text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight">
                My Horse Farm
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Premier agricultural and equestrian services in Palm Beach County.
              Horse owners serving horse owners since 2014.
            </p>
            <div className="flex gap-3">
              {[
                { href: SOCIAL.facebook, icon: "fab fa-facebook-f" },
                { href: SOCIAL.instagram, icon: "fab fa-instagram" },
                { href: SOCIAL.youtube, icon: "fab fa-youtube" },
                { href: SOCIAL.google, icon: "fab fa-google" },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white/70 hover:bg-accent hover:text-earth transition-all text-sm"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_DROPDOWN.map((svc) => (
                <li key={svc.href}>
                  <Link
                    href={svc.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/crew" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Crew Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <i className="fas fa-phone text-xs text-accent mt-1.5" />
                <a
                  href={`tel:${PHONE_OFFICE_TEL}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {PHONE_OFFICE}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="fas fa-envelope text-xs text-accent mt-1.5" />
                <a
                  href={`mailto:${EMAIL_SALES}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {EMAIL_SALES}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="fas fa-map-marker-alt text-xs text-accent mt-1.5" />
                <span className="text-sm text-gray-400">{ADDRESS}</span>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light transition-colors"
              >
                Get a Free Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} My Horse Farm. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
