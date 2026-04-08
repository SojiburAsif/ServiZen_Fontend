/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Users,
  CreditCard,
  Wallet,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProviderSelfProfile } from "@/services/provider.service";
import { getStats, type ProviderStats as APIProviderStats } from "@/services/stats.service";

interface ProviderStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  averageRating: number;
  walletBalance: number;
  recentBookings: any[];
  growthPercentage: number;
}

export default function ProviderEarningsPage() {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderStats = async () => {
      try {
        setLoading(true);

        // Fetch provider profile and stats in parallel
        const [profile, statsData] = await Promise.all([
          getProviderSelfProfile(),
          getStats()
        ]);

        if (!profile) {
          throw new Error("Failed to fetch provider profile");
        }

        if (!statsData || statsData.role !== "PROVIDER") {
          throw new Error("Failed to fetch provider stats");
        }

        // Transform API data to component format
        const providerStats = statsData as APIProviderStats;
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const currentMonthIncome = providerStats.monthlyIncome?.find(income => income.month === currentMonth);

        // Calculate previous month for growth comparison
        const currentDate = new Date();
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const previousMonthKey = previousMonth.toISOString().slice(0, 7);
        const previousMonthIncome = providerStats.monthlyIncome?.find(income => income.month === previousMonthKey);

        // Calculate growth percentage
        let growthPercentage = 0;
        if (previousMonthIncome && previousMonthIncome.amount > 0) {
          growthPercentage = ((currentMonthIncome?.amount || 0) - previousMonthIncome.amount) / previousMonthIncome.amount * 100;
        }

        const mockStats: ProviderStats = {
          totalEarnings: providerStats.overview.totalEarned || 0,
          monthlyEarnings: currentMonthIncome?.amount || 0,
          totalBookings: providerStats.overview.totalBookings || 0,
          completedBookings: providerStats.overview.completedBookings || 0,
          pendingBookings: providerStats.overview.pendingBookings || 0,
          averageRating: providerStats.overview.averageRating || 0,
          walletBalance: providerStats.overview.walletBalance || 0,
          recentBookings: providerStats.recentBookings?.slice(0, 5).map(booking => ({
            id: booking.id,
            clientName: booking.client.name,
            serviceName: booking.service.name,
            amount: booking.totalAmount,
            status: booking.status,
            date: new Date(booking.createdAt),
          })) || [],
          growthPercentage,
        };

        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching provider stats:", error);
        // Set fallback data if API fails
        setStats({
          totalEarnings: 0,
          monthlyEarnings: 0,
          totalBookings: 0,
          completedBookings: 0,
          pendingBookings: 0,
          averageRating: 0,
          walletBalance: 0,
          recentBookings: [],
          growthPercentage: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviderStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 mt-4">
        {/* Header Skeleton */}
        <div className="bg-black dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 animate-pulse">
          <div className="h-10 bg-zinc-800 rounded-full w-64 mb-4"></div>
          <div className="h-4 bg-zinc-800 rounded-full w-96"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-black rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-2xl"></div>
                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-12"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-20"></div>
                <div className="h-8 bg-zinc-100 dark:bg-zinc-900 rounded-full w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Unable to load earnings data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 mt-4 pb-12">
      {/* Tactical Header */}
      <div className="group relative overflow-hidden bg-black dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Financial Performance
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Earnings &amp; <span className="text-emerald-500">Payouts</span>
            </h1>
            <p className="max-w-xl text-zinc-400 font-medium text-lg leading-relaxed">
              Track your income, monitor growth, and manage your financial dashboard with precision.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-emerald-500 hover:text-white rounded-full px-8 h-12 font-bold transition-all duration-300">
              Download Report
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black rounded-full px-8 h-12 font-black shadow-lg shadow-emerald-500/20 transition-all duration-300">
              Withdraw Funds
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Earnings", value: `৳${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, trend: "All time income", accent: "emerald" },
          { label: "This Month", value: `৳${stats.monthlyEarnings.toLocaleString()}`, icon: TrendingUp, trend: `${stats.growthPercentage >= 0 ? "+" : ""}${stats.growthPercentage.toFixed(1)}% vs last month`, accent: "blue" },
          { label: "Wallet Balance", value: `৳${stats.walletBalance.toLocaleString()}`, icon: Wallet, trend: "Available for withdrawal", accent: "purple" },
          { label: "Average Rating", value: stats.averageRating.toFixed(1), icon: Star, trend: "Based on all reviews", accent: "orange" },
        ].map((item, i) => (
          <Card key={i} className="group overflow-hidden bg-white dark:bg-black rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30 transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-${item.accent === "emerald" ? "emerald" : "zinc"}-100 dark:bg-${item.accent === "emerald" ? "emerald" : "zinc"}-900/50 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className={`h-6 w-6 text-${item.accent === "emerald" ? "emerald-500" : "zinc-400"}`} />
                </div>
                <Badge variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800 font-bold text-[10px] tracking-widest uppercase py-1">
                  Active
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {item.value}
                  </h3>
                </div>
                <p className="text-xs font-medium text-zinc-400 mt-2 flex items-center gap-1">
                  {item.label === "This Month" && (
                    stats.growthPercentage >= 0 ? 
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : 
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  {item.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Detailed Metrics */}
        <Card className="lg:col-span-1 bg-white dark:bg-black rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Booking Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {[
              { label: "Completed", count: stats.completedBookings, color: "emerald", icon: CheckCircle },
              { label: "Pending", count: stats.pendingBookings, color: "zinc", icon: Clock },
              { label: "Total Volume", count: stats.totalBookings, color: "zinc", icon: Users },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-${metric.color}-500/10`}>
                    <metric.icon className={`h-5 w-5 text-${metric.color === "emerald" ? "emerald-500" : "zinc-400"}`} />
                  </div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">{metric.label}</span>
                </div>
                <span className="text-xl font-black text-zinc-900 dark:text-white">{metric.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2 bg-white dark:bg-black rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <CardHeader className="p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Recent Earnings
            </CardTitle>
            <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-black rounded-full text-xs font-bold uppercase tracking-widest px-4">
              View All
            </Button>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <th className="px-6 py-2">Transaction</th>
                    <th className="px-6 py-2">Amount</th>
                    <th className="px-6 py-2">Status</th>
                    <th className="px-6 py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.length > 0 ? (
                    stats.recentBookings.map((booking) => (
                      <tr key={booking.id} className="group bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-200">
                        <td className="px-6 py-4 first:rounded-l-3xl">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-white">{booking.serviceName}</span>
                            <span className="text-xs font-medium text-zinc-500">{booking.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-zinc-900 dark:text-white">৳{booking.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 last:rounded-r-3xl text-right">
                          <span className="text-xs font-bold text-zinc-500">{format(booking.date, "MMM dd, yyyy")}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900">
                            <CreditCard className="h-6 w-6 text-zinc-400" />
                          </div>
                          <p className="text-sm font-bold text-zinc-500">No recent transactions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
