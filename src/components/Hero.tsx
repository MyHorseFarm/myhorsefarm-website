import Image from "next/image";
import Link from "next/link";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export default function Hero({
  title,
  tagline,
  ctaText,
  ctaHref,
  short,
}: {
  title: string;
  tagline?: string;
  ctaText?: string;
  ctaHref?: string;
  short?: boolean;
}) {
  if (short) {
    return (
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1a3d1c] via-[#2d6a30] to-[#1e4d20]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="relative py-12 md:py-16 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {tagline && (
            <p className="mt-2 text-lg text-accent-light/80">{tagline}</p>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden min-h-[70vh] md:min-h-[90vh] flex items-center -mt-[60px]">
      {/* Background photo */}
      <Image
        src="/images/hero-farm.jpg"
        alt="Equestrian farm in Palm Beach County"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

      {/* Content - LEFT aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-16 pt-28 md:pt-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-accent-light text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <i className="fas fa-horse text-xs" />
            Palm Beach County&apos;s Trusted Farm Service
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            {title}
          </h1>

          {tagline && (
            <p className="mt-5 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              {tagline}
            </p>
          )}

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {ctaText && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light hover:shadow-accent/40 transition-all"
              >
                {ctaText}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              <i className="fas fa-phone text-sm" />
              Call {PHONE_OFFICE}
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-white/60 text-sm">
            <div className="flex items-center gap-1 text-accent">
              <i className="fas fa-star text-xs" />
              <i className="fas fa-star text-xs" />
              <i className="fas fa-star text-xs" />
              <i className="fas fa-star text-xs" />
              <i className="fas fa-star text-xs" />
            </div>
            <span>5-Star Rated</span>
            <span className="text-white/30">|</span>
            <span>400+ Happy Clients</span>
            <span className="text-white/30">|</span>
            <span>10+ Years</span>
          </div>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V20C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" fill="#faf6ee"/>
        </svg>
      </div>
    </header>
  );
}
