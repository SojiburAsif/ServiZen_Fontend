/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ChevronLeft,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        
        // Wait 1.5s
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            setRedirecting(true);
            setTimeout(() => router.push("/dashboard"), 1500);
          }
        }, 1500);
      } else {
        setError(result.message || "Failed to change password");
      }
    } catch (err: Error | any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const isFormValid = currentPassword && newPassword && confirmPassword && (newPassword === confirmPassword);

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-green-100 bg-white p-6 sm:p-10 shadow-2xl dark:border-green-900/20 dark:bg-[#0a0a0a]">
      {/* Decorative Brand Background Element */}
      <div className="absolute -right-6 -top-10 select-none text-[12rem] font-black text-green-500/5 dark:text-green-400/5">
        SZ
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {redirecting ? (
            <motion.div 
              key="redirect" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <RefreshCw className="h-12 w-12 animate-spin text-green-500" />
              <h2 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Processing...</h2>
            </motion.div>
          ) : success ? (
            <motion.div key="success" {...variants} className="text-center py-12">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">Security Updated!</h2>
              <p className="mt-4 font-medium text-gray-600 dark:text-gray-400">Your password was changed successfully.</p>
            </motion.div>
          ) : (
            <motion.div key="form" {...variants}>
              <header className="mb-10 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
                  <ShieldCheck className="h-3 w-3" /> Account Security
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                  Change <span className="text-green-600 italic">Password</span>
                </h1>
                <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Update your credentials below.
                </p>
              </header>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="mb-8 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                >
                  <Lock className="h-4 w-4 shrink-0" /> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  {/* Current Password Field */}
                  <div className="group relative">
                    <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      placeholder="Current Password"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-12 text-sm font-semibold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-green-500 dark:border-gray-800 dark:bg-[#111] dark:text-white dark:focus:border-green-500"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* New Password Field */}
                  <div className="group relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      placeholder="New Password"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-12 text-sm font-semibold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-green-500 dark:border-gray-800 dark:bg-[#111] dark:text-white dark:focus:border-green-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="group relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="Confirm New Password"
                      className={`w-full rounded-2xl border py-4 pl-12 pr-12 text-sm font-semibold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-green-500 dark:bg-[#111] dark:text-white ${
                        confirmPassword && newPassword !== confirmPassword 
                        ? "border-red-200 bg-red-50/30 focus:border-red-500 focus:ring-red-500 dark:border-red-900/50" 
                        : "border-gray-200 bg-gray-50/50 focus:border-green-500 dark:border-gray-800"
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-12 flex-1 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-transparent"
                  >
                    Cancel
                  </Button>
                  
                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="relative flex h-12 flex-1 items-center justify-center overflow-hidden rounded-xl bg-green-600 px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:grayscale dark:bg-green-600 dark:hover:bg-green-500"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> 
                        <span>Processing</span>
                      </div>
                    ) : (
                      "Update Password"
                    )}
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