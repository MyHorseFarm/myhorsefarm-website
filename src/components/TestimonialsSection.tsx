import { TESTIMONIALS, SOCIAL } from "@/lib/constants";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4">
      <h2 className="text-2xl max-md:text-xl">What Our Customers Say</h2>
      <p className="text-lg text-gray-500 -mt-1 mb-8">
        Trusted by horse farms and homeowners across Palm Beach County
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-5 max-md:grid-cols-1">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.author}
            className="bg-white rounded-lg p-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-left"
            itemScope
            itemType="https://schema.org/Review"
          >
            <div
              className="text-star text-lg mb-3"
              itemProp="reviewRating"
              itemScope
              itemType="https://schema.org/Rating"
            >
              <meta itemProp="ratingValue" content="5" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <p className="italic mb-4 leading-relaxed" itemProp="reviewBody">
              {t.body}
            </p>
            <div
              itemProp="itemReviewed"
              itemScope
              itemType="https://schema.org/LocalBusiness"
            >
              <meta itemProp="name" content="My Horse Farm" />
            </div>
            <div
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="font-bold text-gray-800" itemProp="name">
                {t.author}
              </div>
            </div>
            <div className="text-sm text-gray-500">{t.location}</div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a
          href={SOCIAL.google}
          target="_blank"
          rel="noopener"
          className="inline-block px-6 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary-dark transition-colors"
        >
          See More Reviews on Google
        </a>
      </div>
    </section>
  );
}
