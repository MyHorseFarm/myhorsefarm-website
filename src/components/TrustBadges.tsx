import { TRUST_BADGES } from "@/lib/constants";

export default function TrustBadges() {
  return (
    <section className="text-center py-10 px-5 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap justify-center gap-[30px] mt-5 max-md:gap-5 max-[480px]:gap-4">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center w-[140px] max-md:w-[110px] max-[480px]:w-[90px]"
          >
            <i
              className={`${badge.icon} text-[2rem] text-primary mb-2 max-[480px]:text-2xl`}
            />
            <span className="text-sm font-semibold text-gray-800 text-center max-[480px]:text-xs">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
