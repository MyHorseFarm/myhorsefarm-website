import Image from "next/image";

const pairs = [
  {
    before: "/images/before-1.jpg",
    after: "/images/after-1.jpg",
    caption: "Manure Bin Pickup \u2014 Loaded & Hauled",
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

        <div className="max-w-4xl mx-auto">
          {pairs.map((pair, idx) => (
            <div key={idx} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={pair.before}
                    alt={`Before - ${pair.caption}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 40vw"
                  />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={pair.after}
                    alt={`After - ${pair.caption}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 40vw"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    After
                  </span>
                </div>
              </div>
              <p className="text-center font-[family-name:var(--font-heading)] text-lg font-semibold text-gray-700">
                {pair.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
