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

  // Fallback to hardcoded testimonials
  if (reviews.length === 0) {
    reviews = TESTIMONIALS.map((t) => ({
      author: t.author,
      body: t.body,
      rating: 5,
      location: t.location,
    }));
  }

  return (
    <section id="testimonials" className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4">
      <h2 className="text-2xl max-md:text-xl">What Our Customers Say</h2>
      <p className="text-lg text-gray-500 -mt-1 mb-2">
        Trusted by horse farms and homeowners across Palm Beach County
      </p>
      {hasGoogleData && totalReviews > 0 && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <img
            src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          <div className="text-star text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className={`fas fa-star ${i < Math.round(avgRating) ? "" : "opacity-30"}`} />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {avgRating.toFixed(1)} ({totalReviews} reviews)
          </span>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-5 max-md:grid-cols-1">
        {reviews.map((t) => (
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
              <meta itemProp="ratingValue" content={String(t.rating)} />
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className={`fas fa-star ${i < t.rating ? "" : "opacity-30"}`} />
              ))}
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
            <div className="flex items-center gap-3">
              {t.photo && (
                <img
                  src={t.photo}
                  alt={t.author}
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <div
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <div className="font-bold text-gray-800" itemProp="name">
                    {t.author}
                  </div>
                </div>
                {t.location && (
                  <div className="text-sm text-gray-500">{t.location}</div>
                )}
                {t.timeDesc && (
                  <div className="text-xs text-gray-400">{t.timeDesc}</div>
                )}
              </div>
            </div>
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
          {hasGoogleData && totalReviews > 0
            ? `See All ${totalReviews} Reviews on Google`
            : "See More Reviews on Google"}
        </a>
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
