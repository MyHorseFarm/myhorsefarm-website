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
  const dropdownRef = useRef<HTMLLIElement>(null);

  const isHome = pathname === "/";

  function anchorHref(anchor: string) {
    return isHome ? `#${anchor}` : `/#${anchor}`;
  }

  // Close desktop dropdown on click outside
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="My Horse Farm"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="hidden text-lg font-bold text-gray-900 sm:inline">
            My Horse Farm
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.slice(0, 1).map((link) => (
            <li key={link.label}>
              <Link
                href={link.href ?? anchorHref(link.anchor!)}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-green-700"
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
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-green-700"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {servicesOpen && (
              <ul className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-gray-100 bg-white py-2 shadow-lg">
                {SERVICE_DROPDOWN.map((svc) => (
                  <li key={svc.href}>
                    <Link
                      href={svc.href}
                      className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
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
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-green-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side: phone + CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-green-700"
          >
            {PHONE_OFFICE}
          </a>
          <Link
            href="/quote"
            className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 text-gray-700 lg:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 lg:hidden">
          <ul className="space-y-1 pt-2">
            {NAV_LINKS.slice(0, 1).map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href ?? anchorHref(link.anchor!)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Mobile Services expandable */}
            <li>
              <button
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {mobileServicesOpen && (
                <ul className="ml-4 space-y-1 border-l-2 border-green-200 pl-3 pt-1">
                  {SERVICE_DROPDOWN.map((svc) => (
                    <li key={svc.href}>
                      <Link
                        href={svc.href}
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700"
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
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile CTA + phone */}
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <Link
              href="/quote"
              className="block rounded-lg bg-green-700 px-4 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-green-800"
            >
              Get a Quote
            </Link>
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="block text-center text-sm font-medium text-gray-600 hover:text-green-700"
            >
              Call {PHONE_OFFICE}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
