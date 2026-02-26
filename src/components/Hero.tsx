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
  return (
    <header
      className={`relative flex items-center justify-center text-white bg-cover bg-center ${short ? "h-[30vh] max-md:h-[25vh]" : "h-[60vh] max-md:h-[50vh]"}`}
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="text-center bg-black/50 p-5 rounded-lg">
        <img
          src="/logo.png"
          alt="My Horse Farm logo"
          className="w-[120px] max-md:w-[80px] mx-auto mb-4"
        />
        <h1 className="text-[2.5rem] max-md:text-3xl max-[480px]:text-[1.4rem] my-1">
          {title}
        </h1>
        {tagline && (
          <p className="text-xl max-md:text-base max-[480px]:text-sm text-accent mb-5">
            {tagline}
          </p>
        )}
        {ctaText && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors max-[480px]:px-5 max-[480px]:py-2 max-[480px]:text-sm"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </header>
  );
}
