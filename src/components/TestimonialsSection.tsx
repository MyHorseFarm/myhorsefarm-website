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
        .slice(0, 4)
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

  const featured = reviews[0];
  const rest = reviews.slice(1);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-warm">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          {hasGoogleData && totalReviews > 0 && (
            <div className="inline-flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 shadow-sm border border-gray-100 mb-6">
              <img
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
                alt="Google"
                className="w-6 h-6"
              />
              <div className="text-star flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < Math.round(avgRating) ? "" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({totalReviews} reviews)
              </span>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-lg text-gray-700 max-w-xl mx-auto">
            Trusted by horse farms and homeowners across Palm Beach County
          </p>
        </div>

        {/* Reviews grid: featured + rest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured review - spans full width on mobile, left column on desktop */}
          {featured && (
            <div
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative md:row-span-2 flex flex-col justify-between"
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Large decorative quote */}
              <div className="absolute top-6 right-6 text-7xl font-serif text-primary/10 leading-none select-none">
                &ldquo;
              </div>

              <div>
                <div
                  className="text-star text-base mb-5 flex gap-0.5"
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta itemProp="ratingValue" content={String(featured.rating)} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < featured.rating ? "" : "opacity-30"}`} />
                  ))}
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6 relative z-10" itemProp="reviewBody">
                  {featured.body}
                </p>
              </div>

              <div
                itemProp="itemReviewed"
                itemScope
                itemType="https://schema.org/LocalBusiness"
              >
                <meta itemProp="name" content="My Horse Farm" />
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                {featured.photo ? (
                  <img
                    src={featured.photo}
                    alt={featured.author}
                    className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center ring-2 ring-primary/20">
                    <span className="text-white font-bold text-base">{featured.author.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <div
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <div className="font-semibold text-gray-800" itemProp="name">
                      {featured.author}
                    </div>
                  </div>
                  {featured.location && (
                    <div className="text-xs text-gray-600">{featured.location}</div>
                  )}
                  {featured.timeDesc && (
                    <div className="text-xs text-gray-600">{featured.timeDesc}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remaining reviews */}
          {rest.map((t) => (
            <div
              key={t.author}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative"
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 text-5xl font-serif text-primary/10 leading-none select-none">
                &ldquo;
              </div>

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

              <p className="text-base text-gray-600 leading-relaxed mb-5" itemProp="reviewBody">
                {t.body}
              </p>

              <div
                itemProp="itemReviewed"
                itemScope
                itemType="https://schema.org/LocalBusiness"
              >
                <meta itemProp="name" content="My Horse Farm" />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.author}
                    className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center ring-2 ring-primary/20">
                    <span className="text-white font-bold text-sm">{t.author.charAt(0)}</span>
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
                    <div className="text-xs text-gray-600">{t.location}</div>
                  )}
                  {t.timeDesc && (
                    <div className="text-xs text-gray-600">{t.timeDesc}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
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
