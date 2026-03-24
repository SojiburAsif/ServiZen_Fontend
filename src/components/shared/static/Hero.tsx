"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <span className="inline-block min-w-[280px] md:min-w-[450px] font-serif italic text-gray-500 tracking-tight">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default function HeroSection() {
  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] text-gray-900 font-sans selection:bg-green-300">
      
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* Abstract background letters */}
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 leading-none select-none pointer-events-none transform -rotate-6">
        S Z
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center min-h-[calc(100vh-88px)]">
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-20">
          {/* Left Huge Typography */}
          <div className="lg:col-span-8">
            <h1 className="text-[3rem] leading-[1.1] md:text-[5rem] lg:text-[6.5rem] font-medium tracking-tight text-gray-900">
              Your all-in-one <br />
              solution for modern <br />
              <TypewriterText words={["PestControl", "Plumbing", "Cleaning", "Electrical"]} />
              <br />
              Services.
            </h1>
          </div>

          {/* Right Subtext & CTA */}
          <div className="lg:col-span-4 flex flex-col gap-8 pb-4">
            <p className="text-lg md:text-xl text-gray-700/80 leading-relaxed max-w-sm">
              The perfect modern platform for all your professional home service needs.
            </p>
            
            <div className="flex items-center gap-4">
              <button className="px-8 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 shadow-xl shadow-green-900/10">
                Get Started
              </button>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-900/10 bg-white/50 backdrop-blur text-gray-900 font-semibold group-hover:bg-gray-900 group-hover:text-white transition-all">
                   →
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">Explore</span>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Badge */}
        <div className="absolute bottom-10 left-6 lg:left-12 flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 rounded bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
            SZ
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-800 leading-tight">
            Trusted by <br /> 5000+ Users <br /> Worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}