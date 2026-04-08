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
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-lg px-4 py-8">
        
        {/* Header - Fixed & Styled */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="size-3 fill-emerald-500" />
            Feedback Portal
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
            Write a <span className="text-emerald-500">Review</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xs mx-auto">
            Your feedback helps us maintain the highest service standards.
          </p>
        </div>

        {/* Content Area - B&W Aesthetic */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle Decorative Background Element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 size-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {unreviewedBookings.length === 0 ? (
            <div className="py-16 text-center space-y-6">
              <div className="size-20 rounded-3xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-100 dark:border-zinc-800 rotate-6 transition-transform group-hover:rotate-0">
                <MessageSquare className="size-10 text-zinc-300 dark:text-zinc-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">Clear Queue</h3>
                <p className="text-sm font-medium text-zinc-400">
                  You have no pending reviews at this moment.
                </p>
              </div>
            </div>
          ) : (
            /* Pass data to Client Component */
            <div className="relative z-10">
              <AddReviewForm unreviewedBookings={unreviewedBookings} />
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
          <p className="text-center text-[9px] text-zinc-400 font-bold uppercase tracking-[0.4em]">
            Verified Secure Portal
          </p>
        </div>
      </div>
    </main>
  );
}
