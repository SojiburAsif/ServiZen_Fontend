/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface UpdateProfileData {
	name?: string;
	profilePhoto?: string;
	contactNumber?: string;
	address?: string;
}

export async function updateUserProfile(profileData: UpdateProfileData): Promise<LoggedInUserProfile | null> {
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

		const res = await fetch(`${BASE_API_URL}/auth/me`, {
			method: "PATCH",
			headers,
			body: JSON.stringify(profileData),
			cache: "no-store",
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.message || "Failed to update profile");
		}

		const json = await res.json();
		const payload = json?.data as RawUserProfile | undefined;

		if (!payload) {
			throw new Error("Invalid response from server");
		}

		return normalizeProfilePayload(payload);
	} catch (error) {
		console.error("Failed to update user profile", error);
		throw error;
	}
}

export interface AdminUser {
	id: string;
	email: string;
	name?: string;
	status: string;
	Role: 'ADMIN' | 'PROVIDER' | 'USER';
	emailVerified: boolean;
	isGoogleLogin: boolean;
	isDeleted?: boolean;
	image?: string;
	createdAt: string;
	updatedAt: string;
}

export interface UsersListResponse {
	data: AdminUser[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface DetailedUser {
	id: string;
	email: string;
	name?: string;
	status: string;
	Role: 'ADMIN' | 'PROVIDER' | 'USER';
	emailVerified: boolean;
	isGoogleLogin: boolean;
	image?: string;
	createdAt: string;
	updatedAt: string;
	admin?: any; // Full admin profile details if user is admin
	provider?: ProviderProfile | null;
	client?: ClientProfile | null;
}

// সার্ভিস ফাংশনগুলো (নোট: এগুলা server actions হিসেবে ব্যবহার করলে ভালো হয়)
export async function getAllUsers(page: number = 1, limit: number = 10): Promise<UsersListResponse | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const sessionToken = cookieStore.get('better-auth.session_token')?.value;

        if (!accessToken && !sessionToken) {
            throw new Error('No authentication token found');
        }

        const { BASE_API_URL } = getServerEnv();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const forwardedCookies: string[] = [];

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
            forwardedCookies.push(`accessToken=${accessToken}`);
        }

        if (sessionToken) {
            headers['x-session-token'] = sessionToken;
            forwardedCookies.push(`better-auth.session_token=${sessionToken}`);
        }

        if (forwardedCookies.length > 0) {
            headers.Cookie = forwardedCookies.join('; ');
        }

        // API কল করার সময় backend expects query params
        const res = await fetch(`${BASE_API_URL}/users/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('API Error:', {
                status: res.status,
                statusText: res.statusText,
                body: errorText
            });
            throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        // পোস্টম্যান ডাটা অনুযায়ী return json.data (যা meta এবং data ধারণ করে)
        return json.data; 
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function deleteUser(userId: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const sessionToken = cookieStore.get('better-auth.session_token')?.value;

        if (!accessToken && !sessionToken) {
            throw new Error('No authentication token found');
        }

        const { BASE_API_URL } = getServerEnv();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const forwardedCookies: string[] = [];

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
            forwardedCookies.push(`accessToken=${accessToken}`);
        }

        if (sessionToken) {
            headers['x-session-token'] = sessionToken;
            forwardedCookies.push(`better-auth.session_token=${sessionToken}`);
        }

        if (forwardedCookies.length > 0) {
            headers.Cookie = forwardedCookies.join('; ');
        }

        const res = await fetch(`${BASE_API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers,
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Failed to delete user');
        }

        return true;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function updateUserStatus(userId: string, status?: string, isDeleted?: boolean): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const sessionToken = cookieStore.get('better-auth.session_token')?.value;

        if (!accessToken && !sessionToken) {
            throw new Error('No authentication token found');
        }

        const { BASE_API_URL } = getServerEnv();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const forwardedCookies: string[] = [];

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
            forwardedCookies.push(`accessToken=${accessToken}`);
        }

        if (sessionToken) {
            headers['x-session-token'] = sessionToken;
            forwardedCookies.push(`better-auth.session_token=${sessionToken}`);
        }

        if (forwardedCookies.length > 0) {
            headers.Cookie = forwardedCookies.join('; ');
        }

        // Build request body with at least one field
        const requestBody: any = {};
        if (status !== undefined) requestBody.status = status;
        if (isDeleted !== undefined) requestBody.isDeleted = isDeleted;

        if (Object.keys(requestBody).length === 0) {
            throw new Error('At least one field (status or isDeleted) must be provided');
        }

        const res = await fetch(`${BASE_API_URL}/users/${userId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(requestBody),
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Failed to update user status');
        }

        return true;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export async function getUserById(userId: string): Promise<DetailedUser | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const sessionToken = cookieStore.get('better-auth.session_token')?.value;

        if (!accessToken && !sessionToken) {
            throw new Error('No authentication token found');
        }

        const { BASE_API_URL } = getServerEnv();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const forwardedCookies: string[] = [];

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
            forwardedCookies.push(`accessToken=${accessToken}`);
        }

        if (sessionToken) {
            headers['x-session-token'] = sessionToken;
            forwardedCookies.push(`better-auth.session_token=${sessionToken}`);
        }

        if (forwardedCookies.length > 0) {
            headers.Cookie = forwardedCookies.join('; ');
        }

        const res = await fetch(`${BASE_API_URL}/users/${userId}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('API Error:', {
                status: res.status,
                statusText: res.statusText,
                body: errorText
            });
            throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        return json?.data as DetailedUser;
    } catch (error) {
        console.error('Failed to fetch user by ID', error);
        return null;
    }
}

export interface CreateAdminPayload {
    name: string;
    email: string;
    password?: string;
    contactNumber?: string;
    address?: string;
    profilePhoto?: string;
    role?: "ADMIN";
}

export async function createAdmin(payload: CreateAdminPayload) {
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

        const res = await fetch(`${BASE_API_URL}/users/create-admin`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        const json = await res.json();
        
        if (!res.ok) {
            throw new Error(json.message || `Failed to create admin: ${res.status}`);
        }

        return json;
    } catch (error: any) {
        console.error("Error creating admin:", error);
        throw new Error(error.message || "Something went wrong while creating admin");
    }
}



export interface AdminProfileData {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        name: string;
        status: string;
        emailVerified: boolean;
        Role: string;
    }
}

export interface AdminsListResponse {
    data: AdminProfileData[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

export async function getAllAdmins(page: number = 1, limit: number = 10): Promise<AdminsListResponse | null> {
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

        const res = await fetch(`${BASE_API_URL}/users/admins?page=${page}&limit=${limit}`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("API Error fetching admins:", errorText);
            throw new Error(`Failed to fetch admins: ${res.status}`);
        }

        const json = await res.json();
        return json.data as AdminsListResponse;
    } catch (error) {
        console.error("Error fetching admins:", error);
        return null;
    }
}

