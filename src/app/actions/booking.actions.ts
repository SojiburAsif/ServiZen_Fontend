"use server";

import { updateUserBooking } from "@/services/user-booking.service";
import { revalidatePath } from "next/cache";

export async function updateBookingStatusAction(bookingId: string, status: "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED") {
  try {
    await updateUserBooking(bookingId, { status });
    revalidatePath("/dashboard/my-bookings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status", error);
    return { success: false, error: "Failed to update status" };
  }
}