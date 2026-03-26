"use client";

import Link from "next/link";
import { MoveLeft, Ghost, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white font-sans selection:bg-green-300 flex flex-col items-center justify-center p-6 text-center">
      
      {/* --- Background Watermark "SZ" --- */}
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none select-none pointer-events-none transform -rotate-6">
        SZ
      </div>

      {/* --- Main Content Container --- */}
      <div className=" z-10 flex flex-col items-center">
        
        {/* Animated Icon Section */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="text-green-600/10 dark:text-green-400/10">
            <SearchX size={180} strokeWidth={0.5} />
          </div>
          <div className="absolute text-green-600 dark:text-green-400 animate-bounce transition-all duration-1000">
            <Ghost size={80} strokeWidth={1.2} />
          </div>
        </div>

        {/* 404 Header */}
        <div className="space-y-2">
          <h1 className="text-9xl font-black tracking-tighter text-zinc-900 dark:text-white drop-shadow-2xl">
            4<span className="text-green-600 dark:text-green-500">0</span>4
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Lost in Space?
          </h2>
          
          <p className="max-w-[500px] text-base md:text-lg text-zinc-600 dark:text-zinc-400 mx-auto font-medium leading-relaxed">
            The page you{"'"}re looking for might have been moved or doesn{"'"}t exist anymore. 
            Don{"'"}t worry, let{"'"}s get you back to safety.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <Button 
            asChild 
            size="lg" 
            className="bg-zinc-900 dark:bg-green-600 hover:bg-zinc-800 dark:hover:bg-green-500 text-white rounded-2xl px-12 h-14 font-bold shadow-2xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/">
              Return Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="rounded-2xl px-12 h-14 border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md font-bold transition-all hover:bg-white dark:hover:bg-zinc-900 group hover:scale-105 active:scale-95"
          >
            <MoveLeft className="mr-3 size-5 group-hover:-translate-x-2 transition-transform" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Sub-decorative Elements */}
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
        <div className="h-64 w-64 rounded-full border-[40px] border-green-400/20" />
      </div>

    </div>
  );
}