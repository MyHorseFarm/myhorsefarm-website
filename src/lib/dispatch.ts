import { supabase } from "@/lib/supabase";
import {
  sendEmail,
  crewAutoDispatchEmail,
  dispatchAlertEmail,
} from "@/lib/emails";
import { EMAIL_ADMIN_NOTIFICATION } from "@/lib/constants";

interface BookingForDispatch {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_location: string;
  service_key: string;
  scheduled_date: string;
  time_slot: "morning" | "afternoon";
}

interface DispatchResult {
  dispatched: boolean;
  crew_member_id?: string;
  crew_member_name?: string;
  error?: string;
}

/**
 * Auto-dispatch: find an available crew member for the booking, assign them,
 * and send notification emails. Non-fatal — if anything fails, the booking
 * still succeeds.
 */
export async function autoDispatch(
  booking: BookingForDispatch,
  serviceName: string,
): Promise<DispatchResult> {
  try {
    // 1. Get active crew members
    const { data: crewMembers, error: crewErr } = await supabase
      .from("crew_members")
      .select("id, name, email, phone")
      .eq("active", true)
      .order("name");

    if (crewErr || !crewMembers || crewMembers.length === 0) {
      // No crew members configured — alert Jose
      await sendAlertNoCrewAvailable(booking, serviceName, "No active crew members found");
      return { dispatched: false, error: "No active crew members" };
    }

    // 2. Check which crew members already have bookings on that date
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("assigned_crew, time_slot")
      .eq("scheduled_date", booking.scheduled_date)
      .eq("status", "confirmed")
      .not("assigned_crew", "is", null);

    // Build a set of crew IDs that are busy in the same time slot
    const busyCrewIds = new Set<string>();
    if (existingBookings) {
      for (const b of existingBookings) {
        // A crew member is "busy" if they already have a job in the same slot
        if (b.time_slot === booking.time_slot && b.assigned_crew) {
          busyCrewIds.add(b.assigned_crew);
        }
      }
    }

    // 3. Find first available crew member
    const available = crewMembers.find((c) => !busyCrewIds.has(c.id));

    if (!available) {
      await sendAlertNoCrewAvailable(booking, serviceName, "All crew members busy for this slot");
      return { dispatched: false, error: "All crew busy" };
    }

    // 4. Assign the crew member to the booking
    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ assigned_crew: available.id })
      .eq("id", booking.id);

    if (updateErr) {
      console.error("Failed to assign crew:", updateErr);
      return { dispatched: false, error: updateErr.message };
    }

    // 5. Format date for display
    const formattedDate = new Date(booking.scheduled_date + "T12:00:00").toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    );

    const timeSlotLabel = booking.time_slot === "morning" ? "Morning (8 AM - 12 PM)" : "Afternoon (12 PM - 5 PM)";

    // 6. Send crew member notification email
    if (available.email) {
      try {
        const template = crewAutoDispatchEmail(available.name, {
          date: formattedDate,
          timeSlot: timeSlotLabel,
          service: serviceName,
          customerName: booking.customer_name,
          customerPhone: booking.customer_phone,
          location: booking.customer_location,
          bookingNumber: booking.booking_number,
        });
        await sendEmail(available.email, template.subject, template.html, "HIGH", "crew-auto-dispatch");
      } catch (err) {
        console.error("Failed to email crew member:", err);
      }
    }

    // 7. Send Jose a dispatch summary
    try {
      const alertTemplate = dispatchAlertEmail({
        crewName: available.name,
        date: formattedDate,
        timeSlot: timeSlotLabel,
        service: serviceName,
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone,
        location: booking.customer_location,
        bookingNumber: booking.booking_number,
      });
      await sendEmail(
        EMAIL_ADMIN_NOTIFICATION,
        alertTemplate.subject,
        alertTemplate.html,
        "MEDIUM",
        "dispatch-summary",
      );
    } catch (err) {
      console.error("Failed to send dispatch summary:", err);
    }

    return {
      dispatched: true,
      crew_member_id: available.id,
      crew_member_name: available.name,
    };
  } catch (err) {
    console.error("Auto-dispatch error:", err);
    return { dispatched: false, error: String(err) };
  }
}

async function sendAlertNoCrewAvailable(
  booking: BookingForDispatch,
  serviceName: string,
  reason: string,
): Promise<void> {
  try {
    const formattedDate = new Date(booking.scheduled_date + "T12:00:00").toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    );
    const timeSlotLabel = booking.time_slot === "morning" ? "Morning (8 AM - 12 PM)" : "Afternoon (12 PM - 5 PM)";

    const alertTemplate = dispatchAlertEmail({
      crewName: null,
      date: formattedDate,
      timeSlot: timeSlotLabel,
      service: serviceName,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      location: booking.customer_location,
      bookingNumber: booking.booking_number,
      unassignedReason: reason,
    });
    await sendEmail(
      EMAIL_ADMIN_NOTIFICATION,
      alertTemplate.subject,
      alertTemplate.html,
      "HIGH",
      "dispatch-alert-unassigned",
    );
  } catch (err) {
    console.error("Failed to send no-crew alert:", err);
  }
}
