import Image from "next/image";

const pairs = [
  {
    before: "/images/before-1.jpg",
    after: "/images/after-1.jpg",
    caption: "Paddock Cleanup \u2014 Wellington",
  },
  {
    before: "/images/before-1.jpg",
    after: "/images/after-1.jpg",
    caption: "Barn Cleanout \u2014 Loxahatchee",
  },
];

export default function BeforeAfterShowcase() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-center text-[var(--color-earth)] mb-4">
          See the Difference
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Real results from real farms across South Florida.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {pairs.map((pair, idx) => (
            <div key={idx} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Before */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={pair.before}
                    alt={`Before - ${pair.caption}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Before
                  </span>
                </div>

                {/* After */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={pair.after}
                    alt={`After - ${pair.caption}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    After
                  </span>
                </div>
              </div>
              <p className="text-center font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--color-earth)]">
                {pair.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
