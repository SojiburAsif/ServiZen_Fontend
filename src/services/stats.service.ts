"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export interface RecentBooking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  client: { id: string; name: string };
  provider: { id: string; name: string };
  service: { id: string; name: string };
}

export interface MonthlyIncome {
  month: string;
  amount: number;
  bookingCount: number;
}

export interface WeeklyIncome {
  week: number;
  startDate: string;
  endDate: string;
  amount: number;
  bookingCount: number;
}

export interface AdminStats {
  role: "ADMIN";
  overview: {
    totalUsers: number;
    totalProviders: number;
    totalClients: number;
    totalServices: number;
    totalBookings: number;
    totalReviews: number;
    totalRevenue: number;
    pendingPayments: number;
    unpaidBookings: number;
  };
  bookingStatus: {
    PENDING: number;
    ACCEPTED: number;
    WORKING: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  recentBookings: RecentBooking[];
  monthlyIncome: MonthlyIncome[];
  weeklyIncome: WeeklyIncome[];
}

export interface ProviderStats {
  role: "PROVIDER";
  overview: {
    walletBalance?: number;
    totalEarned?: number;
    averageRating?: number;
    totalServices?: number;
    activeServices?: number;
    inactiveServices?: number;
    totalBookings?: number;
    completedBookings?: number;
    pendingBookings?: number;
    totalReviews?: number;
  };
  bookingStatus?: Record<string, number>;
  recentBookings?: RecentBooking[];
  monthlyIncome?: MonthlyIncome[];
  weeklyIncome?: WeeklyIncome[];
}

export interface ClientStats {
  role: "USER";
  overview: {
    totalBookings?: number;
    totalSpent?: number;
    upcomingBookings?: number;
    completedBookings?: number;
    cancelledBookings?: number;
    totalReviews?: number;
  };
  bookingStatus?: Record<string, number>;
  recentBookings?: RecentBooking[];
  monthlyIncome?: MonthlyIncome[];
  weeklyIncome?: WeeklyIncome[];
}

export type StatsData = AdminStats | ProviderStats | ClientStats;

const normalizeRole = (role?: unknown): StatsData["role"] | undefined => {
  if (typeof role !== "string") {
    return undefined;
  }

  const upperCased = role.toUpperCase();

  if (upperCased === "CLIENT" || upperCased === "PATIENT") {
    return "USER";
  }

  if (upperCased === "ADMIN" || upperCased === "PROVIDER" || upperCased === "USER") {
    return upperCased as StatsData["role"];
  }

  return undefined;
};

export async function getStats(): Promise<StatsData | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
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

    const res = await fetch(`${BASE_API_URL}/stats`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    const payload = json?.data ?? json ?? null;

    if (payload && typeof payload === "object" && "role" in payload) {
      const normalized = normalizeRole((payload as { role?: unknown }).role);
      if (normalized) {
        (payload as { role: StatsData["role"] }).role = normalized;
      }
    }

    return payload as StatsData | null;
  } catch {
    return null;
  }
}
