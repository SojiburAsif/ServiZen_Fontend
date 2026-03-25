"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { forgetPasswordAction, resetPasswordAction } from "@/services/auth.service";

type ForgotPasswordStep = "email" | "otp" | "password" | "success";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await forgetPasswordAction(email);

      if (result.success) {
        setStep("otp");
        setResendCooldown(60);
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (err: Error | unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPasswordAction(email, otp, newPassword);

      if (result.success) {
        setStep("success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.message || "Failed to reset password");
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
    setLoading(true);

    try {
      const result = await forgetPasswordAction(email);
      if (result.success) {
        setResendCooldown(60);
      } else {
        setError(result.message || "Failed to resend OTP");
      }
    } catch (err: Error | unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (step === "password") {
      setStep("otp");
      setNewPassword("");
      setConfirmPassword("");
    } else if (step === "otp") {
      setStep("email");
      setOtp("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {step === "email" && "Enter your email address to receive an OTP"}
        {step === "otp" && "Enter the OTP sent to your email"}
        {step === "password" && "Create a new password"}
        {step === "success" && "Password reset successfully!"}
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {step === "success" && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Password reset successfully! Redirecting to login...
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={!email || loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email2" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              id="email2"
              type="email"
              value={email}
              disabled
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-900"
            />
          </div>

          <div>
            <label htmlFor="otp2" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              OTP (6 digits)
            </label>
            <input
              id="otp2"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Go Back
            </button>

            <button
              type="submit"
              disabled={!otp || otp.length !== 6}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
            >
              Verify OTP
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || loading}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-slate-400"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 chars, uppercase, lowercase & number"
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Go Back
            </button>

            <button
              type="submit"
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

