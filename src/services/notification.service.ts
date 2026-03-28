"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "PAYMENT_COMPLETED" | "PAYMENT_REMINDER" | "BOOKING_COMPLETED" | "REFUND_REQUEST" | "BOOKING_CANCELLED_BY_USER" | "BOOKING_CREATED_FOR_PROVIDER" | "BOOKING_PAYMENT_PAID_FOR_PROVIDER";
  isRead: boolean;
  bookingId?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Notification[];
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
}

export async function getMyNotifications(filters: NotificationFilters = {}): Promise<NotificationsResponse | null> {
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

    const queryString = params.toString();
    const url = `${BASE_API_URL}/notifications/my${queryString ? `?${queryString}` : ""}`;

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
    console.error("Failed to fetch notifications", error);
    return null;
  }
}

export async function getProviderNotifications(filters: NotificationFilters = {}): Promise<NotificationsResponse | null> {
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

    const queryString = params.toString();
    const url = `${BASE_API_URL}/notifications/provider/my${queryString ? `?${queryString}` : ""}`;

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
    console.error("Failed to fetch provider notifications", error);
    return null;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
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

    const response = await fetch(`${BASE_API_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers,
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to mark notification as read", error);
    return false;
  }
}