import Link from "next/link";
import { PHONE_OFFICE_TEL } from "@/lib/constants";

export default function CtaBanner() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1e40af]">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='6'/%3E%3Ccircle cx='60' cy='60' r='6'/%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3Ccircle cx='30' cy='10' r='3'/%3E%3Ccircle cx='10' cy='30' r='3'/%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='70' cy='50' r='3'/%3E%3Ccircle cx='50' cy='70' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to Pamper Your Pup?
        </h2>
        <p className="text-lg text-white/90 mb-10">
          Book an appointment today. Same-day availability for most services.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#contact"
            className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-earth)] font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
          >
            Book an Appointment
          </Link>
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className="inline-block border-2 border-white text-white hover:bg-white hover:text-[var(--color-earth)] font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            <i className="fas fa-phone-alt mr-2" />
            Call (555) DOG-WASH
          </a>
        </div>
      </div>
    </section>
  );
}
