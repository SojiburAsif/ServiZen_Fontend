"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChangePasswordForm = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (result.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(result.message || "Failed to change password");
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = currentPassword && newPassword && confirmPassword && (newPassword === confirmPassword);

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
          {success ? (
            <motion.div key="success" {...variants} className="text-center py-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Success!</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Password changed successfully. Redirecting...</p>
            </motion.div>
          ) : (
            <motion.div key="form" {...variants}>
              <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Change Password
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Update your old password to a strong new one.
                </p>
              </header>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="group relative">
                    <ShieldCheck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Current Password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-emerald-400"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="New Password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-emerald-400"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm New Password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-emerald-400"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-4 h-[48px] transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 w-auto"
                  >
                    <ChevronLeft className="h-5 w-5 " /> Cancel
                  </Button>
                  
                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 dark:bg-emerald-500 dark:shadow-emerald-900/20 dark:hover:bg-emerald-600"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
