"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerEnv } from "@/lib/env";
import { cookies } from "next/headers";

interface BookingRequest {
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: {
      id: string;
      bookingDate: string;
      bookingTime: string;
      status: string;
      paymentStatus: string;
      totalAmount: number;
      client: { name: string; email: string };
      provider: { name: string; email: string; profilePhoto?: string };
      service: { name: string; price: number; duration: string };
    };
    payment: {
      id: string;
      amount: number;
      status: string;
    } | null;
    paymentUrl: string | null;
    payType: "PAY_NOW" | "PAY_LATER";
    paymentDueAt: string;
  };
}

async function createBooking(endpoint: string, data: BookingRequest): Promise<BookingResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken && !sessionToken) {
    throw new Error("Authentication required");
  }

  const { BASE_API_URL } = getServerEnv();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const forwardedCookies: string[] = [];

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
    forwardedCookies.push(`accessToken=${accessToken}`);
  }

  if (sessionToken) {
    headers["x-session-token"] = sessionToken;
    forwardedCookies.push(`better-auth.session_token=${sessionToken}`);
  }

  if (forwardedCookies.length > 0) {
    headers.Cookie = forwardedCookies.join("; ");
  }

  const response = await fetch(`${BASE_API_URL}/bookings/${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Booking failed: ${response.status}`);
  }

  return response.json();
}

export async function handleBookNow(formData: FormData) {
  try {
    const serviceId = formData.get("serviceId") as string;
    const bookingDate = formData.get("bookingDate") as string;
    const bookingTime = formData.get("bookingTime") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    if (!serviceId || !bookingDate || !bookingTime || !address || !city || isNaN(latitude) || isNaN(longitude)) {
      throw new Error("All required fields must be provided");
    }

    const bookingData: BookingRequest = {
      serviceId,
      bookingDate: new Date(bookingDate).toISOString(),
      bookingTime,
      address,
      city,
      latitude,
      longitude,
    };

    const result = await createBooking("book-now", bookingData);

    if (result.success && result.data.paymentUrl) {
      // Return the payment URL instead of redirecting
      return { success: true, paymentUrl: result.data.paymentUrl };
    } else {
      throw new Error(result.message || "Failed to create booking");
    }
  } catch (error) {
    console.error("Book now error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to book service" };
  }
}

export async function handleBookLater(formData: FormData) {
  try {
    const serviceId = formData.get("serviceId") as string;
    const bookingDate = formData.get("bookingDate") as string;
    const bookingTime = formData.get("bookingTime") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    if (!serviceId || !bookingDate || !bookingTime || !address || !city || isNaN(latitude) || isNaN(longitude)) {
      throw new Error("All required fields must be provided");
    }

    const bookingData: BookingRequest = {
      serviceId,
      bookingDate: new Date(bookingDate).toISOString(),
      bookingTime,
      address,
      city,
      latitude,
      longitude,
    };

    const result = await createBooking("book-later", bookingData);

    if (result.success) {
      // Return success instead of redirecting
      return { success: true, message: "Booking created successfully. You can pay later within the payment window." };
    } else {
      throw new Error(result.message || "Failed to create booking");
    }
  } catch (error) {
    console.error("Book later error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to book service" };
  }
}