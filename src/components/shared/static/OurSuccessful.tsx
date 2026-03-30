"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Users, Star, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: "20+", title: "Years Experience", desc: "Decades of hands-on expertise delivering quality.", icon: Calendar },
  { value: "697", title: "Projects Done", desc: "Successfully completed projects across various sectors.", icon: CheckCircle },
  { value: "150+", title: "Team Members", desc: "Expert technicians ready for any residential or industrial job.", icon: Users },
  { value: "99%", title: "Positive Reviews", desc: "Unmatched customer satisfaction and round-the-clock service.", icon: Star },
];

export default function OurSuccessful() {
  return (
    <section className="relative w-full py-24 px-6 lg:px-12 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">

      {/* Background Decorators */}
      <div className="absolute top-20 left-[20%] w-96 h-96 bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-green-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase shadow-sm w-fit mb-6">
            <Trophy size={14} />
            /004 Success Records
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1] max-w-3xl mx-auto">
            We made thousands of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">successful projects.</span>
          </h2>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800 pt-8 mb-24 border-t border-zinc-200 dark:border-zinc-800">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="px-6 group cursor-pointer flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="mb-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md transform origin-left group-hover:-translate-y-1">
                <stat.icon size={26} strokeWidth={2} />
              </div>
              <h3 className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-white mb-3 group-hover:text-green-500 transition-colors duration-300 tracking-tighter">
                {stat.value}
              </h3>
              <h4 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mb-2">{stat.title}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full aspect-[4/3] md:aspect-[21/9] min-h-[400px] rounded-[2.5rem] overflow-hidden group shadow-2xl ring-1 ring-zinc-200 dark:ring-white/10"
        >
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=2070&auto=format&fit=crop"
            alt="Professional Service Team"
            className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-in-out"
          />

          {/* Dark Overlay Gradient (Better contrast for text) */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

          {/* Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center px-8 md:px-16 lg:px-24 pb-12 md:pb-0">
            <div className="max-w-xl flex flex-col items-start">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
                <Activity size={14} className="text-green-400" />
                Need an services?
              </div>

              <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                Get our service by making an <br />
                <span className="text-green-400">online Booking.</span>
              </h3>

              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-500 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-all duration-300 shadow-xl"
                >
                  Make an booking Services!!
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}