"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  // Branding icons bad diye standard icons use korchi jate build error na hoy
  ExternalLink,
  Globe,
  User,
  Info
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] px-6 py-20 font-sans selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white lg:px-8">
      
      {/* Background Large Text "S Z" - Crooked */}
      <div className="pointer-events-none absolute -bottom-20 -right-10 select-none text-[250px] font-bold leading-none text-green-800/5 transition-all transform rotate-12 dark:text-green-400/5 md:text-[450px]">
        S Z
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Let&apos;s Get <span className="italic text-green-600">Connected</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Have questions about our services? Our team is here to help you find your Zen.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Contact Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/40 bg-white/40 p-6 backdrop-blur-md dark:border-green-900/20 dark:bg-black/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg">
                  <Mail size={24} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic break-all">support@servzen.com</p>
              </div>

              <div className="rounded-[2rem] border border-white/40 bg-white/40 p-6 backdrop-blur-md dark:border-green-900/20 dark:bg-black/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg">
                  <Phone size={24} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Call Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+880 1700-000000</p>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/40 bg-white/40 p-8 backdrop-blur-md dark:border-green-900/20 dark:bg-black/40">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Office Location</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dinajpur, Bangladesh</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Working Hours</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sat - Thu: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links - Fixed Generic Icons */}
              <div className="mt-10 flex gap-4">
                {[
                  { icon: User, href: "#", label: "Profile" },
                  { icon: Globe, href: "#", label: "Website" },
                  { icon: ExternalLink, href: "#", label: "Social" }
                ].map((social, i) => (
                  <Link 
                    key={i} 
                    href={social.href} 
                    title={social.label}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-200 bg-white text-green-700 transition-all hover:bg-green-600 hover:text-white dark:border-green-900/40 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-green-500"
                  >
                    <social.icon size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[3rem] border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl dark:border-green-900/30 dark:bg-black/60 md:p-10"
          >
            <div className="mb-8 flex items-center gap-3">
              <MessageSquare className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-5 py-3 text-sm outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-5 py-3 text-sm outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-2xl border border-gray-200 bg-white/50 px-5 py-3 text-sm outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                ></textarea>
              </div>

              <button
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-green-600 font-bold text-white shadow-xl shadow-green-600/20 transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-50 dark:bg-green-500"
              >
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : (
                  <>
                    Send Message
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}