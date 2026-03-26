/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
import { getProviderReviews, type ReviewRecord } from "@/services/review.service";

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
        const response = await getProviderReviews({
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
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  if (loading) {
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
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
              </div>
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

            {/* Rating Distribution Skeleton */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
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
                  Reviews & Ratings
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Monitor your service quality and customer satisfaction
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics Dashboard</span>
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
                      Total Reviews
                    </p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                      {reviews.length}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Customer feedback
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-lg p-3">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                      {averageRating}
                    </p>
                    <div className="flex items-center mt-1">
                      {renderStars(parseFloat(averageRating))}
                    </div>
                  </div>
                  <div className="bg-blue-500 rounded-lg p-3">
                    <Star className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                      5-Star Reviews
                    </p>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                      {ratingDistribution.find(r => r.rating === 5)?.count || 0}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Excellent service
                    </p>
                  </div>
                  <div className="bg-purple-500 rounded-lg p-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">
                      {reviews.filter(r => {
                        const reviewDate = new Date(r.createdAt);
                        const now = new Date();
                        return reviewDate.getMonth() === now.getMonth() &&
                               reviewDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Recent activity
                    </p>
                  </div>
                  <div className="bg-orange-500 rounded-lg p-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-16">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {rating}
                      </span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {count}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search reviews by customer name, service, or comment..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-12 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12">
                      <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">⭐ 5 Stars</SelectItem>
                      <SelectItem value="4">⭐ 4 Stars</SelectItem>
                      <SelectItem value="3">⭐ 3 Stars</SelectItem>
                      <SelectItem value="2">⭐ 2 Stars</SelectItem>
                      <SelectItem value="1">⭐ 1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">✅ Completed</SelectItem>
                      <SelectItem value="pending">⏳ Pending</SelectItem>
                      <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    No reviews found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {query || ratingFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your filters to see more reviews, or clear all filters to view all reviews."
                      : "You haven't received any reviews yet. Reviews will appear here once customers complete their services."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Customer Reviews ({filteredReviews.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              <User className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {review.client.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {review.service.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {format(new Date(review.createdAt), "EEEE, MMMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                {review.rating}.0 Rating
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                            {review.comment}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={review.booking.status === "COMPLETED" ? "default" : "secondary"}
                              className={`px-3 py-1 text-sm font-medium ${
                                review.booking.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200"
                                  : review.booking.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200"
                              }`}
                            >
                              {review.booking.status === "COMPLETED" ? (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              ) : review.booking.status === "PENDING" ? (
                                <Clock className="h-4 w-4 mr-2" />
                              ) : (
                                <Clock className="h-4 w-4 mr-2" />
                              )}
                              {review.booking.status.charAt(0).toUpperCase() + review.booking.status.slice(1).toLowerCase()}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Reply to Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination Info */}
          {meta && filteredReviews.length > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredReviews.length}</span> of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{reviews.length}</span> reviews
                  {meta.totalPages > 1 && (
                    <> • Page <span className="font-semibold text-gray-900 dark:text-white">{meta.page}</span> of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">{meta.totalPages}</span></>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
