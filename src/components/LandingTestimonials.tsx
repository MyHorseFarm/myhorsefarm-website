import { LP_TESTIMONIALS } from "@/lib/constants";

export default function LandingTestimonials() {
  return (
    <section className="bg-gray-50 py-12 px-5 text-center">
      <h2 className="mb-8 text-gray-800">What Our Customers Say</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 max-w-[1100px] mx-auto max-md:grid-cols-1">
        {LP_TESTIMONIALS.map((t) => (
          <div
            key={t.author}
            className="bg-white rounded-lg p-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-left"
          >
            <div className="text-star text-lg mb-2.5">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <p className="italic leading-relaxed mb-3">{t.body}</p>
            <div className="font-bold text-gray-800">{t.author}</div>
            <div className="text-sm text-gray-500">{t.location}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
