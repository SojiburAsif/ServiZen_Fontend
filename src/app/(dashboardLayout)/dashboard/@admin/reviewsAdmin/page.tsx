/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllReviews,
  deleteReview,
  ReviewRecord,
  ReviewListQuery,
} from "@/services/review.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Star,
  Eye,
  Trash2,
  Search,
  Filter,
  User,
  Wrench,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const ratingColors: Record<number, string> = {
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
  const [ratingFilter, setRatingFilter] = useState<string>("");

  const fetchReviews = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const filters: ReviewListQuery = {
        page,
        limit: 10,
        ...(ratingFilter && { rating: parseInt(ratingFilter) }),
      };

      const response = await getAllReviews(filters);

      if (response.success) {
        setReviews(response.data);
        setMeta({
          page: response.meta?.page || 1,
          totalPages: Math.max(1, Math.ceil((response.meta?.total || 0) / (response.meta?.limit || 10))),
          total: response.meta?.total || 0,
        });
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

  const filteredReviews = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return reviews;

    return reviews.filter((review) =>
      review.comment.toLowerCase().includes(q) ||
      review.id.toLowerCase().includes(q) ||
      review.client.name.toLowerCase().includes(q) ||
      review.provider.name.toLowerCase().includes(q) ||
      review.service.name.toLowerCase().includes(q) ||
      review.bookingId.toLowerCase().includes(q)
    );
  }, [reviews, searchTerm]);

  const handleViewReview = (review: ReviewRecord) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleDeleteReview = (review: ReviewRecord) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;

    try {
      setIsProcessing(true);
      const response = await deleteReview(selectedReview.id);

      if (response.success) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter(r => r.id !== selectedReview.id));
        setMeta(prev => ({ ...prev, total: prev.total - 1 }));
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
    setRatingFilter("");
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

      <Card className="border-muted/30 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl">All Reviews</CardTitle>

            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>

              {(ratingFilter || searchTerm) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review ID</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        "No reviews found"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-mono text-xs">
                        {review.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {renderStars(review.rating)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{review.client.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{review.provider.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.service.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(review.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-primary"
                            onClick={() => handleViewReview(review)}
                            aria-label="View review details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-destructive"
                            onClick={() => handleDeleteReview(review)}
                            aria-label="Delete review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing page <span className="font-medium text-foreground">{meta.page}</span> of{" "}
              <span className="font-medium text-foreground">{meta.totalPages}</span> (
              <span className="font-medium text-foreground">{meta.total}</span> total reviews)
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1 || loading}
                onClick={() => fetchReviews(meta.page - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => fetchReviews(meta.page + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Review Details</DialogTitle>
            <DialogDescription>
              Complete review information and related details.
            </DialogDescription>
          </DialogHeader>

          {selectedReview ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Review Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DetailItem label="Review ID" value={selectedReview.id} />
                    <DetailItem label="Rating" value={renderStars(selectedReview.rating)} />
                    <DetailItem
                      label="Created At"
                      value={new Date(selectedReview.createdAt).toLocaleString()}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Comment</p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">{selectedReview.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      Client Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{selectedReview.client.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          ID: {selectedReview.clientId.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wrench className="h-5 w-5 text-green-600" />
                      Provider Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{selectedReview.provider.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          ID: {selectedReview.providerId.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{selectedReview.service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {selectedReview.serviceId.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <DetailItem label="Booking ID" value={selectedReview.bookingId} />
                    <DetailItem label="Booking Status" value={
                      <Badge variant="outline">
                        {selectedReview.booking.status}
                      </Badge>
                    } />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Loading details...
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone and will also update the provider s average rating.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Review"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}
