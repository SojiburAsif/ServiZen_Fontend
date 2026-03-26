"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export interface BookingClient {
  id: string;
  name: string;
  email: string;
}

export interface BookingProvider {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  duration: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID";
  totalAmount: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  clientId: string;
  providerId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  client: BookingClient;
  provider: BookingProvider;
  service: BookingService;
}

export interface BookingsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Booking[];
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: Booking["status"];
  paymentStatus?: Booking["paymentStatus"];
  serviceId?: string;
}

export async function getProviderBookings(filters: BookingFilters = {}): Promise<BookingsResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      return null;
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

    // Build query parameters
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.serviceId) params.append("serviceId", filters.serviceId);

    const queryString = params.toString();
    const url = `${BASE_API_URL}/bookings/provider${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch provider bookings", error);
    return null;
  }
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      return null;
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

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch booking", error);
    return null;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
): Promise<Booking | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      return null;
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

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.error("Failed to update booking status", error);
    return null;
  }
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      return false;
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

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to cancel booking", error);
    return false;
  }
}