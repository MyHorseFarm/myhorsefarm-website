import Image from "next/image";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export default function LandingHero({
  title,
  subtitle,
  slotsLeft,
}: {
  title: string;
  subtitle?: string;
  slotsLeft?: number;
}) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#1a3d1c] via-[#2d6a30] to-[#1e4d20] text-white">
      {/* Decorative shapes */}
      <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-white/[0.03]" />
      <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full bg-white/[0.04]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }} />

      <div className="relative z-10 text-center py-16 px-6 md:py-20">
        <Image
          src="/logo.png"
          alt="My Horse Farm logo"
          width={100}
          height={100}
          className="w-[100px] mb-4 mx-auto drop-shadow-lg"
          priority
        />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight m-0 mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/70 mb-6 max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        {typeof slotsLeft === "number" && slotsLeft <= 8 && (
          <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
            Only {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} left this week
          </div>
        )}
        <div>
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-earth font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-light transition-all"
          >
            <i className="fas fa-phone text-base" />
            Call {PHONE_OFFICE}
          </a>
        </div>
      </div>
    </header>
  );
}
