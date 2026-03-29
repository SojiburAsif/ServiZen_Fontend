/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserBookings } from "@/services/user-booking.service";
import { getLoggedInUserProfile } from "@/services/user.service";
import { AddReviewForm } from "@/components/features/AddReviewForm";
import { Sparkles, MessageSquare } from "lucide-react";

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
    <main className="min-h-screen bg-black text-zinc-300 p-6 flex flex-col items-center justify-center">
      {/* Container - Max width choto kora hoyeche (max-w-lg) */}
      <div className="w-full max-w-lg">
        
        {/* Header - Simple & Clean */}
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/80 text-[11px] font-medium uppercase tracking-widest">
            <Sparkles className="size-3" />
            Feedback Portal
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Write a <span className="text-emerald-500">Review</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Share your experience with the service provider.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          {unreviewedBookings.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="size-14 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto">
                <MessageSquare className="size-6 text-zinc-600" />
              </div>
              <p className="text-sm font-medium text-zinc-500">
                You have no pending reviews at this moment.
              </p>
            </div>
          ) : (
            /* Pass data to Client Component */
            <AddReviewForm unreviewedBookings={unreviewedBookings} />
          )}
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] text-zinc-700 font-medium uppercase tracking-[0.3em]">
          Verified Transactions Only
        </p>
      </div>
    </main>
  );
}