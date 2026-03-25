/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { RoleType } from "./app/constants/role";
import { getServerEnv } from "./lib/env";
import { jwtUtils } from "./lib/jwtUtils";
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoute,
    UserRole,
} from "./lib/authUtils";

type AuthUserInfo = {
    email: string;
    needPasswordChange: boolean;
    emailVerified: boolean;
    role?: string;
};

const normalizeRole = (role: unknown): RoleType | null => {
    if (role === "ADMIN") return "ADMIN";
    if (role === "PROVIDER") return "PROVIDER";
    if (role === "USER" || role === "CLIENT" || role === "PATIENT") return "USER";
    return null;
};

const getFallbackDashboardRoute = (role: RoleType | null) => {
    return getDefaultDashboardRoute((role ?? "USER") as UserRole);
};

const resolveDashboardAliasOwner = (pathname: string): RoleType | null => {
    if (pathname.startsWith("/admin/dashboard")) return "ADMIN";
    if (pathname.startsWith("/provider/dashboard")) return "PROVIDER";
    if (pathname.startsWith("/user/dashboard") || pathname.startsWith("/client/dashboard")) return "USER";
    return null;
};

const getUserInfoFromApi = async (
    cookieHeader?: string,
    accessToken?: string,
    sessionToken?: string
): Promise<AuthUserInfo | null> => {
    try {
        const serverEnv = getServerEnv();
        const fallbackCookieParts: string[] = [];
        if (accessToken) fallbackCookieParts.push(`accessToken=${accessToken}`);
        if (sessionToken) fallbackCookieParts.push(`better-auth.session_token=${sessionToken}`);

        const finalCookieHeader = cookieHeader || fallbackCookieParts.join("; ");

        if (!finalCookieHeader) {
            return null;
        }

        const response = await fetch(`${serverEnv.BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: finalCookieHeader,
                ...(!sessionToken && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(sessionToken ? { "x-session-token": sessionToken } : {}),
            },
            cache: "no-store",
            signal: AbortSignal.timeout(1200),
        });

        if (!response.ok) {
            return null;
        }

        const payload = await response.json();
        return payload?.data ?? null;
    } catch {
        return null;
    }
};

export async function proxy(request: NextRequest) {
    try {
        const serverEnv = getServerEnv();
        const { pathname } = request.nextUrl;
        const accessToken = request.cookies.get("accessToken")?.value;
        const sessionToken = request.cookies.get("better-auth.session_token")?.value;
        const rawCookieHeader = request.headers.get("cookie") || undefined;

        const verifiedAccessToken = accessToken
            ? jwtUtils.verifyToken(accessToken, serverEnv.JWT_ACCESS_SECRET)
            : { success: false as const, data: null };

        const isValidAccessToken = Boolean(verifiedAccessToken.success);
        const decodedAccessToken = verifiedAccessToken.success ? verifiedAccessToken.data : null;
        const hasRoleClaim = Boolean(normalizeRole(decodedAccessToken?.role));
        const authUserInfo = (accessToken || sessionToken) && hasRoleClaim
            ? await getUserInfoFromApi(rawCookieHeader, accessToken, sessionToken)
            : null;
        const userRole =
            normalizeRole(decodedAccessToken?.role) ||
            normalizeRole(authUserInfo?.role) ||
            (sessionToken ? "USER" : null);
        const isAuthenticated = isValidAccessToken || Boolean(authUserInfo) || Boolean(sessionToken);

        const routeOwner = getRouteOwner(pathname);
        const isAuth = isAuthRoute(pathname);
        const dashboardAliasOwner = resolveDashboardAliasOwner(pathname);

        // Logged-in users should not access login/register pages.
        if (isAuth && isAuthenticated) {
            return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
        }

        // Support legacy/role-prefixed dashboard URLs by redirecting to the unified /dashboard route.
        if (dashboardAliasOwner) {
            if (!isAuthenticated || !userRole) {
                return NextResponse.redirect(new URL("/login", request.url));
            }

            if (dashboardAliasOwner !== userRole) {
                return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
            }

            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Only allow /change-password route if needPasswordChange is true
        if (pathname === "/change-password") {
            if (!isAuthenticated) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
            // Only allow if needPasswordChange is true
            const infoAny = authUserInfo as any;
            const needPasswordChange = Boolean(
                infoAny?.needPasswordChange ??
                infoAny?.needPasswordchange ??
                (typeof infoAny === "object" && Object.keys(infoAny).find(k => k.toLowerCase() === "needpasswordchange"))
            );
            if (needPasswordChange) {
                return NextResponse.next();
            }
            // If not needed, redirect to dashboard
            return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
        }

        // Public route.
        if (routeOwner === null) {
            return NextResponse.next();
        }

        // Protected route requires valid access token.
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const userInfo = authUserInfo;

        if (userInfo) {
            // Normalize needPasswordChange (support both spellings)
            const infoAny = userInfo as any;
            const needPasswordChange = Boolean(
                infoAny.needPasswordChange ??
                infoAny.needPasswordchange ??
                (typeof infoAny === "object" && Object.keys(infoAny).find(k => k.toLowerCase() === "needpasswordchange"))
            );

            if (userInfo.emailVerified === false) {
                if (pathname !== "/verify-email") {
                    const verifyEmailUrl = new URL("/verify-email", request.url);
                    verifyEmailUrl.searchParams.set("email", userInfo.email);
                    return NextResponse.redirect(verifyEmailUrl);
                }
                return NextResponse.next();
            }

            if (userInfo.emailVerified && pathname === "/verify-email") {
                return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
            }

            // If needPasswordChange is true, only allow /change-password, block all else
            if (needPasswordChange) {
                if (pathname !== "/change-password") {
                    return NextResponse.redirect(new URL("/change-password", request.url));
                }
                return NextResponse.next();
            }

            // If not needPasswordChange, block /change-password
            if (!needPasswordChange && pathname === "/change-password") {
                return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
            }
        }

        if (routeOwner === "COMMON") {
            return NextResponse.next();
        }

        if ((routeOwner === "ADMIN" || routeOwner === "PROVIDER" || routeOwner === "USER") && routeOwner !== userRole) {
            return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error in proxy middleware:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
    ],
};