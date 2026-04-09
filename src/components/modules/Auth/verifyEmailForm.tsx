/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle2, RefreshCcw } from "lucide-react";
import { clearPendingAuth, getPendingAuth } from "@/lib/pendingAuth";
import { loginAction, verifyEmailAction, sendVerifyEmailAction } from "@/services/auth.service";

export const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showOtpNotice = searchParams.get("notice") === "otp-sent";
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP Input Change
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError("");
    setResendCooldown(60);
    const res = await sendVerifyEmailAction(email);
    if (!res.success) {
      setError(res.message);
      setResendCooldown(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return;

    setError("");
    setLoading(true);

    try {
      const result = await verifyEmailAction(email, finalOtp);
      if (result.success) {
        setSuccess(true);
        // Show loading screen before redirect
        setTimeout(async () => {
          const pendingAuth = getPendingAuth(email);
          if (pendingAuth) {
            const loginResult = await loginAction({ email: pendingAuth.email, password: pendingAuth.password });
            if (loginResult.success) clearPendingAuth();
          }
          router.push("/dashboard");
          router.refresh();
        }, 1800);
      } else {
        // Show a more meaningful error for invalid OTP
        if (result.message && /otp|invalid|code|verify/i.test(result.message)) {
          setError("The code you entered is invalid or expired. Please check your email and try again.");
        } else {
          setError(result.message || "Verification failed. Please try again.");
        }
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl dark:border-green-900/30 dark:bg-black/60"
    >
      <div className="mb-8 flex flex-col items-center justify-center gap-4 text-center">
        <Link href="/" className="group flex items-center gap-2 transition-transform active:scale-95">
          <img src="/favicon.ico" alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Serv<span className="font-serif italic text-gray-500 dark:text-gray-400">ZEN</span>
          </span>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Verify Your Email</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check your inbox for the 6-digit code</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg mb-2">Verification Successful!</p>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-300">Redirecting to your dashboard...</span>
              <Loader2 className="h-5 w-5 animate-spin text-green-600 dark:text-green-400" />
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-center text-[11px] font-medium text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Display */}
              <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100/50 py-2 px-4 dark:bg-gray-800/50">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-[11px] font-medium text-gray-500">{email}</span>
              </div>

              {/* Modern Multi-Slot OTP Input */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="h-12 w-full max-w-[3.5rem] rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-gray-900 outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="group relative flex h-12 w-full items-center justify-center rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-50 dark:bg-green-500"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Verification"}
            </button>

            <div className="text-center">
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResend}
                className="inline-flex items-center gap-2 text-xs font-bold text-green-700 transition-colors hover:text-green-600 disabled:text-gray-400 dark:text-green-400"
              >
                <RefreshCcw size={14} className={resendCooldown > 0 ? "animate-spin" : ""} />
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}
      </AnimatePresence>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest text-gray-400">
          Powered by <span className="text-green-600 font-bold">ServZEN Security</span>
        </p>
      </div>
    </motion.div>
  );
};
