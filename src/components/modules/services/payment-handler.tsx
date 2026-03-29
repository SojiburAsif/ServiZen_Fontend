/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { confirmPayment } from "@/services/booking.service";
import { Button } from "@/components/ui/button";

interface PaymentHandlerProps {
  bookingId: string;
}

export function PaymentHandler({ bookingId }: PaymentHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your transaction...");

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setMessage("Payment session not found. Please try again.");
        return;
      }

      try {
        const result = await confirmPayment(bookingId, sessionId);

        if (result?.success) {
          setStatus("success");
          setMessage("Payment confirmed successfully!");
          setTimeout(() => {
            router.push(`/dashboard/my-bookings/${bookingId}`); // Path adjusted to typical dashboard flow
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result?.message || "Payment verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    handlePaymentConfirmation();
  }, [bookingId, searchParams, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative max-w-md w-full overflow-hidden"
        >
          {/* Background Glow Effect */}
          <div className={`absolute inset-0 blur-3xl opacity-20 transition-colors duration-500 ${
            status === "success" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-blue-500"
          }`} />

          <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-10 text-center">
            
            {/* --- LOADING STATE --- */}
            {status === "loading" && (
              <div className="space-y-6">
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                  <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative z-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Securely Verifying</h2>
                  <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">{message}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                  <ShieldCheck className="size-3" /> Encrypted Transaction
                </div>
              </div>
            )}

            {/* --- SUCCESS STATE --- */}
            {status === "success" && (
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="bg-green-500/10 p-5 rounded-full ring-8 ring-green-500/5">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Got It!</h2>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Redirecting to details...</p>
                </div>
              </div>
            )}

            {/* --- ERROR STATE --- */}
            {status === "error" && (
              <div className="space-y-6">
                <motion.div 
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  className="flex justify-center"
                >
                  <div className="bg-red-500/10 p-5 rounded-full ring-8 ring-red-500/5">
                    <XCircle className="w-16 h-16 text-red-500" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Oops! Payment Failed</h2>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{message}</p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Button 
                    onClick={() => router.push(`/bookings/${bookingId}`)}
                    className="w-full h-12 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    Try Again <ArrowRight className="size-4" />
                  </Button>
                  <button 
                    onClick={() => router.push("/")}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}