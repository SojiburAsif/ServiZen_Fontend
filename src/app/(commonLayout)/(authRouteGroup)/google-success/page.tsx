import { setTokenInCookies } from "@/lib/tokenUtils";
import { redirect } from "next/navigation";

export default async function GoogleSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const accessToken = typeof params.accessToken === "string" ? params.accessToken : null;
  const refreshToken = typeof params.refreshToken === "string" ? params.refreshToken : null;
  const sessionToken = typeof params.sessionToken === "string" ? params.sessionToken : null;
  const redirectPath = typeof params.redirect === "string" ? params.redirect : "/dashboard";

  if (accessToken) {
    await setTokenInCookies("accessToken", accessToken);
  }

  if (refreshToken) {
    await setTokenInCookies("refreshToken", refreshToken);
  }

  if (sessionToken) {
    await setTokenInCookies("better-auth.session_token", sessionToken, 24 * 60 * 60);
  }

  redirect(redirectPath);
}
