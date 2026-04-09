import { NextRequest, NextResponse } from "next/server";
import { setTokenInCookies } from "@/lib/tokenUtils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const sessionToken = searchParams.get("sessionToken");
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  if (accessToken) await setTokenInCookies("accessToken", accessToken);
  if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
  if (sessionToken) {
    await setTokenInCookies("better-auth.session_token", sessionToken, 24 * 60 * 60);
    await setTokenInCookies("isGoogleLogin", "true", 24 * 60 * 60);
  }

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
