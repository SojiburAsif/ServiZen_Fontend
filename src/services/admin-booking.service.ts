"use server";

import "server-only";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export type BookingStatus = "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

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
  name?: string;
  title?: string;
  price: number;
  duration?: string;
  isActive?: boolean;
}

export interface AdminBooking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  clientId: string;
  providerId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  client: BookingClient;
  provider: BookingProvider;
  service: BookingService;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus | string;
  paymentStatus?: PaymentStatus | string;
  clientId?: string;
  providerId?: string;
  serviceId?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: AdminBooking[];
  };
}

export interface BookingDetailResponse {
  success: boolean;
  message: string;
  data: AdminBooking;
}

export interface UpdateBookingData extends Record<string, unknown> {
  bookingDate?: string;
  bookingTime?: string;
  serviceId?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

async function buildAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken && !sessionToken) {
    throw new Error("No authentication token found");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
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

  return headers;
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      if (typeof data?.message === "string") return data.message;
      if (Array.isArray(data?.message)) return data.message.join(", ");
      if (typeof data?.error === "string") return data.error;
      if (typeof data?.message === "object" && data?.message) {
        return JSON.stringify(data.message);
      }
    }

    const text = await response.text();
    if (text?.trim()) return text;
  } catch {
    // ignore parsing issues
  }

  return fallback;
}

function cleanPayload<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  ) as Partial<T>;
}

export async function getAllBookings(
  filters: BookingFilters = {}
): Promise<BookingResponse> {
  try {
    const headers = await buildAuthHeaders();
    const { BASE_API_URL } = getServerEnv();

    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.status) params.set("status", String(filters.status));
    if (filters.paymentStatus) params.set("paymentStatus", String(filters.paymentStatus));
    if (filters.clientId) params.set("clientId", filters.clientId);
    if (filters.providerId) params.set("providerId", filters.providerId);
    if (filters.serviceId) params.set("serviceId", filters.serviceId);

    const url = `${BASE_API_URL}/bookings/all${params.toString() ? `?${params.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, `Failed to fetch bookings: ${response.status}`));
    }

    return (await response.json()) as BookingResponse;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw error;
  }
}

export async function getBookingById(bookingId: string): Promise<BookingDetailResponse> {
  try {
    const headers = await buildAuthHeaders();
    const { BASE_API_URL } = getServerEnv();

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, `Failed to fetch booking: ${response.status}`));
    }

    return (await response.json()) as BookingDetailResponse;
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    throw error;
  }
}

export async function updateBooking(
  bookingId: string,
  updateData: UpdateBookingData
): Promise<BookingDetailResponse> {
  try {
    const headers = await buildAuthHeaders();
    const { BASE_API_URL } = getServerEnv();

    const payload = cleanPayload(updateData);

    if (Object.keys(payload).length === 0) {
      throw new Error("At least one field is required to update the booking");
    }

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, `Failed to update booking: ${response.status}`));
    }

    return (await response.json()) as BookingDetailResponse;
  } catch (error) {
    console.error("Failed to update booking:", error);
    throw error;
  }
}

export async function cancelBooking(
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const headers = await buildAuthHeaders();
    const { BASE_API_URL } = getServerEnv();

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, `Failed to cancel booking: ${response.status}`));
    }

    return (await response.json()) as { success: boolean; message: string };
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    throw error;
  }
}
