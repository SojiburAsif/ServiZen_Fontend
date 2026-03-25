"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] p-6 text-gray-900 dark:text-white font-sans selection:bg-green-300">
      
      {/* Error Card */}
      <div className="max-w-md w-full bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl text-center space-y-6">
        
        {/* Animated Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center shadow-inner border-2 border-red-50 dark:border-red-900/50">
          <AlertTriangle className="w-10 h-10 animate-pulse" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Oops! <span className="text-red-600">Something broke.</span>
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">
            We re sorry, but an unexpected error occurred. Don t worry, you can try again.
          </p>
        </div>

        {/* Error Message Snippet (Helpful for debugging) */}
        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
          <p className="text-xs font-mono font-bold text-red-600 dark:text-red-400 break-words text-left line-clamp-2">
            {error.message || "Unknown error details"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={() => reset()} 
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Try Again
          </Button>
          
          <Link href="/" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full h-12 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-800 text-slate-900 dark:text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}