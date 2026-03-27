/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2 } from "lucide-react";
import { env } from "@/lib/env";
import { Booking } from "@/types/booking.types";
import { toast } from "sonner";

interface ReviewFormProps {
  booking: Booking;
  onSuccess?: () => void;
}

export function ReviewForm({ booking, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const rating = formData.get("rating") as string;
    const comment = formData.get("comment") as string;

    if (!rating || !comment) {
      setError("Please fill all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends cookies
        body: JSON.stringify({
          bookingId: booking.id,
          rating: parseInt(rating),
          comment,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-6 text-emerald-600" />
          <h3 className="text-xl font-semibold">Write a Review</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Share your experience for {booking.service?.name}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor={`rating-${booking.id}`} className="text-slate-900 dark:text-white">
            Rating
          </Label>
          <select
            id={`rating-${booking.id}`}
            name="rating"
            required
            defaultValue=""
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="" disabled>
              Select rating...
            </option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`comment-${booking.id}`} className="text-slate-900 dark:text-white">
            Comment
          </Label>
          <Textarea
            id={`comment-${booking.id}`}
            name="comment"
            placeholder="Share your experience..."
            className="min-h-[140px] rounded-xl border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <MessageSquare className="mr-2 size-4" />
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
}