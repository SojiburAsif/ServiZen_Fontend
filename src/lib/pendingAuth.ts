"use client";

type PendingAuthState = {
  email: string;
  password: string;
  createdAt: number;
};

const PENDING_AUTH_KEY = "servizen.pending-auth";
const PENDING_AUTH_TTL_MS = 10 * 60 * 1000;

const canUseStorage = () => typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

export const setPendingAuth = (email: string, password: string) => {
  if (!canUseStorage() || !email || !password) return;

  const payload: PendingAuthState = {
    email,
    password,
    createdAt: Date.now(),
  };

  window.sessionStorage.setItem(PENDING_AUTH_KEY, JSON.stringify(payload));
};

export const getPendingAuth = (email?: string): PendingAuthState | null => {
  if (!canUseStorage()) return null;

  const raw = window.sessionStorage.getItem(PENDING_AUTH_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PendingAuthState>;
    if (!parsed.email || !parsed.password || typeof parsed.createdAt !== "number") {
      return null;
    }

    const isExpired = Date.now() - parsed.createdAt > PENDING_AUTH_TTL_MS;
    if (isExpired) {
      clearPendingAuth();
      return null;
    }

    if (email && parsed.email.toLowerCase() !== email.toLowerCase()) {
      return null;
    }

    return {
      email: parsed.email,
      password: parsed.password,
      createdAt: parsed.createdAt,
    };
  } catch {
    clearPendingAuth();
    return null;
  }
};

export const clearPendingAuth = () => {
  if (!canUseStorage()) return;
  window.sessionStorage.removeItem(PENDING_AUTH_KEY);
};
