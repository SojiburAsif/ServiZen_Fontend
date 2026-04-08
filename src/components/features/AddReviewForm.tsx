/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquarePlus, Info, Sparkles, CheckCircle2, Loader2, Star } from "lucide-react";
import { Booking } from "@/types/booking.types";
import { toast } from "sonner";
import { createReview } from "@/app/actions/review-actions";
import { cn } from "@/lib/utils";

interface AddReviewFormProps {
  unreviewedBookings: Booking[];
}

export function AddReviewForm({ unreviewedBookings }: AddReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const bookingSelection = formData.get("bookingSelection") as string;
    const comment = formData.get("comment") as string;

    if (!bookingSelection || rating === 0 || !comment.trim()) {
      setError("Please select a booking, provide a rating, and write a comment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createReview({
        bookingId: bookingSelection.split("|")[0],
        rating,
        comment: comment.trim() || undefined,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to submit review");
      }

      setSuccess(true);
      toast.success("Review submitted successfully!", {
        description: "Thank you for your valuable feedback.",
        duration: 4000,
      });
      // Reset form
      (e.target as HTMLFormElement).reset();
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

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-[2.5rem] border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
          <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Review Submitted Successfully!
          </h2>
          <p className="mx-auto max-w-sm text-zinc-500 dark:text-zinc-400">
            Thank you for your feedback. Your review helps maintain the quality of our service community.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/my-reviews")}
          className="h-12 rounded-2xl bg-zinc-900 px-8 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          View My Reviews
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* BOOKING SELECT */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Sparkles className="size-3.5" />
          Select Service
        </Label>

        <div className="relative group">
          <select
            name="bookingSelection"
            required
            defaultValue=""
            className="h-14 w-full appearance-none rounded-[1.25rem] border border-zinc-200 bg-zinc-50/50 px-5 text-sm font-bold text-zinc-900 transition-all group-hover:bg-zinc-100/50 focus:border-zinc-900 focus:bg-white focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:group-hover:bg-zinc-800/80 dark:focus:border-zinc-50 dark:focus:bg-zinc-900"
          >
            <option value="" disabled className="text-zinc-400">
              Select a completed session...
            </option>

            {unreviewedBookings.map((b: any) => (
              <option 
                key={b.id} 
                value={`${b.id}|${b.serviceId}`}
                className="py-2 font-medium bg-white dark:bg-zinc-900"
              >
                {b.service?.name} — {new Date(b.bookingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-zinc-400">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* STAR RATING */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Star className="size-3.5" />
          Session Quality
        </Label>
        
        <div className="flex items-center justify-between rounded-[1.5rem] border border-zinc-100 bg-zinc-50/30 p-5 dark:border-zinc-800/50 dark:bg-zinc-900/20">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="group relative h-10 w-10 focus:outline-none"
              >
                <Star
                  className={cn(
                    "size-8 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] fill-transparent stroke-zinc-300 dark:stroke-zinc-700",
                    (hoveredRating || rating) >= star && "fill-emerald-500 stroke-emerald-500 scale-125",
                    rating >= star && "fill-emerald-500 stroke-emerald-500"
                  )}
                />
                {(hoveredRating || rating) >= star && (
                  <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-emerald-500/10 blur-xl" />
                )}
              </button>
            ))}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100">
            {hoveredRating || rating || 0}
          </div>
        </div>
      </div>

      {/* COMMENT */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <MessageSquarePlus className="size-3.5" />
          Detail Review
        </Label>

        <Textarea
          name="comment"
          placeholder="Share your experience about the service quality..."
          className="min-h-[150px] resize-none rounded-[1.5rem] border-zinc-200 bg-zinc-50/50 p-5 text-sm font-medium transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900/50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-50 dark:focus:bg-zinc-900"
          required
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <Info className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="relative h-14 w-full overflow-hidden rounded-[1.5rem] bg-zinc-900 text-base font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            <span>Publishing Review...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <MessageSquarePlus className="size-5" />
            <span>Submit Feedback</span>
          </div>
        )}
      </Button>
    </form>
  );
}
