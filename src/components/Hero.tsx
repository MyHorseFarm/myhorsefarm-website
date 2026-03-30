import Image from "next/image";
import Link from "next/link";

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
    <header className="relative overflow-hidden bg-gradient-to-br from-[#1a3d1c] via-[#2d6a30] to-[#1e4d20] min-h-[85vh] md:min-h-[90vh] flex items-center">
      {/* Decorative SVG shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle top-right */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/[0.03]" />
        {/* Small circle bottom-left */}
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-white/[0.04]" />
        {/* Accent diagonal stripe */}
        <div className="absolute top-0 right-0 w-full h-full">
          <svg className="absolute top-0 right-0 h-full opacity-[0.06]" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="600" y1="0" x2="0" y2="600" stroke="white" strokeWidth="1"/>
            <line x1="650" y1="0" x2="50" y2="600" stroke="white" strokeWidth="1"/>
            <line x1="700" y1="0" x2="100" y2="600" stroke="white" strokeWidth="1"/>
            <line x1="750" y1="0" x2="150" y2="600" stroke="white" strokeWidth="1"/>
            <line x1="800" y1="0" x2="200" y2="600" stroke="white" strokeWidth="1"/>
          </svg>
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-accent-light text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <i className="fas fa-horse text-xs" />
              Palm Beach County&apos;s Trusted Farm Service
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              {title}
            </h1>
            {tagline && (
              <p className="mt-4 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
                {tagline}
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
                href="tel:+15615767667"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <i className="fas fa-phone text-sm" />
                (561) 576-7667
              </a>
            </div>
            {/* Social proof line */}
            <div className="mt-8 flex items-center gap-4 justify-center md:justify-start text-white/60 text-sm">
              <div className="flex items-center gap-1 text-star">
                <i className="fas fa-star text-xs" />
                <i className="fas fa-star text-xs" />
                <i className="fas fa-star text-xs" />
                <i className="fas fa-star text-xs" />
                <i className="fas fa-star text-xs" />
              </div>
              <span>5-Star Rated</span>
              <span className="text-white/30">|</span>
              <span>10+ Years Serving Wellington & Palm Beach</span>
            </div>
          </div>

          {/* Right: Logo + service highlights */}
          <div className="hidden md:flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-150" />
              <Image
                src="/logo.png"
                alt="My Horse Farm logo"
                width={220}
                height={220}
                className="relative w-[220px] drop-shadow-2xl"
                priority
              />
            </div>
            {/* Quick service pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
              {["Manure Removal", "Junk Removal", "Sod Installation", "Farm Repairs"].map((svc) => (
                <span key={svc} className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
                  {svc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V20C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" fill="#fafafa"/>
        </svg>
      </div>
    </header>
  );
}
