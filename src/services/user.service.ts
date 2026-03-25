"use server";

import { cookies } from "next/headers";

import { getServerEnv } from "@/lib/env";

export interface BookingRecord {
	id: string;
	bookingDate?: string;
	bookingTime?: string;
	status?: string;
	paymentStatus?: string;
	totalAmount?: number;
	address?: string;
	city?: string;
	latitude?: number;
	longitude?: number;
	clientId?: string;
	providerId?: string;
	serviceId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ReviewRecord {
	id: string;
	rating?: number;
	comment?: string;
	bookingId?: string;
	clientId?: string;
	serviceId?: string;
	providerId?: string;
	createdAt?: string;
}

export interface ProviderServiceRecord {
	id: string;
	name?: string;
	status?: string;
	price?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface ProviderSpecialtyRecord {
	id: string;
	specialty?: {
		id: string;
		name?: string;
		description?: string;
	} | null;
}

export interface ClientProfile {
	id: string;
	name?: string;
	email?: string;
	profilePhoto?: string | null;
	contactNumber?: string | null;
	address?: string | null;
	city?: string | null;
	isDeleted?: boolean;
	deletedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
	userId?: string;
	bookings?: BookingRecord[];
	reviews?: ReviewRecord[];
}

export interface ProviderProfile {
	id: string;
	name?: string;
	email?: string;
	profilePhoto?: string | null;
	contactNumber?: string | null;
	address?: string | null;
	city?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	status?: string;
	isDeleted?: boolean;
	deletedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
	userId?: string;
	services?: ProviderServiceRecord[];
	bookings?: BookingRecord[];
	reviews?: ReviewRecord[];
	specialties?: ProviderSpecialtyRecord[];
}

export interface LoggedInUserProfile {
	id: string;
	name?: string;
	email?: string;
	role: "ADMIN" | "PROVIDER" | "USER";
	status?: string;
	emailVerified: boolean;
	needPasswordChange: boolean;
	isDeleted?: boolean;
	deletedAt?: string | null;
	image?: string | null;
	createdAt?: string;
	updatedAt?: string;
	client?: ClientProfile | null;
	provider?: ProviderProfile | null;
}

type RawUserProfile = Omit<LoggedInUserProfile, "role" | "emailVerified" | "needPasswordChange"> & {
	role?: string;
	Role?: string;
	emailVerified?: boolean;
	needPasswordChange?: boolean;
	needPasswordchange?: boolean;
};

const ensureArray = <T>(value?: T[] | null): T[] => {
	if (!Array.isArray(value)) {
		return [];
	}
	return value;
};

const normalizeRoleValue = (role?: string): LoggedInUserProfile["role"] => {
	const normalized = (role || "USER").toUpperCase();
	if (normalized === "CLIENT" || normalized === "PATIENT") {
		return "USER";
	}
	if (normalized === "ADMIN" || normalized === "PROVIDER" || normalized === "USER") {
		return normalized as LoggedInUserProfile["role"];
	}
	return "USER";
};

const normalizeProfilePayload = (payload: RawUserProfile): LoggedInUserProfile => {
	const client = payload.client
		? {
				...payload.client,
				bookings: ensureArray(payload.client.bookings),
				reviews: ensureArray(payload.client.reviews),
			}
		: null;

	const provider = payload.provider
		? {
				...payload.provider,
				services: ensureArray(payload.provider.services),
				bookings: ensureArray(payload.provider.bookings),
				reviews: ensureArray(payload.provider.reviews),
				specialties: ensureArray(payload.provider.specialties),
			}
		: null;

	return {
		id: payload.id,
		name: payload.name,
		email: payload.email,
		role: normalizeRoleValue(payload.role ?? payload.Role),
		status: payload.status,
		emailVerified: Boolean(payload.emailVerified),
		needPasswordChange: Boolean(
			payload.needPasswordChange ?? payload.needPasswordchange ?? false,
		),
		isDeleted: payload.isDeleted,
		deletedAt: payload.deletedAt,
		image: payload.image,
		createdAt: payload.createdAt,
		updatedAt: payload.updatedAt,
		client,
		provider,
	};
};

export async function getLoggedInUserProfile(): Promise<LoggedInUserProfile | null> {
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

		const res = await fetch(`${BASE_API_URL}/auth/me`, {
			method: "GET",
			headers,
			cache: "no-store",
		});

		if (!res.ok) {
			return null;
		}

		const json = await res.json();
		const payload = json?.data as RawUserProfile | undefined;

		if (!payload) {
			return null;
		}

		return normalizeProfilePayload(payload);
	} catch (error) {
		console.error("Failed to fetch logged in user profile", error);
		return null;
	}
}

