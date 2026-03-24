"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  ThumbsUp, 
  CheckCircle2, 
  ArrowRight,
  Medal
} from 'lucide-react';

export default function ProfessionalPestControl() {
  return (
    <section className="relative min-h-screen w-full bg-white dark:bg-black text-zinc-900 dark:text-white py-24 px-6 lg:px-12 overflow-hidden transition-colors duration-500">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-[20%] w-96 h-96 bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-[10%] w-80 h-80 bg-green-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Section: Header and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-32">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase shadow-sm w-fit">
              <Medal size={14} />
              /002 Professionalism
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mt-2">
              Excellency in pest <br /> 
              <span className="text-green-500">control services.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {[
              { icon: DollarSign, title: "Affordable Pricing", desc: "We are providing a variety of repair and maintenance services for all at sensible costs." },
              { icon: ShieldCheck, title: "Expert Workers", desc: "Our varied workers bring a level of precision and quality that sets industry standards." },
              { icon: Clock, title: "24/7 Available", desc: "Start experiencing reliable service with our round-the-clock professional assistance." },
              { icon: ThumbsUp, title: "Hassle Free", desc: "Whether in healthcare, technology, or home services, expert workers remove any hassle." },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 text-zinc-900 dark:text-white group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Image and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Image with Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-200 dark:ring-white/10 aspect-[4/3] md:aspect-auto">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
                alt="Professional Worker" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent mix-blend-overlay"></div>
            </div>

            {/* Floating Circular Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-zinc-900 dark:bg-white text-white dark:text-black w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center p-2 text-center shadow-xl border-[6px] border-white dark:border-black z-20"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase opacity-80"
              >
                BEST SOLUTION • EXPERT TEAM • 
              </motion.div>
              <span className="absolute text-3xl font-black text-green-500">100%</span>
            </motion.div>
          </motion.div>

          {/* Right Side: Description and List */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <h3 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              We provide you the <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">best quality of works.</span>
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed border-l-2 border-green-500 pl-6 my-8 font-medium">
              Experience professional service and prompt assistance from our dedicated team. Your satisfaction is our priority. We are providing a variety of reliable repair and pest control services.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {[
                "Certified technicians",
                "Customer satisfaction 100%",
                "Team collaboration",
                "Verified Results"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200 font-semibold">
                  <CheckCircle2 className="text-green-500 size-5" />
                  {item}
                </div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2 hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white transition-all duration-300"
            >
              Discover More
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}