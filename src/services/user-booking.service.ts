"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export interface UserBookingClient {
  id: string;
  name: string;
  email: string;
}

export interface UserBookingProvider {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface UserBookingService {
  id: string;
  name: string;
  price: number;
  duration: string;
  isActive: boolean;
}

export interface UserBooking {
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
  client: UserBookingClient;
  provider: UserBookingProvider;
  service: UserBookingService;
}

export interface UserBookingsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: UserBooking[];
}

export interface UserBookingFilters {
  page?: number;
  limit?: number;
  status?: UserBooking["status"];
  paymentStatus?: UserBooking["paymentStatus"];
  serviceId?: string;
}

export interface BookServicePayload {
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface BookServiceResponse {
  booking: UserBooking;
  payment: {
    id: string;
    amount: number;
    status: string;
    transactionId?: string;
  };
  paymentUrl: string | null;
  paymentDueAt: string | null;
  payType: "PAY_NOW" | "PAY_LATER";
}

export interface UpdateBookingPayload {
  bookingDate?: string;
  bookingTime?: string;
  serviceId?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  status?: UserBooking["status"];
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken && !sessionToken) {
    throw new Error("No authentication tokens found");
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

  return { headers, BASE_API_URL };
};

export async function getUserBookings(filters: UserBookingFilters = {}): Promise<UserBookingsResponse | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.serviceId) params.append("serviceId", filters.serviceId);

    const queryString = params.toString();
    const url = `${BASE_API_URL}/bookings/my${queryString ? `?${queryString}` : ""}`;

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
    console.error("Failed to fetch user bookings", error);
    return null;
  }
}

export async function getUserBookingById(bookingId: string): Promise<UserBooking | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

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
    console.error("Failed to fetch user booking", error);
    return null;
  }
}

export async function bookServiceNow(payload: BookServicePayload): Promise<BookServiceResponse | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const response = await fetch(`${BASE_API_URL}/bookings/book-now`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("Failed to book service now", error);
    return null;
  }
}

export async function bookServiceLater(payload: BookServicePayload): Promise<BookServiceResponse | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const response = await fetch(`${BASE_API_URL}/bookings/book-later`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("Failed to book service later", error);
    return null;
  }
}

export async function initiatePayment(bookingId: string): Promise<{ paymentUrl: string; paymentDueAt: string } | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}/initiate-payment`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("Failed to initiate payment", error);
    return null;
  }
}

export async function confirmPayment(bookingId: string, sessionId: string): Promise<UserBooking | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}/confirm-payment?sessionId=${sessionId}`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("Failed to confirm payment", error);
    return null;
  }
}

export async function updateUserBooking(bookingId: string, payload: UpdateBookingPayload): Promise<UserBooking | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const response = await fetch(`${BASE_API_URL}/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("Failed to update booking", error);
    return null;
  }
}

export async function cancelUserBooking(bookingId: string): Promise<boolean> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

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