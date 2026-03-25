/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { getServerEnv } from "@/lib/env";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { jwtUtils } from "@/lib/jwtUtils";

import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginPayload, ILoginSuccessData, IRegisterPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type AuthUserInfo = {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image?: string;
    status?: string;
    isDeleted?: boolean;
    emailVerified: boolean;
};

const pickFirstString = (...values: unknown[]) => {
    for (const value of values) {
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed.length > 0) return trimmed;
        }
    }
    return "";
};

const isEmailLike = (value: string) => {
    return value.includes("@") && value.includes(".");
};

const findEmailDeep = (source: unknown, depth = 0): string => {
    if (!source || depth > 5) return "";

    if (typeof source === "string") {
        return isEmailLike(source) ? source : "";
    }

    if (Array.isArray(source)) {
        for (const item of source) {
            const found = findEmailDeep(item, depth + 1);
            if (found) return found;
        }
        return "";
    }

    if (typeof source === "object") {
        const record = source as Record<string, unknown>;

        const direct = pickFirstString(
            record.email,
            record.emailAddress,
            record.userEmail,
            record.preferred_username,
            record.upn
        );

        if (isEmailLike(direct)) {
            return direct;
        }

        for (const value of Object.values(record)) {
            const found = findEmailDeep(value, depth + 1);
            if (found) return found;
        }
    }

    return "";
};

const tryParseJson = (value: string): Record<string, unknown> | null => {
    try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === "object") {
            return parsed as Record<string, unknown>;
        }
    } catch {
        return null;
    }

    return null;
};

const decodeBase64Loose = (value: string): string | null => {
    try {
        return Buffer.from(value, "base64").toString("utf8");
    } catch {
        return null;
    }
};

const decodeBase64UrlLoose = (value: string): string | null => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(paddingLength);
    return decodeBase64Loose(padded);
};

const decodeCookieObject = (value: string): Record<string, unknown> | null => {
    const candidates: string[] = [value];

    try {
        const decodedUri = decodeURIComponent(value);
        if (decodedUri !== value) {
            candidates.push(decodedUri);
        }
    } catch {
        // ignore
    }

    const base64Decoded = decodeBase64Loose(value);
    if (base64Decoded) candidates.push(base64Decoded);

    const base64UrlDecoded = decodeBase64UrlLoose(value);
    if (base64UrlDecoded) candidates.push(base64UrlDecoded);

    for (const candidate of candidates) {
        const parsed = tryParseJson(candidate);
        if (parsed) return parsed;
    }

    return null;
};

const normalizeRoleValue = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const normalized = value.trim().toUpperCase();
    if (!normalized) return null;
    if (normalized === "CLIENT" || normalized === "PATIENT") return "USER";
    return normalized;
};

const decodeJwtObject = (token?: string): Record<string, unknown> | null => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = jwtUtils.decodedToken(token);
    if (!decoded || typeof decoded !== "object") return null;
    return decoded as Record<string, unknown>;
};

const hasAccessRoleClaim = (accessToken?: string) => {
    const decoded = decodeJwtObject(accessToken);
    return Boolean(normalizeRoleValue(decoded?.role));
};

