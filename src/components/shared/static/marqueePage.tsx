/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, ThumbsUp, Sparkles, Zap, Wrench } from 'lucide-react';

const marqueeItems = [
  { text: "100% Satisfaction Guaranteed", icon: ThumbsUp },
  { text: "24/7 Emergency Support", icon: Clock },
  { text: "Eco-Friendly Products", icon: Sparkles },
  { text: "Certified Expert Team", icon: ShieldCheck },
  { text: "Fast & Reliable Service", icon: Zap },
  { text: "Advanced Equipment", icon: Wrench },
];

export default function MarqueePage() {
  return (
    <div className="w-full overflow-hidden py-8 md:py-12 bg-white dark:bg-black transition-colors duration-500">
      
      {/* Container - Balanced Tilt & Size */}
      <section 
        className="relative w-full py-4 md:py-6 overflow-hidden transform -rotate-1 scale-[1.02] border-y border-emerald-500/10 dark:border-emerald-500/20 shadow-sm"
      >
        {/* Background Layer with Subtler Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/50 dark:from-zinc-950 dark:via-emerald-950/10 dark:to-zinc-950" />
        
        <Marquee 
          speed={50} 
          gradient={false} 
          pauseOnHover={true}
          className="relative z-10"
        >
          <div className="flex items-center">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-center gap-3 md:gap-5 mx-6 md:mx-10 group cursor-default"
              >
                {/* Responsive Icon Box - Optimized Size */}
                <div 
                  className="flex items-center justify-center p-2 md:p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:-rotate-6"
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>

                {/* Responsive Typography - Clean & Compact */}
                <span className="text-sm md:text-lg lg:text-xl font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 whitespace-nowrap">
                  {item.text}
                </span>
                
                {/* Geometric Divider - Responsive Scale */}
                <div className="ml-6 md:ml-10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rotate-45 bg-emerald-500/40 group-hover:bg-emerald-500 transition-all duration-500" />
                  <div className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-emerald-500/30 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </Marquee>
      </section>
    </div>
  );
}