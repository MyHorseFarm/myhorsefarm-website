"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <button
        className="hidden max-md:block bg-transparent border-none text-2xl text-gray-800 cursor-pointer px-4 py-2.5"
        aria-label="Toggle navigation menu"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>
      <ul
        className={`list-none flex flex-wrap justify-center p-2.5 m-0 max-md:flex-col max-md:items-center max-md:p-2.5 max-md:gap-0 ${open ? "max-md:flex" : "max-md:hidden"}`}
      >
        {links.map((link) => (
          <li key={link.href + link.label} className="mx-4 max-md:my-1">
            <Link
              href={link.href}
              className="no-underline text-gray-800 font-medium hover:text-primary-dark transition-colors max-md:block max-md:px-5 max-md:py-2 max-md:text-[0.95rem]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
