import { getLoggedInUserProfile } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, CalendarDays, User as UserIcon, Wrench } from "lucide-react";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default async function MyReviewsPage() {
  const profile = await getLoggedInUserProfile();

  if (!profile || !profile.client) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Failed to load reviews</p>
      </main>
    );
  }

  const reviews = profile.client.reviews || [];
  const sortedReviews = [...reviews].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-12 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-lime-400/20 blur-[140px] dark:bg-lime-500/10" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">My Reviews</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Your feedback on services and providers</p>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-12 text-center shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
            <Star className="mx-auto size-16 text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No reviews yet</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Your reviews will appear here after completing services</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedReviews.map((review, index) => (
              <Card key={`review-${review.id}-${index}`} className="rounded-[24px] border border-white/60 bg-white/80 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                        Review #{review.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Service Review
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < (review.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-700 dark:text-slate-100">{review.comment}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-100">
                    <CalendarDays className="size-4 text-emerald-500" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="pt-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>Booking ID: {review.bookingId}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {sortedReviews.length > 10 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Showing all {sortedReviews.length} reviews
            </p>
          </div>
        )}
      </div>
    </main>
  );
}