"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export interface PaymentClient {
  id: string;
  name: string;
  email: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface PaymentService {
  id: string;
  name: string;
  price: number;
}

export interface PaymentBooking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  client: PaymentClient;
  provider: PaymentProvider;
  service: PaymentService;
}

export interface AdminPayment {
  id: string;
  amount: number;
  transactionId: string;
  stripeEventId: string;
  status: "UNPAID" | "PAID" | "REFUNDED";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGatewayData: any;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  booking: PaymentBooking;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  bookingId?: string;
  clientId?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: AdminPayment[];
  };
}

export interface PaymentDetailResponse {
  success: boolean;
  message: string;
  data: AdminPayment;
}

export async function getAllPayments(filters: PaymentFilters = {}): Promise<PaymentResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      throw new Error("No authentication token found");
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
    if (filters.bookingId) params.append("bookingId", filters.bookingId);
    if (filters.clientId) params.append("clientId", filters.clientId);
    if (filters.providerId) params.append("providerId", filters.providerId);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    const queryString = params.toString();
    const url = `${BASE_API_URL}/payments/all${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    throw error;
  }
}

export async function getPaymentById(paymentId: string): Promise<PaymentDetailResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      throw new Error("No authentication token found");
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

    const response = await fetch(`${BASE_API_URL}/payments/${paymentId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch payment:", error);
    throw error;
  }
}