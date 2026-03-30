"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Quote, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

export default function MarketPolicy() {
  return (
    <section className="relative min-h-screen w-full bg-[#FAFAFA] dark:bg-black text-zinc-900 dark:text-white py-24 px-6 lg:px-12 overflow-hidden transition-colors duration-500">

      <div className="absolute top-20 right-[10%] w-64 h-64 bg-green-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-72 h-72 bg-green-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* --- Left Content Side --- */}
        <div className="space-y-6 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase shadow-sm"
          >
            <ShieldCheck size={14} />
            /006 Market Policy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.15]"
          >
            Kick-start your journey <br />
            <span className="text-green-500">researching market policy.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex gap-4 items-start max-w-lg"
          >
            <div className="relative mt-1">
              <div className="size-8 rounded-full border-2 border-green-500/30 flex items-center justify-center shrink-0 shadow-inner">
                 <div className="size-2.5 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed font-medium">
              Take the hassle out of service booking with our strict vetting policy 
              and expert integrations designed for your home and office needs.
            </p>
          </motion.div>

          {/* ফিচার লিস্ট */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
          >
            {[
              "Verified Professional",
              "Fixed Transparent Pricing",
              "24/7 Quality Assurance",
              "Eco-Friendly Materials"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="text-green-500 size-5 drop-shadow-sm" />
                {item}
              </div>
            ))}
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-7 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-base flex items-center gap-2 hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white transition-all duration-300"
            >
              Get Started
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* --- Right Image Side --- */}
        <div className="relative flex justify-center items-center mt-10 lg:mt-0">
          
     
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 right-8 text-green-500/40 z-20"
          >
            <Sparkles size={36} />
          </motion.div>

      
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-square max-w-[420px] md:max-w-[480px] overflow-hidden shadow-2xl ring-1 ring-zinc-200 dark:ring-white/10"
            style={{
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" // Blob Shape
            }}
          >
            <img 
              src="https://i.ibb.co.com/rGjGCTxC/pngtree-comprehensive-collection-of-construction-tools-for-home-repair-and-building-services-image-1.png" 
              alt="Professional Service"
              className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700 ease-in-out"
            />
            {/* ডেকোরেটিভ গ্র্যাডিয়েন্ট ওভারলে */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent mix-blend-overlay"></div>
          </motion.div>

          {/* মডার্ন ছোট টেস্টমোনিয়াল কার্ড */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="absolute -bottom-6 -left-2 md:-left-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/50 dark:border-white/10 max-w-[220px] z-30 group"
          >
            <div className="absolute -top-4 -left-4 size-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/40 group-hover:-translate-y-1 transition-transform">
              <Quote size={18} fill="currentColor" />
            </div>
            
            <p className="italic text-zinc-700 dark:text-zinc-300 mb-3 text-[13px] leading-snug">
              Bringing order and freshness to your space with Zen-like precision.
            </p>
            
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">Hanny West</h4>
                <p className="text-green-500 text-[10px] font-bold uppercase tracking-wider">Certified Expert</p>
              </div>
            </div>
          </motion.div>

          {/* ডেকোরেটিভ সার্কেলস (ইমেজের পেছনে) */}
          <div className="absolute -z-10 w-full max-w-[500px] aspect-square rounded-full border border-green-500/20 animate-[spin_15s_linear_infinite]" />
        </div>
      </div>
    </section>
  );
}