/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, Star, Sparkles, Info } from "lucide-react";
import { Booking } from "@/types/booking.types";
import { toast } from "sonner";
import { createReview } from "@/app/actions/review-actions";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  booking: Booking;
  onSuccess?: () => void;
}

export function ReviewForm({ booking, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment") as string;

    if (rating === 0 || !comment.trim()) {
      setError("Please provide both a rating and a comment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createReview({
        bookingId: booking.id,
        rating,
        comment: comment.trim() || undefined,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to submit review");
      }

      // Success, refresh page data and close dialog
      router.refresh();
      toast.success("Review submitted successfully!", {
        description: "Thank you for your feedback.",
        duration: 4000,
      });
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit review. Please try again.";
      setError(errorMessage);
      toast.error("Review submission failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 dark:bg-zinc-950">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <Sparkles className="size-7 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">Write a Review</h3>
        <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Share your experience for <span className="text-zinc-900 dark:text-zinc-200">{booking.service?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STAR RATING */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            <Star className="size-4" />
            Select Rating
          </Label>
          
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="group relative focus:outline-none"
              >
                <Star
                  className={cn(
                    "size-10 transition-all duration-200 ease-out fill-transparent stroke-zinc-300 dark:stroke-zinc-700",
                    (hoveredRating || rating) >= star && "fill-emerald-500 stroke-emerald-500 scale-110",
                    !hoveredRating && rating >= star && "fill-emerald-500 stroke-emerald-500"
                  )}
                />
                {(hoveredRating || rating) >= star && (
                  <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-emerald-500/20 blur-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* COMMENT */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            <MessageSquare className="size-4" />
            Your Experience
          </Label>

          <Textarea
            id={`comment-${booking.id}`}
            name="comment"
            placeholder="Write your thoughts here..."
            className="min-h-[160px] resize-none rounded-[1.5rem] border-zinc-200 bg-zinc-50 p-5 text-sm transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-zinc-50 dark:focus:bg-zinc-900"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            <Info className="size-5 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 w-full rounded-[1.5rem] bg-zinc-900 text-base font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2 text-emerald-500 dark:text-emerald-600">
              <Loader2 className="size-5 animate-spin" />
              <span>Publishing Review...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="size-5" />
              <span>Submit Feedback</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
