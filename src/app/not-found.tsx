"use client";

import Link from "next/link";
import { MoveLeft, Ghost, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
      
      {/* Animated Icon Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex items-center justify-center mb-8"
      >
        <motion.div 
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-emerald-500/20"
        >
          <SearchX size={150} strokeWidth={1} />
        </motion.div>
        <motion.div 
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute text-emerald-600 dark:text-emerald-400"
        >
          <Ghost size={60} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Title & 404 Text */}
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-8xl font-black text-zinc-900 dark:text-white drop-shadow-sm mb-4"
      >
        4<span className="text-emerald-500">0</span>4
      </motion.h1>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-4"
      >
        Oops! Page not found.
      </motion.h2>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-[500px] text-zinc-600 dark:text-zinc-400 mb-8"
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let s get you back on track.
      </motion.p>

      {/* Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-lg shadow-emerald-500/20 group">
          <Link href="/">
            Return Home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-emerald-200 dark:border-emerald-900 group">
          <button onClick={() => window.history.back()}>
            <MoveLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </Button>
      </motion.div>

      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
    </div>
  );
}
