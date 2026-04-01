const features = [
  "All Grooming Services Under One Roof",
  "Same-Day Appointments Available",
  "Online Booking",
  "Transparent Pricing",
  "Certified & Trained Groomers",
  "Natural & Hypoallergenic Products",
  "Fear-Free Grooming Techniques",
  "Dog Lover Operated",
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[var(--color-warm)] py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-center text-[var(--color-earth)] mb-4">
          Why Choose Us
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          See how Aaron&apos;s Dog Grooming stacks up against the typical competitor.
        </p>

        <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_140px_140px] text-center">
            <div className="p-4" />
            <div className="bg-[var(--color-primary)] p-4">
              <span className="font-[family-name:var(--font-heading)] text-white font-bold text-sm uppercase tracking-wider">
                Aaron&apos;s
              </span>
            </div>
            <div className="bg-gray-400 p-4">
              <span className="font-[family-name:var(--font-heading)] text-white font-bold text-sm uppercase tracking-wider">
                Other Groomers
              </span>
            </div>
          </div>

          {/* Feature rows */}
          {features.map((feature, idx) => (
            <div
              key={feature}
              className={`grid grid-cols-[1fr_140px_140px] items-center text-center ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${idx < features.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="p-4 text-left font-medium text-[var(--color-earth)]">
                {feature}
              </div>
              <div className="p-4">
                <i className="fas fa-check-circle text-[var(--color-primary)] text-xl" />
              </div>
              <div className="p-4">
                <i className="fas fa-times-circle text-red-400 text-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