const normalizeUserInfo = (rawData: any, authToken?: string): AuthUserInfo | null => {
    const data = rawData?.user && typeof rawData.user === "object" ? rawData.user : rawData;

    const decoded = authToken ? jwtUtils.decodedToken(authToken) : null;
    const rawEmail = pickFirstString(
        data?.email,
        rawData?.email,
        data?.emailAddress,
        rawData?.emailAddress,
        data?.userEmail,
        rawData?.userEmail,
        decoded?.email,
        decoded?.preferred_username,
        decoded?.upn,
        findEmailDeep(data),
        findEmailDeep(rawData),
        findEmailDeep(decoded),
        decoded?.sub
    );
    const email = isEmailLike(rawEmail) ? rawEmail : "";

    const name = pickFirstString(
        data?.name,
        rawData?.name,
        data?.fullName,
        rawData?.fullName,
        data?.username,
        rawData?.username,
        decoded?.name,
        decoded?.username,
        decoded?.given_name,
        "User"
    );

    const image = pickFirstString(
        data?.image,
        rawData?.image,
        data?.profilePhoto,
        rawData?.profilePhoto,
        data?.avatar,
        rawData?.avatar,
        decoded?.picture,
        decoded?.image
    ) || undefined;

    const role =
        normalizeRoleValue(data?.role) ||
        normalizeRoleValue(rawData?.role) ||
        normalizeRoleValue(data?.userRole) ||
        normalizeRoleValue(rawData?.userRole) ||
        normalizeRoleValue(decoded?.role) ||
        "USER";

    return {
        needPasswordChange: Boolean(data?.needPasswordChange ?? rawData?.needPasswordChange ?? false),
        email,
        name,
        role,
        image,
        status: data?.status ?? rawData?.status,
        isDeleted: data?.isDeleted ?? rawData?.isDeleted,
        emailVerified: Boolean(data?.emailVerified ?? rawData?.emailVerified ?? false),
    };
};

const getFallbackUserFromToken = (accessToken?: string): AuthUserInfo | null => {
    if (!accessToken) return null;

    const decoded = jwtUtils.decodedToken(accessToken);
    if (!decoded || typeof decoded !== "object") return null;

    const rawEmail = pickFirstString(
        decoded.email,
        decoded.preferred_username,
        decoded.upn,
        findEmailDeep(decoded),
        decoded.sub
    );
    const email = isEmailLike(rawEmail) ? rawEmail : "";
    const name = pickFirstString(decoded.name, decoded.username, decoded.given_name, "User");
    const role = normalizeRoleValue(decoded.role) || "USER";

    return {
        needPasswordChange: false,
        email,
        name,
        role,
        image: pickFirstString(decoded.picture, decoded.image) || undefined,
        emailVerified: true,
    };
};

const getFallbackUserFromCookies = (
    allCookies: { name: string; value: string }[],
    accessToken?: string,
    sessionToken?: string
): AuthUserInfo | null => {
    const decodedCandidates: Record<string, unknown>[] = [];

    const decodedAccess = decodeJwtObject(accessToken);
    const decodedSession = decodeJwtObject(sessionToken);

    if (decodedAccess) decodedCandidates.push(decodedAccess);
    if (decodedSession) decodedCandidates.push(decodedSession);

    for (const cookie of allCookies) {
        const decoded = decodeJwtObject(cookie.value);
        if (decoded) decodedCandidates.push(decoded);

        const decodedCookieObject = decodeCookieObject(cookie.value);
        if (decodedCookieObject) decodedCandidates.push(decodedCookieObject);
    }

    const email = decodedCandidates
        .map((d) => pickFirstString(d.email, d.preferred_username, d.upn, findEmailDeep(d), d.sub))
        .find((value) => isEmailLike(value)) || "";

    const name = decodedCandidates
        .map((d) => pickFirstString(d.name, d.username, d.given_name, d.family_name, d.nickname))
        .find(Boolean) || "User";

    const image = decodedCandidates
        .map((d) => pickFirstString(d.picture, d.image, d.avatar, d.photoURL))
        .find(Boolean);

    const role = decodedCandidates
        .map((d) => normalizeRoleValue(d.role))
        .find(Boolean) || "USER";

    return {
        needPasswordChange: false,
        email,
        name,
        role,
        image: image || undefined,
        emailVerified: true,
    };
};

const getUserFromSessionEndpoint = async (
    baseApiUrl: string,
    headers: Record<string, string>,
    accessToken?: string,
    sessionToken?: string
): Promise<AuthUserInfo | null> => {
    const endpoints = ["/auth/get-session", "/auth/session"];

    for (const endpoint of endpoints) {
        try {
            const res = await fetch(`${baseApiUrl}${endpoint}`, {
                method: "GET",
                headers,
                cache: "no-store",
            });

            if (!res.ok) continue;

            const payload = await res.json();
            const userLike =
                payload?.data?.user ??
                payload?.data?.session?.user ??
                payload?.user ??
                payload?.session?.user ??
                payload?.data ??
                payload;

            const normalized = normalizeUserInfo(userLike, accessToken || sessionToken);
            if (normalized) return normalized;
        } catch {
            // try next endpoint
        }
    }

    return null;
};

