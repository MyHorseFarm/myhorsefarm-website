"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NAV_LINKS,
  SERVICE_DROPDOWN,
  PHONE_OFFICE,
  PHONE_OFFICE_TEL,
} from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  function anchorHref(anchor: string) {
    return isHome ? `#${anchor}` : `/#${anchor}`;
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset menus on route change - expected cascading render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
     
    setMobileServicesOpen(false);
     
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Color classes based on transparent vs solid state
  const navLinkClass = isTransparent
    ? "rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    : "rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary";

  const servicesBtnClass = isTransparent
    ? "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    : "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white shadow-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="My Horse Farm"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div className="hidden sm:block">
            <span
              className={`text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-primary"
              }`}
            >
              My Horse Farm
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.slice(0, 1).map((link) => (
            <li key={link.label}>
              <Link
                href={link.href ?? anchorHref(link.anchor!)}
                className={navLinkClass}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Services dropdown */}
          <li
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={servicesBtnClass}
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <svg
                className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <ul className="absolute left-0 top-full mt-1 w-60 rounded-xl border border-gray-100 bg-white py-2 shadow-xl shadow-black/8">
                {SERVICE_DROPDOWN.map((svc) => (
                  <li key={svc.href}>
                    <Link
                      href={svc.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      {svc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {NAV_LINKS.slice(1).map((link) => (
            <li key={link.label}>
              <Link
                href={link.href ?? anchorHref(link.anchor!)}
                className={navLinkClass}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${
              isTransparent
                ? "text-white/70 hover:text-white"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            <i className="fas fa-phone text-xs" />
            {PHONE_OFFICE}
          </a>
          <Link
            href="/quote"
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 ${
              isTransparent
                ? "bg-accent text-earth hover:bg-accent-light shadow-accent/25 hover:shadow-md hover:shadow-accent/30"
                : "bg-primary text-white hover:bg-primary-dark shadow-primary/25 hover:shadow-md hover:shadow-primary/30"
            }`}
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile phone + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className={`rounded-md p-2 transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-primary"
            }`}
            aria-label="Call us"
          >
            <i className="fas fa-phone text-lg" />
          </a>
          <button
            className={`rounded-md p-2 transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-gray-700"
            }`}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
          </button>
        </div>
      </div>

      {/* Mobile menu - always white background */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 lg:hidden">
          <ul className="space-y-1 pt-2">
            {NAV_LINKS.slice(0, 1).map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href ?? anchorHref(link.anchor!)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary/5"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary/5"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                aria-expanded={mobileServicesOpen}
              >
                Services
                <svg
                  className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileServicesOpen && (
                <ul className="ml-4 space-y-0.5 border-l-2 border-primary/20 pl-3 pt-1">
                  {SERVICE_DROPDOWN.map((svc) => (
                    <li key={svc.href}>
                      <Link
                        href={svc.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary"
                      >
                        {svc.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {NAV_LINKS.slice(1).map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href ?? anchorHref(link.anchor!)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary/5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <Link
              href="/quote"
              className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              Get a Quote
            </Link>
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-primary"
            >
              <i className="fas fa-phone text-xs" />
              Call {PHONE_OFFICE}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
