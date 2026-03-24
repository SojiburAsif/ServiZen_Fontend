"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Zap, Leaf, Lock, Headphones, 
  Star, DollarSign, CheckCircle, Wrench, 
  Droplets, Lightbulb, Hammer 
} from "lucide-react";

const featureData = [
  { id: 1, label: "Verified Pros", icon: ShieldCheck, size: "w-24 h-24 md:w-32 md:h-32" },
  { id: 2, label: "Fast Booking", icon: Zap, size: "w-20 h-20 md:w-28 md:h-28" },
  { id: 3, label: "Eco-Friendly", icon: Leaf, size: "w-32 h-32 md:w-40 md:h-40", primary: true },
  { id: 4, label: "Safe Payments", icon: Lock, size: "w-20 h-20 md:w-28 md:h-28" },
  { id: 5, label: "24/7 Support", icon: Headphones, size: "w-24 h-24 md:w-32 md:h-32" },
  { id: 6, label: "Expert Service", icon: Star, size: "w-24 h-24 md:w-32 md:h-32" },
  { id: 10, label: "Certified", icon: Hammer, size: "w-20 h-20 md:w-28 md:h-28" },
  { id: 8, label: "Trustworthy", icon: CheckCircle, size: "w-24 h-24 md:w-32 md:h-32" },
];

const bgIcons = [
  { Icon: Wrench, top: "15%", left: "10%", delay: 0, duration: 6 },
  { Icon: Droplets, top: "25%", left: "80%", delay: 1, duration: 8 },
  { Icon: Lightbulb, top: "65%", left: "15%", delay: 2, duration: 7 },
  { Icon: Hammer, top: "75%", left: "85%", delay: 0.5, duration: 9 },
];

export default function Features() {
  return (
    <section className="relative min-h-screen w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white overflow-hidden py-24 px-6 lg:px-12 flex flex-col justify-between selection:bg-emerald-500/30">
      
      {/* --- Ambient Background Icons --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bgIcons.map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute opacity-20 dark:opacity-30 text-emerald-500"
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              rotate: [0, 25, -25, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <item.Icon size={60} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* --- Header Section --- */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start"
        >
          <span className="px-5 py-2 rounded-full border border-emerald-500/30 text-[10px] font-black tracking-[0.3em] uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 backdrop-blur-xl">
            Service Excellence
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-none"
          >
            Why <span className="text-emerald-500">Choose</span> Us?
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 dark:text-gray-400 text-sm md:text-lg max-w-[400px] leading-snug font-light md:text-right"
          >
            Providing expert home solutions with <span className="text-zinc-900 dark:text-white font-medium">certified professionals</span> and eco-friendly care.
          </motion.p>
        </div>
      </div>

      {/* --- Interactive Floating Bubbles --- */}
      <div className="relative w-full flex-1 flex items-end justify-center pt-32 pb-10 z-10">
        <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 max-w-7xl">
          {featureData.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.05,
                y: {
                  duration: 4 + (index % 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1 + 0.5
                }
              }}
              whileHover={{ 
                scale: 1.15,
                y: -30,
                backgroundColor: "#10b981", 
                borderColor: "#34d399",
                boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)",
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              className={`
                ${feature.size} 
                flex flex-col items-center justify-center rounded-full 
                bg-white dark:bg-[#0f0f0f] border border-zinc-200 dark:border-white/10 shadow-xl
                cursor-pointer p-6 text-center transition-colors duration-300 group
                ${feature.primary ? "mb-20 border-emerald-500/50" : "mb-6"}
              `}
            >
              {/* Icon Animation on Hover */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                className="flex items-center justify-center"
              >
                <feature.icon 
                  className={`size-6 md:size-9 mb-2 transition-all duration-300 
                  ${feature.primary ? 'text-emerald-500' : 'text-emerald-600/70 dark:text-emerald-500/60'} 
                  group-hover:text-white group-hover:drop-shadow-lg`} 
                />
              </motion.div>

              <span className={`
                text-[8px] md:text-[11px] font-black uppercase tracking-widest leading-none
                ${feature.primary ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-gray-400"}
                group-hover:text-white transition-colors duration-300
              `}>
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Glow Effects --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 dark:bg-emerald-600/10 blur-[120px] pointer-events-none -z-10"></div>
    </section>
  );
}