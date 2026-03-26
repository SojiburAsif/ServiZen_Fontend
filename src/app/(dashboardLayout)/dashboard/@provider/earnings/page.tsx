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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600 dark:text-gray-400">Unable to load earnings data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-white"
         style={{
           background: 'linear-gradient(135deg, #FAFAFA 0%, #E2F7D8 50%, #80F279 100%)'
         }}
         data-theme="light">

      {/* Dark mode background */}
      <div className="absolute inset-0 dark:block hidden"
           style={{
             background: 'linear-gradient(135deg, #050505 0%, #0a1f0a 50%, #052e05 100%)'
           }}>
      </div>

      {/* Abstract background letters */}
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none select-none pointer-events-none transform -rotate-6 z-0">
        S Z
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Earnings & Payouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Track your income, bookings, and financial performance
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-5 w-5" />
                <span>Financial Dashboard</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                      ৳{stats.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      All time income
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-lg p-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                      ৳{stats.monthlyEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      {stats.growthPercentage >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${stats.growthPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.growthPercentage >= 0 ? '+' : ''}{stats.growthPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-500 rounded-lg p-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                      Wallet Balance
                    </p>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                      ৳{stats.walletBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Available for withdrawal
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-lg p-3">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">
                      {stats.averageRating.toFixed(1)}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs text-orange-600 dark:text-orange-400">Excellent</span>
                    </div>
                  </div>
                  <div className="bg-orange-500 rounded-lg p-3">
                    <Star className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Booking Stats */}
            <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                  Booking Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-green-700 dark:text-green-300">
                    {stats.completedBookings}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                    {stats.pendingBookings}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Bookings</span>
                  </div>
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {stats.totalBookings}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Earnings */}
            <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                  Recent Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.clientName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {booking.serviceName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {format(booking.date, "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          ৳{booking.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={booking.status === "COMPLETED" ? "default" : "secondary"}
                          className={`text-xs mt-1 ${
                            booking.status === "COMPLETED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-2">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button variant="outline" className="border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
