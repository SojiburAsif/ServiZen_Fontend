/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star, MapPin, Heart, ShieldCheck } from "lucide-react";
import type { ServiceRecord } from "@/services/services.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PublicServicesGridProps = {
  initialServices: ServiceRecord[];
  initialMeta?: any;
  specialties?: { id: string; title: string }[];
};

export const PublicServicesGrid = ({
  initialServices,
  specialties = [],
}: PublicServicesGridProps) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const filteredServices = useMemo(() => {
    let list = [...initialServices];
    if (query) {
      list = list.filter((s) => s.name?.toLowerCase().includes(query.toLowerCase()));
    }
    if (selectedCategory !== "all") {
      list = list.filter((s) => s.specialty?.id === selectedCategory);
    }
    if (minPrice) {
      list = list.filter((s) => (s.price || 0) >= parseInt(minPrice));
    }
    if (maxPrice) {
      list = list.filter((s) => (s.price || 0) <= parseInt(maxPrice));
    }
    return list;
  }, [initialServices, query, selectedCategory, minPrice, maxPrice]);

  return (
    <div className="space-y-10">
      {/* Search & Filter - Modern Glassmorphism */}
      <div className="flex flex-col gap-4 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="What service are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] h-12 rounded-2xl bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 font-medium">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Categories</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">Price Range (৳):</span>
          <div className="flex gap-3 w-full sm:w-auto">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 h-10 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-xs"
            />
            <span className="text-zinc-400 flex items-center">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 h-10 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-xs"
            />
            {(minPrice || maxPrice) && (
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="px-3 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service: any) => (
          <div
            key={service.id}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0F0F0F] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(34,197,94,0.1)]"
          >
            {/* Image Section */}
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={service.imageUrl || "https://via.placeholder.com/400x300"}
                alt={service.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-black/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-600 shadow-xl backdrop-blur-md">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-black/80 text-zinc-400 hover:text-rose-500 transition-all active:scale-90">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {service.specialty?.title || "Pro Service"}
                </span>
                <div className="flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {service.provider?.averageRating?.toFixed(1) || "5.0"}
                </div>
              </div>

              <h3 className="mb-6 text-2xl font-black leading-tight tracking-tight group-hover:text-green-600 transition-colors line-clamp-1">
                {service.name}
              </h3>

              {/* Provider Mini Info */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                <Avatar className="h-8 w-8 border border-white dark:border-zinc-800">
                  <AvatarImage src={service.provider?.profilePhoto} />
                  <AvatarFallback>{service.provider?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{service.provider?.name}</span>
                  <span className="text-[10px] text-zinc-500">Professional Provider</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Starting Price</p>
                  <span className="text-2xl font-black text-black dark:text-white">
                    ৳{service.price}
                  </span>
                </div>
                <Link
                  href={`/services/${service.id}`}
                  className="rounded-2xl bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black transition-all hover:bg-green-600 dark:hover:bg-green-600 hover:text-white"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-32 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
            <Search className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold">No services found</h3>
          <p className="text-zinc-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};