"use server";

import { cookies } from "next/headers";

import { getServerEnv } from "@/lib/env";

export interface ProviderSpecialtyItem {
	specialty?: {
		id: string;
		title?: string;
		description?: string;
		icon?: string | null;
	} | null;
}

export interface ProviderUserSnapshot {
	id: string;
	email?: string;
	name?: string;
	Role?: string;
	role?: string;
	status?: string;
	emailVerified?: boolean;
	image?: string | null;
	isDeleted?: boolean;
	deletedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface ProviderSelfProfile {
	id: string;
	userId?: string;
	name?: string;
	email?: string;
	profilePhoto?: string | null;
	contactNumber?: string | null;
	address?: string | null;
	registrationNumber?: string | null;
	experience?: number | string | null;
	bio?: string | null;
	averageRating?: number | null;
	walletBalance?: number | null;
	totalEarned?: number | null;
	isDeleted?: boolean;
	deletedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
	user?: ProviderUserSnapshot | null;
	specialties?: ProviderSpecialtyItem[];
}

type RawProviderSelfResponse = {
	success?: boolean;
	message?: string;
	data?: ProviderSelfProfile;
};

export async function getProviderSelfProfile(): Promise<ProviderSelfProfile | null> {
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

		const response = await fetch(`${BASE_API_URL}/providers/me`, {
			method: "GET",
			headers,
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as RawProviderSelfResponse;
		return payload?.data ?? null;
	} catch (error) {
		console.error("Failed to fetch provider profile", error);
		return null;
	}
}
