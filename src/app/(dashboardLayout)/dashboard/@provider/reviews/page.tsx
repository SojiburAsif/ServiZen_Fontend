/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Search,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  X,
  Sparkles,
  Quote
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyProviderReviews, type ReviewRecord } from "@/app/actions/review-actions";

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getMyProviderReviews({
          page: 1,
          limit: 20,
        });

        setReviews(response.data || []);
        setMeta(response.meta);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesQuery = query === "" ||
      review.comment.toLowerCase().includes(query.toLowerCase()) ||
      review.client.name.toLowerCase().includes(query.toLowerCase()) ||
      review.service.name.toLowerCase().includes(query.toLowerCase());

    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === "all" || review.booking.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesRating && matchesStatus;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating
            ? "fill-emerald-500 text-emerald-500"
            : "text-zinc-200 dark:text-zinc-800"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="h-44 animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
            <div className="lg:col-span-2">
              <div className="h-64 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        
        {/* Modernized Tactical Header */}
        <div className="relative overflow-hidden rounded-[3rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 sm:p-12">
          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-zinc-100 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Reputation System
                </span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                   Provider <span className="text-emerald-500">Reviews</span>
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  Monitor your service quality, aggregate ratings, and customer satisfaction logs through an encrypted terminal interface.
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="flex flex-col items-center gap-2 rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <BarChart3 className="h-8 w-8 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Analytics</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-zinc-500/5 blur-3xl" />
        </div>

        {/* Tactical Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Reviews", value: reviews.length, icon: MessageSquare },
            { label: "Average Rating", value: `${averageRating}/5.0`, icon: Star },
            { label: "Satisfaction", value: "98%", icon: Award },
            { label: "Growth", value: "+12.5%", icon: TrendingUp }
          ].map((stat, i) => (
            <div key={i} className="group rounded-[2rem] border border-zinc-100 bg-white p-6 transition-all hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white dark:bg-zinc-900 dark:text-zinc-400">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Rating Matrix */}
          <div className="rounded-[3rem] border border-zinc-100 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-10 text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Rating Distribution</h3>
            <div className="space-y-6">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-5">
                  <div className="flex w-14 items-center gap-1.5">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">{rating}</span>
                    <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  </div>
                  <div className="flex-1 overflow-hidden rounded-full bg-zinc-50 h-2 dark:bg-zinc-900">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-black text-zinc-400">{count}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 rounded-[2rem] bg-zinc-900 p-8 text-white dark:bg-black">
               <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                     <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Reputation Score</p>
                    <p className="text-xl font-black">Elite Provider</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Tactical Filters */}
          <div className="rounded-[3rem] border border-zinc-100 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-2">
             <div className="flex flex-col gap-8">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search feedback logs..."
                    className="h-16 rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 pl-14 text-lg shadow-sm transition-all focus-visible:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900/50"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                      <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Filter by Rating</label>
                      <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold">
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 dark:border-zinc-800">
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Filter by Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 dark:border-zinc-800">
                          <SelectItem value="all">Every Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Reviews Activity Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Recent Feedback</h2>
             <span className="text-xs font-bold text-zinc-400">{filteredReviews.length} results found</span>
          </div>
          
          <div className="grid gap-6">
            {filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-100 bg-zinc-50/30 py-24 dark:border-zinc-800/50 dark:bg-zinc-950/30">
                <Search className="h-12 w-12 text-zinc-300" />
                <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-white">No entries detected</h3>
                <p className="mt-2 text-zinc-500">Security query returned zero matches for current filters.</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="group relative flex flex-col gap-8 rounded-[2.5rem] border border-zinc-100 bg-white p-8 transition-all hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-zinc-500/5 dark:border-zinc-800 dark:bg-zinc-950 sm:p-10"
                >
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h4 className="text-xl font-black text-zinc-900 dark:text-white">{review.client.name}</h4>
                           <Badge className="rounded-lg bg-emerald-500/10 text-[10px] font-black text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">VERIFIED CLIENT</Badge>
                        </div>
                        <p className="text-sm font-bold text-zinc-400">{review.service.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(review.createdAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 h-8 w-8 text-zinc-50 dark:text-zinc-900" />
                    <p className="relative text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {review.comment}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-zinc-50 dark:border-zinc-900">
                    <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2 dark:bg-zinc-900">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Service Success</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2 dark:bg-zinc-900">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Express Delivery</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
