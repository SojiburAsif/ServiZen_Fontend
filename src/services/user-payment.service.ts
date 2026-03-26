"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export interface UserPayment {
  id: string;
  amount: number;
  status: "PAID";
  transactionId: string;
  stripeEventId: string;
  createdAt: string;
  updatedAt: string;
  booking: {
    id: string;
    status: UserPaymentBooking["status"];
    paymentStatus: UserPaymentBooking["paymentStatus"];
    service: {
      name: string;
    };
    provider: {
      name: string;
    };
  };
}

export interface UserPaymentBooking {
  status: "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID";
}

export interface UserPaymentsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: UserPayment[];
}

export interface UserPaymentFilters {
  page?: number;
  limit?: number;
  providerId?: string;
  serviceId?: string;
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

export async function getUserPayments(filters: UserPaymentFilters = {}): Promise<UserPaymentsResponse | null> {
  try {
    const { headers, BASE_API_URL } = await getAuthHeaders();

    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.providerId) params.append("providerId", filters.providerId);
    if (filters.serviceId) params.append("serviceId", filters.serviceId);

    const queryString = params.toString();
    const url = `${BASE_API_URL}/payments/my${queryString ? `?${queryString}` : ""}`;

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
    console.error("Failed to fetch user payments", error);
    return null;
  }
}