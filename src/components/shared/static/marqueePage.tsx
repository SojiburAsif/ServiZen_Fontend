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
    <div className="w-full overflow-hidden py-12 bg-white dark:bg-black">
      <section 
        className="w-full py-8 bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] text-gray-900 font-sans selection:bg-green-300 overflow-hidden relative shadow-lg transform -rotate-3 scale-105 my-4 border-y-4 border-green-500/20"
      >
        
        {/* Subtle background shadows for the marquee */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none w-full h-full"></div>
        
        <Marquee 
          speed={60} 
          gradient={false} 
          pauseOnHover={true}
          className="overflow-hidden"
        >
          <div className="flex items-center">
            {marqueeItems.map((item, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-center gap-4 mx-8 md:mx-16 group cursor-pointer"
                whileHover={{
                  rotate: [0, -4, 4, -4, 4, 0],
                  scale: 1.05,
                  transition: { 
                    duration: 0.6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.div 
                  className="p-3 rounded-full bg-white border border-green-200 text-green-600 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md"
                >
                  <item.icon size={28} className="group-hover:animate-pulse" />
                </motion.div>
                <span className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-wide group-hover:text-gray-700 transition-colors duration-300">
                  {item.text}
                </span>
                
                {/* Added a subtle divider between items */}
                <span className="mx-4 md:mx-8 text-green-700/50">
                  ✦
                </span>
              </motion.div>
            ))}
          </div>
        </Marquee>
      </section>
    </div>
  );
}
