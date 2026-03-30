import Image from "next/image";
import Link from "next/link";
import { PHONE_OFFICE_TEL } from "@/lib/constants";

export default function CtaBanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/cta-bg.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to Get Your Farm in Shape?
        </h2>
        <p className="text-lg text-white/90 mb-10">
          Get a free quote in minutes. Same-day service available.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quote"
            className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-earth)] font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
          >
            Get Your Free Quote
          </Link>
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className="inline-block border-2 border-white text-white hover:bg-white hover:text-[var(--color-earth)] font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            <i className="fas fa-phone-alt mr-2" />
            Call (561) 576-7667
          </a>
        </div>
      </div>
    </section>
  );
}
