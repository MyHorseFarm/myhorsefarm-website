import { TRUST_BADGES } from "@/lib/constants";

export default function TrustBadges() {
  return (
    <section className="py-6 bg-warm border-y border-accent/15">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-12">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2.5"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                <i className={`${badge.icon} text-sm text-primary`} />
              </div>
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
