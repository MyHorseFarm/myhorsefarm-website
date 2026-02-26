import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export default function LandingCallBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] bg-primary-dark text-center py-2.5 px-4">
      <a
        href={`tel:${PHONE_OFFICE_TEL}`}
        className="text-white no-underline font-bold text-lg tracking-wide hover:text-accent max-[480px]:text-[0.95rem]"
      >
        <i className="fas fa-phone" /> Call Now: {PHONE_OFFICE}
      </a>
    </div>
  );
}
