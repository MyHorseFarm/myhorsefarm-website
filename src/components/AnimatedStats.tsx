"use client";

import { useCountUp } from "@/hooks/useCountUp";

const badges = [
  "Fully Insured",
  "Licensed in FL",
  "Eco-Friendly",
  "Locally Owned",
  "Bilingual EN/ES",
  "Horse Owner Operated",
];

function StatCounter({
  target,
  suffix,
  label,
  icon,
  decimal,
}: {
  target: number;
  suffix: string;
  label: string;
  icon: string;
  decimal?: boolean;
}) {
  const { ref, value } = useCountUp(decimal ? target * 10 : target);
  const display = decimal ? (value / 10).toFixed(1) : value.toLocaleString();

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-6 py-4">
      <i className={`${icon} text-[var(--color-accent)] text-2xl`} />
      <span className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white">
        {display}
        {suffix}
      </span>
      <span className="text-sm text-white/80 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  const { ref, value: animated } = useCountUp(value * 10);
  const display = (animated / 10).toFixed(1);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-6 py-4">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className="fas fa-star text-[var(--color-star)] text-lg"
          />
        ))}
      </div>
      <span className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white">
        {display}
      </span>
      <span className="text-sm text-white/80 uppercase tracking-wider">
        Google Rating
      </span>
    </div>
  );
}

export default function AnimatedStats() {
  return (
    <section className="bg-[#1a2e1c] py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <StatCounter
            target={12}
            suffix="+"
            label="Years Experience"
            icon="fas fa-calendar-check"
          />
          <StatCounter
            target={400}
            suffix="+"
            label="Happy Clients"
            icon="fas fa-users"
          />
          <StatCounter
            target={1000}
            suffix="+"
            label="Tons Hauled"
            icon="fas fa-truck"
          />
          <StarRating value={5.0} />
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/20 pt-8">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-[var(--color-accent-light)] text-sm font-medium tracking-wide flex items-center gap-2"
            >
              <i className="fas fa-check-circle text-[var(--color-accent)] text-xs" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