const createAuthCookieHeader = (
    accessToken?: string,
    sessionToken?: string,
    refreshToken?: string
) => {
    const cookieParts: string[] = [];

    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (sessionToken) cookieParts.push(`better-auth.session_token=${sessionToken}`);
    if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);

    return cookieParts.join("; ");
};

const createRawCookieHeader = (allCookies: { name: string; value: string }[]) => {
    return allCookies
        .filter((cookie) => cookie?.name && typeof cookie.value === "string")
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
};

const createAuthHeaders = (
    cookieHeader: string,
    accessToken?: string,
    sessionToken?: string
) => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
    };

    // Backend checkAuth expects JWT payload with role in Authorization.
    // Never send better-auth session token as Bearer token.
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    if (sessionToken) {
        headers["x-session-token"] = sessionToken;
    }

    return headers;
};

export const loginAction = async (payload: ILoginPayload): Promise<ApiResponse<ILoginSuccessData> | ApiErrorResponse> => {
    const parsedPayload = AuthValidation.loginUserValidationSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<ILoginSuccessData>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token} = response.data;
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        return response;
        
    } catch (error : any) {
        return {
            success: false,
            message: `Login failed: ${error.message}`,
        }
    }
}

export const registerAction = async (
    payload: IRegisterPayload
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    const parsedPayload = AuthValidation.registerUserValidationSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    const { confirmPassword, ...registerPayload } = parsedPayload.data;
    void confirmPassword;

    try {
        const response = await httpClient.post<unknown>("/auth/register", registerPayload);
        return response;
    } catch (error: any) {
        return {
            success: false,
            message: `Register failed: ${error.message}`,
        };
    }
};


export async function getUserInfo(): Promise<AuthUserInfo | null> {
    let accessToken: string | undefined;
    try {
        const serverEnv = getServerEnv();
        const cookieStore = await cookies();
        const rawCookies = cookieStore.getAll();
        const rawCookieHeader = createRawCookieHeader(rawCookies);
        accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;
        const fallbackUser =
            getFallbackUserFromToken(accessToken) ||
            getFallbackUserFromCookies(rawCookies, accessToken, sessionToken);

        if (!accessToken && !sessionToken) {
            return null;
        }

        const cookieHeader = rawCookieHeader || createAuthCookieHeader(accessToken, sessionToken, refreshToken);
        const authToken = accessToken || sessionToken;
        const canCallMeEndpoint = hasAccessRoleClaim(accessToken);
        const authHeaders = createAuthHeaders(cookieHeader, accessToken, sessionToken);

        if (!cookieHeader) {
            return null;
        }

        // Backend checkAuth for /auth/me requires role in access-token claims.
        // Skip the call when that claim is absent to avoid repeated 403 spam.
        if (!canCallMeEndpoint) {
            const sessionUser = await getUserFromSessionEndpoint(
                serverEnv.BASE_API_URL,
                authHeaders,
                accessToken,
                sessionToken
            );

            return sessionUser || fallbackUser;
        }

        const res = await fetch(`${serverEnv.BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: authHeaders,
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status !== 401 && res.status !== 403) {
                console.error("Failed to fetch user info:", res.status, res.statusText);
            }
            const sessionUser = await getUserFromSessionEndpoint(
                serverEnv.BASE_API_URL,
                authHeaders,
                accessToken,
                sessionToken
            );

            return sessionUser || fallbackUser;
        }

        const payload = await res.json();
        const normalizedUser = normalizeUserInfo(payload?.data, authToken);

        return normalizedUser || fallbackUser;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return getFallbackUserFromToken(accessToken);
    }
}

export async function getMeApiResponse() {
    try {
        const user = await getUserInfo();

        if (!user) {
            return NextResponse.json({ success: false, data: null }, { status: 401 });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, data: null }, { status: 500 });
    }
}

export async function logoutApiResponse() {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    response.cookies.set("better-auth.session_token", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}