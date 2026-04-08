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
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <p className="text-zinc-500 font-bold uppercase tracking-widest">Failed to load reviews</p>
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
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
              My <span className="text-emerald-500">Reviews</span>
            </h1>
            <p className="text-zinc-500 mt-2 max-w-md">
              Share your experience and help others find the best service providers.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
               <Star className="text-emerald-500 size-6 fill-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Total Reviews</p>
              <p className="text-xl font-black text-emerald-500 leading-none">
                {reviews.length}
              </p>
            </div>
          </div>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
            <Star className="mx-auto size-16 text-zinc-200 dark:text-zinc-800" />
            <h2 className="mt-4 text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">No reviews yet</h2>
            <p className="mt-2 text-zinc-500">Your reviews will appear here after completing services</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedReviews.map((review, index: number) => (
              <Card key={`review-${review.id}-${index}`} className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden group hover:border-emerald-500/50 transition-all">
                <CardHeader className="pb-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-black uppercase text-zinc-900 dark:text-white">
                        Review <span className="text-emerald-500">#{review.id.slice(-8)}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarDays className="size-3 text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded-full">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < (review.rating || 0)
                              ? "fill-emerald-500 text-emerald-500"
                              : "text-zinc-300 dark:text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium italic">
                    {review.comment}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                       <Wrench className="size-3 text-emerald-500" />
                       <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Booking Context</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-200 dark:border-zinc-800 text-zinc-400">
                      ID: {review.bookingId?.slice(-8) || "N/A"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {sortedReviews.length > 10 && (
          <div className="mt-8 text-center border-t border-zinc-100 dark:border-zinc-800 pt-8">
            <p className="text-xs font-bold uppercase text-zinc-500 tracking-widest">
              Showing all {sortedReviews.length} reviews
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
