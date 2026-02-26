import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export default function LandingHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header
      className="relative text-center py-15 px-5 text-white bg-cover bg-center max-md:py-10"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10">
        <img
          src="/logo.png"
          alt="My Horse Farm logo"
          className="w-[100px] mb-3 mx-auto"
        />
        <h1 className="text-[2.2rem] max-md:text-2xl max-[480px]:text-xl m-0 mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl max-md:text-base text-accent mb-5">
            {subtitle}
          </p>
        )}
        <a
          href={`tel:${PHONE_OFFICE_TEL}`}
          className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors no-underline max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-base"
        >
          <i className="fas fa-phone" /> Call {PHONE_OFFICE}
        </a>
      </div>
    </header>
  );
}
