
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Globe
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Happy Clients", value: "10K+", icon: Users },
  { label: "Verified Pros", value: "500+", icon: ShieldCheck },
  { label: "Services Done", value: "25K+", icon: Zap },
  { label: "Avg Rating", value: "4.9/5", icon: Star },
];

const values = [
  {
    title: "Unmatched Quality",
    description: "Every service provider is strictly vetted to ensure you get the best home service experience.",
    icon: Award,
  },
  {
    title: "Eco-Friendly Focus",
    description: "We prioritize green solutions and sustainable practices in all our professional tasks.",
    icon: Globe,
  },
  {
    title: "Trust & Safety",
    description: "Your safety is our priority. All transactions and bookings are secure and insured.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white">
      
      {/* Background Large Text "S Z" - Crooked */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 select-none text-[300px] font-bold leading-none text-green-800/5 transition-all transform -rotate-12 dark:text-green-400/5 md:text-[500px]">
        S Z
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-bold tracking-wider text-green-700 dark:text-green-400 uppercase">
              About ServZEN
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simplifying <span className="italic text-green-600">Home Services</span> <br />
              for the Modern World.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              ServZEN is more than just a marketplace. We are a bridge between quality service professionals and homeowners who value excellence, speed, and trust.
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="mt-20">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[2rem] border border-white/40 bg-white/40 p-8 text-center backdrop-blur-md dark:border-green-900/20 dark:bg-black/40"
              >
                <stat.icon className="mx-auto h-6 w-6 text-green-600" />
                <p className="mt-4 text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mt-32 grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We aim to revolutionize the home service industry by providing a seamless, transparent, and tech-driven platform. From cleaning to complex repairs, we ensure every job is done with Zen-like precision.
            </p>
            <ul className="space-y-4">
              {["Vetted Professionals", "Instant Booking", "Transparent Pricing", "24/7 Support"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative h-[400px] overflow-hidden rounded-[3rem] border-4 border-white/50 shadow-2xl dark:border-green-900/30"
          >
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=1000" 
              alt="Our Team"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white">The Core Values of ServZEN</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                whileHover={{ y: -10 }}
                className="group rounded-[2.5rem] border border-white/50 bg-white/60 p-10 backdrop-blur-xl transition-all dark:border-green-900/20 dark:bg-black/40"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-500/30">
                  <value.icon size={28} />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32">
          <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 px-8 py-16 text-center shadow-2xl dark:bg-green-950/40">
            <h2 className="text-3xl font-black text-white sm:text-5xl">Ready to experience Zen?</h2>
            <p className="mt-6 text-green-100/70">Join thousands of people who trust ServZEN for their daily needs.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 font-bold text-white transition-all hover:bg-green-400 hover:scale-105 active:scale-95"
              >
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}