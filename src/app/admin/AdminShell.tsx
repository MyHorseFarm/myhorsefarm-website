"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminToken } from "@/lib/admin-auth";
import AdminChat from "@/components/AdminChat";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "fa-tachometer-alt" },
  { href: "/admin/daily", label: "Daily", icon: "fa-calendar-day" },
  { href: "/admin/customers", label: "Customers", icon: "fa-users" },
  { href: "/admin/crew", label: "Crew", icon: "fa-hard-hat" },
  { href: "/admin/pricing", label: "Pricing", icon: "fa-dollar-sign" },
  { href: "/admin/analytics", label: "Analytics", icon: "fa-chart-line" },
  { href: "/admin/schedule", label: "Schedule", icon: "fa-calendar-alt" },
  { href: "/admin/invoices", label: "Invoices", icon: "fa-file-invoice-dollar" },
  { href: "/admin/ads", label: "Ad Generator", icon: "fa-bullhorn" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminToken] = useState<string>(() => getAdminToken());

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-green-900 text-white shrink-0">
        <div className="p-4 border-b border-green-800">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            MHF Admin
          </Link>
        </div>
        <nav className="flex-1 py-2">
          {navItems.map((item) => {
            const active = item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-green-800 text-white"
                    : "text-green-200 hover:bg-green-800/50 hover:text-white"
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-green-800 text-xs text-green-400">
          <Link href="/" className="hover:text-white">View Site</Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-green-900 text-white flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="text-lg font-bold">
          MHF Admin
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-xl w-10 h-10 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <nav
            className="absolute top-14 left-0 right-0 bg-green-900 border-t border-green-800"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => {
              const active = item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-medium border-b border-green-800 ${
                    active ? "bg-green-800 text-white" : "text-green-200"
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 text-center`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-14">{children}</main>

      {/* AI Chat Assistant — only when authenticated */}
      {adminToken && <AdminChat adminToken={adminToken} />}
    </div>
  );
}
