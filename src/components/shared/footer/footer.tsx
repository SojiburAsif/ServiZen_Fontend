"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  Home,
  Search,
  Info,
  Phone,
  Shield,
  FileText,
  HelpCircle
} from "lucide-react";
import { FaInstagram as Instagram, FaLinkedin as Linkedin, FaTwitter as Twitter } from "react-icons/fa";

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white transition-colors duration-500 pt-20 pb-10 px-6 lg:px-12 border-t border-zinc-200 dark:border-white/5">

      {/* --- Call to Action Section --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-20 border-b border-zinc-200 dark:border-white/5">
        <div className="relative">
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-none">
            Ready to make <br />
            <span className="relative inline-block">
              something awesome!

              {/* মডার্ন ডাবল স্ট্রোক আন্ডারলাইন (ছোট করা হয়েছে) */}
              <svg 
                className="absolute -bottom-3 md:-bottom-4 left-0 w-full h-4 md:h-6 text-green-500 drop-shadow-[0_5px_15px_rgba(34,197,94,0.4)] z-[-1]" 
                viewBox="0 0 300 35" 
                fill="none" 
                preserveAspectRatio="none"
              >
          
                <motion.path 
                  d="M5 25 Q 150 -5 295 18 Q 180 35 30 28" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
         
                <motion.path 
                  d="M20 32 Q 150 10 285 26" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                />
              </svg>
            </span>
          </h2>
        </div>

      
        <motion.button
          whileHover={{ 
            scale: 1.05, 
            textShadow: "0px 0px 20px rgba(34, 197, 94, 0.5)" 
          }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 text-2xl md:text-5xl font-semibold text-zinc-800 dark:text-zinc-200 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300"
        >
          <motion.div
            animate={{ 
              x: [0, 8, 0], 
              y: [0, -8, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <ArrowUpRight className="size-8 md:size-12 group-hover:rotate-45 transition-transform duration-300" />
          </motion.div>
          Book a Service
        </motion.button>
      </div>

      {/* --- Main Footer Links --- */}
      <div className="max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Logo & Info */}
        <div className="col-span-1">
          <Link href="/" className="group flex items-center gap-2 transition-transform active:scale-95">
            <img src="/favicon.ico" alt="" className="h-10 w-10 rounded-full animate-spin-slow" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Serv<span className="font-serif italic text-gray-500 dark:text-gray-400">ZEN</span>
            </span>
          </Link>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-[200px] mt-4">
            The perfect modern platform for showcasing and booking your home services.
          </p>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="font-bold mb-6 text-green-600 dark:text-green-500 uppercase tracking-widest text-xs">Navigation</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {[{icon: Home, label: "Home", href: "/"}, {icon: Search, label: "Browse Services", href: "/services"}, {icon: Info, label: "About Us", href: "/about"}, {icon: Phone, label: "Contact", href: "/contact"}].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="flex items-center gap-2 hover:text-green-500 transition-colors w-fit group">
                  <link.icon size={16} className="group-hover:scale-110 transition-transform" /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-bold mb-6 text-green-600 dark:text-green-500 uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {[{icon: Shield, label: "Privacy Policy", href: "/privacy-policy"}, {icon: FileText, label: "Terms of Service", href: "/terms-of-service"}, {icon: HelpCircle, label: "FAQ", href: "/faq"}].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="flex items-center gap-2 hover:text-green-500 transition-colors w-fit group">
                  <link.icon size={16} className="group-hover:scale-110 transition-transform" /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials & Copyright */}
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="flex gap-4">
            {[Instagram, Linkedin, Twitter].map((Icon, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ y: -5, backgroundColor: "#22c55e", color: "#fff" }}
                className="size-10 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 transition-colors"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>

          <div className="mt-12 text-zinc-500 dark:text-zinc-500 text-[10px] uppercase tracking-widest text-left md:text-right">
            Copyright © ServZEN-powered by <br />
            <span className="text-zinc-900 dark:text-white font-bold">Sojibur Rahman Asif</span>
          </div>
        </div>
      </div>

    
      {/* Scroll to  Home Top Button */}
      {showTopBtn && (
        <motion.button
          onClick={scrollToTop}
     
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "#22c55e",
            color: "#fff",
            boxShadow: "0 0 50px rgba(34, 197, 94, 0.7)",
          }}
         
          whileTap={{ scale: 0.9 }}
      
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            y: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
          className="fixed bottom-10 right-10 size-14 bg-white dark:bg-[#111] text-green-500 dark:text-green-400 rounded-full flex items-center justify-center border border-zinc-200 dark:border-white/10 shadow-lg z-50 transition-colors"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}

      {/* Background Subtle Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-green-500/5 blur-[120px] pointer-events-none -z-10"></div>
    </footer>
  );
}