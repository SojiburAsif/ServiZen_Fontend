"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearPendingAuth, getPendingAuth } from "@/lib/pendingAuth";
import { loginAction, verifyEmailAction } from "@/services/auth.service";

type AuthMeta = {
  email?: string;
  needPasswordChange?: boolean;
  needPasswordchange?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object";
};

const resolveAuthMeta = (payload: unknown): AuthMeta => {
  if (!isRecord(payload)) return {};

  const user = isRecord(payload.user) ? payload.user : payload;

  return {
    email: typeof user.email === "string" ? user.email : undefined,
    needPasswordChange:
      typeof user.needPasswordChange === "boolean"
        ? user.needPasswordChange
        : typeof user.needPasswordchange === "boolean"
          ? user.needPasswordchange
          : undefined,
  };
};

export const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dashboardPath = "/dashboard";
  const showOtpNotice = searchParams.get("notice") === "otp-sent";
  const [email, setEmail] = useState("");
  const [isEmailPrefilled, setIsEmailPrefilled] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      setIsEmailPrefilled(true);
      return;
    }

    setIsEmailPrefilled(false);
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is missing. Please register again.");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyEmailAction(email, otp);

      if (result.success) {
        const authMeta = resolveAuthMeta((result as { data?: unknown }).data);
        const needPasswordChange = Boolean(authMeta.needPasswordChange);
        const resolvedEmail = authMeta.email || email;
        const pendingAuth = getPendingAuth(resolvedEmail);

        if (pendingAuth) {
          const loginResult = await loginAction({
            email: pendingAuth.email,
            password: pendingAuth.password,
          });

          if (loginResult.success) {
            clearPendingAuth();
          }
        }

        setSuccess(true);
        setOtp("");
        setTimeout(() => {
          if (needPasswordChange) {
            router.push(`/reset-password?email=${encodeURIComponent(resolvedEmail)}`);
            router.refresh();
            return;
          }

          router.push(dashboardPath);
          router.refresh();
        }, 2000);
      } else {
        setError(result.message || "Verification failed");
      }
    } catch (err: Error | unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendLoading(true);

    try {
      // TODO: Implement resend OTP endpoint
      // const result = await resendOtpAction(email);
      setResendCooldown(60);
      setSuccess(false);
      setOtp("");
    } catch (err: Error | unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to resend OTP";
      setError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/50 p-6 shadow-xl dark:border-emerald-700/40 dark:from-zinc-900 dark:to-emerald-950/20">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900 text-emerald-100 shadow-sm">
        SZ
      </div>

      <h1 className="text-2xl font-bold text-emerald-950 dark:text-emerald-200">Verify Email</h1>
      <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-300/70">
        Enter the OTP sent to your email to verify your account
      </p>

      {showOtpNotice && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-200">
          We sent a verification OTP to your email. Verify now to continue.
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Email verified successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-emerald-900 dark:text-emerald-200">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            readOnly={isEmailPrefilled}
            className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-950 placeholder-emerald-700/40 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-emerald-800/60 dark:bg-zinc-900 dark:text-emerald-100 dark:placeholder-emerald-300/40"
          />
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-emerald-900 dark:text-emerald-200">
            OTP (6 digits)
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            pattern="\d{6}"
            disabled={loading}
            className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-center text-emerald-950 placeholder-emerald-700/40 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-emerald-50 dark:border-emerald-800/60 dark:bg-zinc-900 dark:text-emerald-100 dark:placeholder-emerald-300/40 dark:disabled:bg-zinc-800"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={!email || !otp || otp.length !== 6 || loading}
            className="flex-1 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || resendLoading}
            className="rounded px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:text-slate-400 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-emerald-800/80 dark:text-emerald-300/70">
        OTP expires in 10 minutes
      </p>
    </div>
  );
};
