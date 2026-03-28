/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShieldCheck, ArrowRight, Medal, Loader2 } from "lucide-react";
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
      {/* Background Decorators - Inspired by your example */}
      <div className="absolute top-0 left-[10%] w-72 h-72 bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-96 h-96 bg-green-500/10 blur-[150px] pointer-events-none" />
      
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              <Medal size={12} />
              Top Rated Solutions
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Featured <span className="text-green-500">Services.</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Explore our hand-picked professional services, verified for quality and excellence in every task.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/services"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-lg shadow-black/5"
            >
              View All Services
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading Skeleton Cards
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
              <p className="text-zinc-400 text-lg">No services available at the moment.</p>
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative bg-white dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)] transition-all duration-500"
    >
      {/* Image Wrap */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={service.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Verified Badge */}
        <div className="absolute top-5 left-5">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-600 border border-white/20 shadow-xl">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-5 right-5">
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/10">
            <Star className="h-3 w-3 fill-green-500 text-green-500" />
            {service.provider?.averageRating?.toFixed(1) || "5.0"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
            {service.specialty?.title || "Professional"}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight group-hover:text-green-500 transition-colors">
          {service.name}
        </h3>

        {/* Provider Info - Cleaned up */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/30">
          <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-zinc-800">
            <AvatarImage src={service.provider?.profilePhoto} />
            <AvatarFallback className="bg-green-500 text-white">{service.provider?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{service.provider?.name}</span>
            <span className="text-[10px] text-zinc-500 font-medium">Expert Provider</span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-zinc-900 dark:text-white">৳{service.price}</span>
            </div>
          </div>

          <Link
            href={`/services/${service.id}`}
            className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white transition-all duration-300"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}