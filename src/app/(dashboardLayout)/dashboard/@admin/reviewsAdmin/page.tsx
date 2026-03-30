"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getAllReviews, deleteReview } from "@/app/actions/review-actions";
import type { ReviewRecord, ReviewListQuery } from "@/app/actions/review-actions";

const ratingColors = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-yellow-500",
  4: "text-lime-500",
  5: "text-green-500",
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}/5</span>
    </div>
  );
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const fetchReviews = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const filters: ReviewListQuery = {
        page,
        limit: 10,
        ...(ratingFilter !== "all" && { rating: parseInt(ratingFilter) }),
      };

      const response = await getAllReviews(filters);

      if (response.success && Array.isArray(response.data)) {
        setReviews(response.data);
        setMeta({
          page: response.meta?.page || 1,
          totalPages: Math.max(1, Math.ceil((response.meta?.total || 0) / (response.meta?.limit || 10))),
          total: response.meta?.total || 0,
        });
      } else {
        setReviews([]);
        toast.error(response.message || "Failed to fetch reviews");
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const handleViewReview = (review: ReviewRecord) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setIsProcessing(true);
      const response = await deleteReview(selectedReview.id);

      if (response.success) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter(r => r.id !== selectedReview.id));
        setMeta(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        toast.error(response.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
      setSelectedReview(null);
    }
  };

  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedReview(null);
  };

  const clearFilters = () => {
    setRatingFilter("all");
    setSearchTerm("");
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div>
            <p className="text-base font-semibold">Loading reviews...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the latest data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reviews Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all reviews across the platform
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="text-xs text-muted-foreground">
              All reviews in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(r => r.rating === 5).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Perfect ratings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Ratings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(r => r.rating <= 2).length}
            </div>
            <p className="text-xs text-muted-foreground">
              1-2 star reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Reviews</Label>
              <Input
                id="search"
                placeholder="Search by client name, service name, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="rating">Rating Filter</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredReviews.length}</span> of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{reviews.length}</span> reviews
            {meta.totalPages > 1 && (
              <> • Page <span className="font-semibold text-gray-900 dark:text-white">{meta.page}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{meta.totalPages}</span></>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-center">
              <div>
                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || ratingFilter !== "all" ? "No reviews match your filters" : "No reviews found"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {review.client.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <Badge variant="outline">{review.service.name}</Badge>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReview(review)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => fetchReviews(meta.page - 1)}
                    disabled={meta.page <= 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => fetchReviews(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {selectedReview.client.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedReview.client.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <Badge variant="outline">{selectedReview.service.name}</Badge>
                </div>
                {selectedReview.comment && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">{selectedReview.comment}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeViewDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
              <br />
              <br />
              <strong>Review by:</strong> {selectedReview?.client.name}
              <br />
              <strong>Rating:</strong> {selectedReview?.rating} stars
              <br />
              <strong>Service:</strong> {selectedReview?.service.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
