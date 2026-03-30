import { TESTIMONIALS, SOCIAL } from "@/lib/constants";
import { getCachedReviews } from "@/lib/google-reviews";

interface ReviewData {
  author: string;
  body: string;
  rating: number;
  location?: string;
  photo?: string | null;
  timeDesc?: string | null;
}

export default async function TestimonialsSection() {
  let reviews: ReviewData[] = [];
  let totalReviews = 0;
  let avgRating = 5;
  let hasGoogleData = false;

  try {
    const cached = await getCachedReviews();
    if (cached.reviews.length > 0) {
      reviews = cached.reviews
        .filter((r) => r.rating >= 4 && r.text)
        .slice(0, 3)
        .map((r) => ({
          author: r.author_name,
          body: r.text!,
          rating: r.rating,
          photo: r.profile_photo_url,
          timeDesc: r.relative_time_description,
        }));
      totalReviews = cached.summary.total_reviews;
      avgRating = cached.summary.average_rating;
      hasGoogleData = true;
    }
  } catch {
    // Fall through to hardcoded testimonials
  }

  if (reviews.length === 0) {
    reviews = TESTIMONIALS.map((t) => ({
      author: t.author,
      body: t.body,
      rating: 5,
      location: t.location,
    }));
  }

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="mt-3 text-lg text-gray-500">
            Trusted by horse farms and homeowners across Palm Beach County
          </p>
          {hasGoogleData && totalReviews > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <img
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
                alt="Google"
                className="w-5 h-5"
              />
              <div className="text-star text-sm flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < Math.round(avgRating) ? "" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {avgRating.toFixed(1)} ({totalReviews} reviews)
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((t) => (
            <div
              key={t.author}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative"
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 text-4xl font-serif text-primary/10 leading-none">&ldquo;</div>

              <div
                className="text-star text-sm mb-4 flex gap-0.5"
                itemProp="reviewRating"
                itemScope
                itemType="https://schema.org/Rating"
              >
                <meta itemProp="ratingValue" content={String(t.rating)} />
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < t.rating ? "" : "opacity-30"}`} />
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-5" itemProp="reviewBody">
                {t.body}
              </p>

              <div
                itemProp="itemReviewed"
                itemScope
                itemType="https://schema.org/LocalBusiness"
              >
                <meta itemProp="name" content="My Horse Farm" />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.author}
                    className="w-10 h-10 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{t.author.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <div
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <div className="font-semibold text-sm text-gray-800" itemProp="name">
                      {t.author}
                    </div>
                  </div>
                  {t.location && (
                    <div className="text-xs text-gray-400">{t.location}</div>
                  )}
                  {t.timeDesc && (
                    <div className="text-xs text-gray-400">{t.timeDesc}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={SOCIAL.google}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            {hasGoogleData && totalReviews > 0
              ? `See All ${totalReviews} Reviews on Google`
              : "See More Reviews on Google"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* AggregateRating schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "My Horse Farm",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: hasGoogleData ? avgRating.toFixed(1) : "5.0",
              reviewCount: hasGoogleData && totalReviews > 0 ? totalReviews : reviews.length,
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
    </section>
  );
}
