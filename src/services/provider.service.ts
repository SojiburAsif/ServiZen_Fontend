"use server";

import { cookies } from "next/headers";

import { getServerEnv } from "@/lib/env";

// Provider Types
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

export interface ProviderListItem {
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

export interface ProviderListResponse {
	data: ProviderListItem[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages?: number;
	};
}

export type ProviderDetailedProfile = ProviderListItem;

export interface UpdateProviderData {
	name?: string;
	email?: string;
	profilePhoto?: string;
	contactNumber?: string;
	address?: string;
	registrationNumber?: string;
	experience?: number | string;
	bio?: string;
	specialties?: Array<{ specialtyId: string; shouldDelete?: boolean }>;
}

export type RawProviderSelfResponse = {
	success?: boolean;
	message?: string;
	data?: ProviderSelfProfile;
};

export type RawProviderListResponse = {
	success?: boolean;
	message?: string;
	data?: {
		data?: ProviderListItem[];
		meta?: {
			page: number;
			limit: number;
			total: number;
			totalPages?: number;
		};
	};
};

export type RawProviderDetailedResponse = {
	success?: boolean;
	message?: string;
	data?: ProviderDetailedProfile;
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

export async function getAllProviders(page: number = 1, limit: number = 10): Promise<ProviderListResponse | null> {
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

		const response = await fetch(`${BASE_API_URL}/providers?page=${page}&limit=${limit}`, {
			method: "GET",
			headers,
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch providers: ${response.status} ${response.statusText}`);
		}

		const payload = (await response.json()) as RawProviderListResponse;
		return {
			data: payload?.data?.data ?? [],
			meta: payload?.data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
		};
	} catch (error) {
		console.error("Failed to fetch all providers", error);
		return null;
	}
}

export async function getProviderById(providerId: string): Promise<ProviderDetailedProfile | null> {
	try {
		const { BASE_API_URL } = getServerEnv();

		const response = await fetch(`${BASE_API_URL}/providers/${providerId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch provider: ${response.status} ${response.statusText}`);
		}

		const payload = (await response.json()) as RawProviderDetailedResponse;
		return payload?.data ?? null;
	} catch (error) {
		console.error("Failed to fetch provider by ID", error);
		return null;
	}
}

export async function updateProvider(providerId: string, updateData: UpdateProviderData): Promise<boolean> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;
		const sessionToken = cookieStore.get("better-auth.session_token")?.value;

		if (!accessToken && !sessionToken) {
			throw new Error('No authentication token found');
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

		const response = await fetch(`${BASE_API_URL}/providers/${providerId}`, {
			method: "PATCH",
			headers,
			body: JSON.stringify(updateData),
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error('Failed to update provider');
		}

		return true;
	} catch (error) {
		console.error('Failed to update provider', error);
		throw error;
	}
}

export async function deleteProvider(providerId: string): Promise<boolean> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;
		const sessionToken = cookieStore.get("better-auth.session_token")?.value;

		if (!accessToken && !sessionToken) {
			throw new Error('No authentication token found');
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

		const response = await fetch(`${BASE_API_URL}/providers/${providerId}`, {
			method: "DELETE",
			headers,
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error('Failed to delete provider');
		}

		return true;
	} catch (error) {
		console.error('Failed to delete provider', error);
		throw error;
	}
}
