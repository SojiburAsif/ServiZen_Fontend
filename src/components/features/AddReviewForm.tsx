/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquarePlus, Info, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Booking } from "@/types/booking.types";
import { toast } from "sonner";
import { createReview } from "@/app/actions/review-actions";

interface AddReviewFormProps {
  unreviewedBookings: Booking[];
}

export function AddReviewForm({ unreviewedBookings }: AddReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const bookingSelection = formData.get("bookingSelection") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!bookingSelection || !rating || !comment.trim()) {
      setError("Please fill all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createReview({
        bookingId: bookingSelection.split("|")[0],
        rating,
        comment: comment.trim() || undefined, // Make comment optional
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
      <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center dark:from-green-950/20 dark:to-emerald-950/20">
        <CheckCircle2 className="size-16 text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
          Review Submitted Successfully!
        </h2>
        <p className="text-green-700 dark:text-green-300">
          Thank you for your feedback. Your review helps improve our services.
        </p>
        <Button
          onClick={() => router.push("/dashboard/my-reviews")}
          className="mt-4 rounded-xl bg-green-600 text-white hover:bg-green-700"
        >
          View My Reviews
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* BOOKING SELECT */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-slate-900 dark:text-white">
          Select Booking
        </Label>

        <select
          name="bookingSelection"
          required
          defaultValue=""
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 shadow-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="" disabled>
            Select a completed service...
          </option>

          {unreviewedBookings.map((b: any) => (
            <option key={b.id} value={`${b.id}|${b.serviceId}`}>
              {b.service?.name} • {new Date(b.bookingDate).toLocaleDateString()} • {b.provider?.name}
            </option>
          ))}
        </select>
      </div>

      {/* RATING */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-slate-900 dark:text-white">
          Rating
        </Label>

        <select
          name="rating"
          required
          defaultValue=""
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 shadow-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="" disabled>Select rating...</option>
          <option value="5">5 - Excellent ⭐⭐⭐⭐⭐</option>
          <option value="4">4 - Very Good ⭐⭐⭐⭐</option>
          <option value="3">3 - Good ⭐⭐⭐</option>
          <option value="2">2 - Fair ⭐⭐</option>
          <option value="1">1 - Poor ⭐</option>
        </select>
      </div>

      {/* COMMENT */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-slate-900 dark:text-white">
          Review Comment
        </Label>

        <Textarea
          name="comment"
          placeholder="Write your experience..."
          className="min-h-[180px] rounded-2xl border-slate-300 p-4 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
          required
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-400">
          <Info className="mr-2 inline size-5" />
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <MessageSquarePlus className="mr-2 size-5" />
            Submit Review
          </>
        )}
      </Button>
    </form>
  );
}