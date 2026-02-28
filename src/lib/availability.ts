import { supabase } from "./supabase";
import type { AvailabilityDay } from "./types";

interface ScheduleSettings {
  max_jobs_per_day: number;
  work_days: number[];
  blocked_dates: string[];
}

async function getSettings(): Promise<ScheduleSettings> {
  const { data, error } = await supabase
    .from("schedule_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    // Fallback defaults: Mon-Fri, 4 jobs/day
    return { max_jobs_per_day: 4, work_days: [1, 2, 3, 4, 5], blocked_dates: [] };
  }

  return data as ScheduleSettings;
}

/**
 * Get available dates over the next N days.
 * Checks work days, blocked dates, and existing booking counts.
 */
export async function getAvailableDates(
  days: number = 30,
): Promise<AvailabilityDay[]> {
  const settings = await getSettings();

  const workDaySet = new Set(settings.work_days);
  const blockedSet = new Set(settings.blocked_dates);

  // Date range: tomorrow through N days out
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + 1);

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + days);

  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  // Count existing bookings in the date range
  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select("scheduled_date")
    .gte("scheduled_date", startStr)
    .lte("scheduled_date", endStr)
    .neq("status", "cancelled");

  if (bookingError) throw new Error(`Supabase: ${bookingError.message}`);

  const bookingCounts = new Map<string, number>();
  for (const b of bookings ?? []) {
    const key = b.scheduled_date;
    bookingCounts.set(key, (bookingCounts.get(key) ?? 0) + 1);
  }

  // Build availability list
  const result: AvailabilityDay[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const dayOfWeek = cursor.getDay();
    const dateStr = cursor.toISOString().split("T")[0];

    // Only include work days that aren't blocked
    if (workDaySet.has(dayOfWeek) && !blockedSet.has(dateStr)) {
      const booked = bookingCounts.get(dateStr) ?? 0;
      const slotsAvailable = Math.max(0, settings.max_jobs_per_day - booked);

      let status: AvailabilityDay["status"] = "available";
      if (slotsAvailable === 0) status = "full";
      else if (slotsAvailable <= 1) status = "limited";

      result.push({
        date: dateStr,
        day_of_week: dayOfWeek,
        slots_available: slotsAvailable,
        max_slots: settings.max_jobs_per_day,
        status,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Check if a specific date has capacity for a new booking.
 */
export async function hasCapacity(date: string): Promise<boolean> {
  const settings = await getSettings();
  const dayOfWeek = new Date(date + "T12:00:00").getDay();

  // Check it's a work day
  if (!settings.work_days.includes(dayOfWeek)) return false;

  // Check it's not blocked
  if (settings.blocked_dates.includes(date)) return false;

  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("scheduled_date", date)
    .neq("status", "cancelled");

  return (count ?? 0) < settings.max_jobs_per_day;
}
