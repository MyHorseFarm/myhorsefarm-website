import { getAvailableDates } from "./availability";
import { getCachedReviews } from "./google-reviews";

export async function getLandingPageData() {
  let slotsLeft: number | undefined;
  let reviewCount: number | undefined;
  let avgRating: number | undefined;

  try {
    const dates = await getAvailableDates(7);
    const total = dates.reduce((sum, d) => sum + d.slots_available, 0);
    if (total <= 8) slotsLeft = total;
  } catch {
    // Non-fatal
  }

  try {
    const { summary } = await getCachedReviews();
    if (summary.total_reviews > 0) {
      reviewCount = summary.total_reviews;
      avgRating = summary.average_rating;
    }
  } catch {
    // Non-fatal
  }

  return { slotsLeft, reviewCount, avgRating };
}
