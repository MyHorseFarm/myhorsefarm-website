import { supabase } from "./supabase";

export interface GoogleReview {
  id: string;
  author_name: string;
  rating: number;
  text: string | null;
  time: string;
  profile_photo_url: string | null;
  relative_time_description: string | null;
}

export interface ReviewSummary {
  total_reviews: number;
  average_rating: number;
}

const PLACE_ID = "ChIJS-lXFT-vMIgRS0l1BgP2jMw"; // My Horse Farm Google Place ID

/**
 * Fetch reviews from Google Places API and cache in Supabase.
 * Called by cron job daily.
 */
export async function refreshGoogleReviews(): Promise<{
  reviews: GoogleReview[];
  summary: ReviewSummary;
}> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Places API error: ${res.status}`);

  const data = await res.json();
  if (data.status !== "OK") throw new Error(`Google Places API: ${data.status}`);

  const result = data.result;
  const reviews = (result.reviews ?? []) as Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
    profile_photo_url?: string;
    relative_time_description?: string;
  }>;

  const totalReviews = result.user_ratings_total ?? reviews.length;
  const averageRating = result.rating ?? 5;

  // Clear and re-insert cached reviews
  await supabase.from("google_reviews_cache").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (reviews.length > 0) {
    await supabase.from("google_reviews_cache").insert(
      reviews.map((r) => ({
        author_name: r.author_name,
        rating: r.rating,
        text: r.text || null,
        time: new Date(r.time * 1000).toISOString(),
        profile_photo_url: r.profile_photo_url || null,
        relative_time_description: r.relative_time_description || null,
      }))
    );
  }

  // Update summary
  await supabase
    .from("google_reviews_summary")
    .update({
      total_reviews: totalReviews,
      average_rating: averageRating,
      updated_at: new Date().toISOString(),
    })
    .not("id", "is", null); // update all rows (should be 1)

  return {
    reviews: reviews.map((r) => ({
      id: `${r.time}`,
      author_name: r.author_name,
      rating: r.rating,
      text: r.text || null,
      time: new Date(r.time * 1000).toISOString(),
      profile_photo_url: r.profile_photo_url || null,
      relative_time_description: r.relative_time_description || null,
    })),
    summary: { total_reviews: totalReviews, average_rating: averageRating },
  };
}

/**
 * Get cached reviews from Supabase. Falls back to constants if no cache.
 */
export async function getCachedReviews(): Promise<{
  reviews: GoogleReview[];
  summary: ReviewSummary;
}> {
  const [reviewsRes, summaryRes] = await Promise.all([
    supabase
      .from("google_reviews_cache")
      .select("*")
      .order("time", { ascending: false })
      .limit(5),
    supabase
      .from("google_reviews_summary")
      .select("*")
      .limit(1)
      .maybeSingle(),
  ]);

  const reviews: GoogleReview[] = (reviewsRes.data ?? []).map((r) => ({
    id: r.id,
    author_name: r.author_name,
    rating: r.rating,
    text: r.text,
    time: r.time,
    profile_photo_url: r.profile_photo_url,
    relative_time_description: r.relative_time_description,
  }));

  const summary: ReviewSummary = {
    total_reviews: summaryRes.data?.total_reviews ?? 0,
    average_rating: summaryRes.data?.average_rating ?? 5,
  };

  return { reviews, summary };
}
