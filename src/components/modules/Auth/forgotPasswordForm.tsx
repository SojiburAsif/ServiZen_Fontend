"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { forgetPasswordAction, resetPasswordAction } from "@/services/auth.service";
import { ArrowLeft, CheckCircle2, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return setError("Please enter 6-digit OTP");
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      const result = await resetPasswordAction(email, otp, newPassword);
      if (result.success) {
        setStep("success");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(result.message || "Reset failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-emerald-900/30 dark:bg-slate-950/80">
      {/* Decorative Background Text */}
      <div className="absolute -right-4 -top-8 select-none text-9xl font-black text-emerald-500/5 dark:text-emerald-400/5">
        SZ
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {step === "success" ? (
            <motion.div key="success" {...variants} className="text-center py-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Success!</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Password reset done. Redirecting...</p>
            </motion.div>
          ) : (
            <motion.div key={step} {...variants}>
              <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {step === "email" && "Forgot Password?"}
                  {step === "otp" && "Verify OTP"}
                  {step === "password" && "New Password"}
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {step === "email" && "No worries, we'll send you reset instructions."}
                  {step === "otp" && `Enter the 6-digit code sent to ${email}`}
                  {step === "password" && "Must be at least 8 characters long."}
                </p>
              </header>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </motion.div>
              )}

              <form onSubmit={step === "email" ? handleEmailSubmit : step === "otp" ? handleOtpSubmit : handlePasswordSubmit} className="space-y-5">
                {step === "email" && (
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-emerald-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {step === "otp" && (
                  <div className="group relative text-center">
                    <ShieldCheck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="0 0 0 0 0 0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-4 pl-10 pr-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>
                )}

                {step === "password" && (
                  <div className="space-y-4">
                    <div className="group relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="New Password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Confirm Password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {step !== "email" && (
                    <button
                      type="button"
                      onClick={() => setStep(step === "password" ? "otp" : "email")}
                      className="flex items-center justify-center rounded-xl border border-slate-200 px-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 dark:bg-emerald-500 dark:shadow-emerald-900/20 dark:hover:bg-emerald-600"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
                  </button>
                </div>

                {step === "otp" && (
                  <p className="text-center text-sm text-slate-500">
                    Didn&apos;t receive code?{" "}
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleEmailSubmit}
                      className="font-bold text-emerald-600 hover:underline disabled:text-slate-400 dark:text-emerald-400"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend now"}
                    </button>
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};