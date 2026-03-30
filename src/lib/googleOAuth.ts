const GOOGLE_OAUTH_LOCK_KEY = "google_oauth_inflight_at";
const GOOGLE_OAUTH_LOCK_TTL_MS = 2 * 60 * 1000;

export const clearGoogleOAuthLock = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(GOOGLE_OAUTH_LOCK_KEY);
};

const canStartGoogleOAuth = () => {
  if (typeof window === "undefined") return false;

  const raw = window.sessionStorage.getItem(GOOGLE_OAUTH_LOCK_KEY);
  if (!raw) return true;

  const startedAt = Number(raw);
  if (!Number.isFinite(startedAt)) {
    window.sessionStorage.removeItem(GOOGLE_OAUTH_LOCK_KEY);
    return true;
  }

  if (Date.now() - startedAt > GOOGLE_OAUTH_LOCK_TTL_MS) {
    window.sessionStorage.removeItem(GOOGLE_OAUTH_LOCK_KEY);
    return true;
  }

  return false;
};

type StartGoogleOAuthOptions = {
  apiBaseUrl: string;
  callbackPath: string;
  appOrigin?: string;
};

export const startGoogleOAuth = ({
  apiBaseUrl,
  callbackPath,
  appOrigin,
}: StartGoogleOAuthOptions): { started: boolean; reason?: string } => {
  if (typeof window === "undefined") {
    return { started: false, reason: "not_in_browser" };
  }

  if (!canStartGoogleOAuth()) {
    return { started: false, reason: "already_inflight" };
  }

  const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, "");
  const parsedUrl = new URL(normalizedBaseUrl);
  const backendOrigin = parsedUrl.origin;
  const stableOrigin = (appOrigin || window.location.origin).replace(/\/+$/, "");
  const normalizedPath = callbackPath.startsWith("/") ? callbackPath : `/${callbackPath}`;
  const callbackURL = new URL(normalizedPath, stableOrigin).toString();

  window.sessionStorage.setItem(GOOGLE_OAUTH_LOCK_KEY, String(Date.now()));
  window.location.assign(
    `${backendOrigin}/api/v1/auth/login/google?callbackURL=${encodeURIComponent(callbackURL)}`
  );

  return { started: true };
};
