/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserBookings } from "@/services/user-booking.service";
import { createReview } from "@/services/review.service";
import { getLoggedInUserProfile } from "@/services/user.service";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AddReviewForm } from "@/components/features/AddReviewForm";
import { Booking } from "@/types/booking.types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  MessageSquarePlus,
  Info,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default async function AddReviewPage() {
  const bookingsRes = await getUserBookings({ page: 1, limit: 100 });
  const profile = await getLoggedInUserProfile();

  const bookings = bookingsRes?.data || [];
  const reviews = profile?.client?.reviews || [];

  const reviewsMap = reviews.reduce((acc: any, review: any) => {
    acc[review.bookingId] = review;
    return acc;
  }, {});

  const unreviewedBookings = bookings.filter(
    (b: any) => b.status === "COMPLETED" && !reviewsMap[b.id]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-6 text-slate-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="size-4" />
              Share your experience
            </div>

            <h1 className="text-3xl font-black sm:text-5xl">
              Add Review
            </h1>

            <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Select a completed booking and share your experience to help others.
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="mt-8 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">

          {unreviewedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-500/20">
                <Info className="size-10 text-slate-400" />
              </div>

              <h3 className="text-2xl font-bold">
                No pending reviews
              </h3>

              <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
                You have no completed bookings that need a review right now.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="size-4" />
                All caught up
              </div>
            </div>
          ) : (
            <AddReviewForm unreviewedBookings={unreviewedBookings} />
          )}
        </div>
      </div>
    </main>
  );
}


