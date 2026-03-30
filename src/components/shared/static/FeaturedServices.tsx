/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Medal, CalendarCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllServices } from "@/services/services.service";

export default function FeaturedServices() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await getAllServices({ page: 1, limit: 6 });
        setServices(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching featured services:", error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-black py-24 sm:py-32 transition-colors duration-500">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-[10%] w-72 h-72 bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-96 h-96 bg-emerald-500/10 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              <Medal size={12} />
              Top Rated Solutions
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Featured <span className="text-emerald-500">Services.</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Hand-picked professional services, verified for quality and excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/services"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all duration-300"
            >
              Explore All
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Reverted to your preferred detailed Skeleton Design
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                <Skeleton className="h-48 w-full bg-gray-200 dark:bg-zinc-800" />
                <div className="p-8 space-y-4">
                  <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-zinc-800" />
                  <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800" />
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-zinc-700" />
                      <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-zinc-700" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                    <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-zinc-800" />
                    <Skeleton className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))
          ) : services.length > 0 ? (
            services.map((service, idx) => (
              <ServiceCard key={service.id || idx} service={service} index={idx} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
              <p className="text-zinc-400 text-lg">No services available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ 
        delay: (index % 3) * 0.1, 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -12,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="group relative bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.12)] transition-all duration-500"
    >
      {/* Image Area */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={service.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-emerald-600 border border-white/20">
            <ShieldCheck className="h-3 w-3" /> Verified
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
            {service.specialty?.title || "Home Service"}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold dark:text-white">
            <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
            {service.provider?.averageRating?.toFixed(1) || "5.0"}
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 group-hover:text-emerald-500 transition-colors line-clamp-1">
          {service.name}
        </h3>

        {/* Provider Small UI */}
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="h-8 w-8 ring-2 ring-emerald-500/10">
            <AvatarImage src={service.provider?.profilePhoto} />
            <AvatarFallback className="bg-emerald-500 text-[10px] text-white font-bold">{service.provider?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">By {service.provider?.name}</span>
        </div>

        {/* Bottom Section: Price & Book Button */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
          <div>
            <p className="text-[9px] font-bold uppercase text-zinc-400 mb-0.5">Price</p>
            <span className="text-xl font-black text-zinc-900 dark:text-white">৳{service.price}</span>
          </div>

          <Link
            href={`/services/${service.id}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-md group/btn"
          >
            <span className="text-xs font-black uppercase tracking-tighter">Book Now</span>
            <CalendarCheck size={14} className="group-hover/btn:rotate-12 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}