/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserBookings, updateUserBooking } from "@/services/user-booking.service";
import { createReview } from "@/services/review.service";
import { getLoggedInUserProfile } from "@/services/user.service";
import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReviewForm } from "@/components/features/ReviewForm";
import { Booking } from "@/types/booking.types";
import { ReviewRecord } from "@/services/user.service";
import { ReviewDialog } from "@/components/features/ReviewDialog";

import {
  CalendarDays,
  Clock3,
  MapPin,
  DollarSign,
  Eye,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Hash,
  AlertTriangle,
} from "lucide-react";

import { PayNowAction } from "@/components/modules/Bookings/PayNowAction";
import { CancelBookingDialog } from "@/components/modules/Bookings/CancelBookingDialog";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (value: string) => {
  const [h, m] = value.split(":");
  const d = new Date("2024-01-01T00:00:00Z");
  d.setHours(+h, +m);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
    case "WORKING":
      return "bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white";
    case "COMPLETED":
      return "bg-emerald-500 text-black border-emerald-500";
    case "CANCELLED":
      return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20";
    default:
      return "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <AlertCircle className="size-4" />;
    case "ACCEPTED":
      return <CheckCircle className="size-4" />;
    case "WORKING":
      return <Clock3 className="size-4" />;
    case "COMPLETED":
      return <CheckCircle className="size-4" />;
    case "CANCELLED":
      return <XCircle className="size-4" />;
    default:
      return <AlertCircle className="size-4" />;
  }
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= rating ? "text-emerald-500 fill-emerald-500" : "text-zinc-200 dark:text-zinc-800"
          }`}
        />
      ))}
    </div>
  );
};

function BookingDetailsDialog({
  booking,
  hasReview,
}: {
  booking: Booking;
  hasReview: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-10 rounded-xl bg-emerald-600 px-4 text-white hover:bg-emerald-700"
          suppressHydrationWarning={true}
        >
          <Eye className="mr-2 size-4" />
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[98vw] max-w-[95vw] xl:max-w-7xl max-h-[92vh] overflow-hidden rounded-3xl p-0 border border-white/20">
        <div className="max-h-[92vh] overflow-y-auto">
          <div className="sticky top-0 z-10 border-b bg-white/90 px-6 py-5 backdrop-blur dark:bg-slate-950/90">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                <Hash className="size-6 text-emerald-600" />
                Booking Details #{String(booking.id).slice(-8)}
              </DialogTitle>
              <DialogDescription>
                Complete details for {booking.service?.name}.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm dark:from-blue-500/10 dark:to-indigo-500/10">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <CalendarDays className="size-5 text-blue-600" />
                  Booking Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 dark:border-white/10">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Service</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {booking.service?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 dark:border-white/10">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Date</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatDate(booking.bookingDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 dark:border-white/10">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Time</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatTime(booking.bookingTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Duration</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {booking.service?.duration} hours
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm dark:from-green-500/10 dark:to-emerald-500/10">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <DollarSign className="size-5 text-green-600" />
                  Payment Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 dark:border-white/10">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Total Amount</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ৳{booking.totalAmount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 dark:border-white/10">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Payment Status</span>
                    <Badge
                      className={`rounded-full px-3 py-1 ${
                        booking.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Booking Status</span>
                    <Badge
                      className={`rounded-full px-3 py-1 flex items-center gap-1 ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm dark:from-purple-500/10 dark:to-pink-500/10">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <MapPin className="size-5 text-purple-600" />
                Service Location
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {booking.address}
                </p>
                <p className="text-slate-600 dark:text-slate-300">{booking.city}</p>
              </div>
            </div>

            <div className="rounded-3xl border bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:from-orange-500/10 dark:to-amber-500/10">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <User className="size-5 text-orange-600" />
                Service Provider
              </h3>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-500/20 dark:to-amber-500/20">
                  <User className="size-7 text-orange-600 dark:text-orange-400" />
                </div>

                <div className="space-y-1">
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">
                    {booking.provider?.name}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="size-4" />
                    {booking.provider?.email}
                  </p>

                  {booking.provider?.phone && (
                    <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="size-4" />
                      {booking.provider.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {booking.status === "COMPLETED" && (
              <div className="rounded-3xl border bg-gradient-to-br from-slate-50 to-gray-50 p-6 shadow-sm dark:from-slate-500/10 dark:to-gray-500/10">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Star className="size-5 text-yellow-600" />
                  Review & Rating
                </h3>

                {hasReview ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {renderStars((hasReview as any).rating)}
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        ({(hasReview as any).rating}/5)
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                      <p className="text-slate-900 dark:text-white">{(hasReview as any).comment}</p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Reviewed on {new Date((hasReview as any).createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-300">
                    You have not submitted a review for this booking yet. Use the
                    separate review button beside this booking.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default async function MyBookingsPage() {
  const bookingsRes = await getUserBookings({ page: 1, limit: 50 });
  const profile = await getLoggedInUserProfile();

  if (!bookingsRes) return <p className="p-10">Failed to load bookings</p>;

  const bookings = bookingsRes.data || [];
  const reviews: ReviewRecord[] = profile?.client?.reviews || [];

  const reviewsMap = reviews.reduce((acc: Record<string, ReviewRecord>, review: ReviewRecord) => {
    if (review.bookingId) {
      acc[review.bookingId] = review;
    }
    return acc;
  }, {} as Record<string, ReviewRecord>);

  const completedCount = bookings.filter((b: any) => b.status === "COMPLETED").length;
  const pendingCount = bookings.filter((b: any) => b.status === "PENDING").length;

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl uppercase">
            My <span className="text-emerald-500">Bookings</span>
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            View and manage all your bookings here
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
                <CalendarDays className="size-6 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Total Bookings
                </p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-100/50 p-3 dark:bg-emerald-500/10">
                <CheckCircle className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Completed
                </p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-yellow-100/50 p-3 dark:bg-yellow-500/10">
                <AlertCircle className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Pending
                </p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
                <Star className="size-6 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Reviews Given
                </p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {reviews.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 w-[50px]">#</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[200px]">Service</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[150px]">Date & Time</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[300px]">Location & Address</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[120px]">Amount</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[130px]">Status</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[130px]">Payment</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500 min-w-[150px]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {bookings.map((booking: Booking, index: number) => {
                  const hasReview = reviewsMap[booking.id];
                  const canReview = booking.status === "COMPLETED" && !hasReview;
                  const canChangeStatus =
                    booking.status === "PENDING" || booking.status === "ACCEPTED";

                  return (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                            {index + 1}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                            <Hash className="size-5 text-zinc-500" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">
                              {booking.service?.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {booking.service?.duration} hours
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
                            <CalendarDays className="size-4 text-zinc-500" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">
                              {formatDate(booking.bookingDate)}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-zinc-500">
                              <Clock3 className="size-3" />
                              {formatTime(booking.bookingTime)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800 flex-shrink-0">
                            <MapPin className="size-4 text-zinc-500" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-bold text-zinc-900 dark:text-white">
                              {booking.city}
                            </p>
                            <p className="text-xs text-zinc-500 leading-relaxed break-words">
                              {booking.address}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-zinc-500">৳</span>
                          <span className="text-lg font-black text-zinc-900 dark:text-white">
                            {booking.totalAmount}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        {canChangeStatus ? (
                          <div className="flex flex-col gap-2">
                            <Badge
                              className={`flex w-fit items-center justify-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </Badge>
                            <CancelBookingDialog booking={booking} />
                          </div>
                        ) : (
                          <Badge
                            className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        )}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col gap-2">
                          <Badge
                            className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                              booking.paymentStatus === "PAID"
                                ? "bg-emerald-500 text-black"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {booking.paymentStatus}
                          </Badge>
                          {booking.paymentStatus === "UNPAID" && 
                           booking.status !== "CANCELLED" && 
                           (new Date().getTime() - new Date(booking.createdAt).getTime() <= 30 * 60 * 1000) && (
                            <PayNowAction bookingId={booking.id} />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col gap-2">
                          <BookingDetailsDialog booking={booking} hasReview={!!hasReview} />

                          {canReview && <ReviewDialog booking={booking} />}

                          {booking.status === "COMPLETED" && hasReview && (
                            <Badge className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              Review Submitted
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {bookings.length === 0 && (
          <div className="mt-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <CalendarDays className="size-8 text-zinc-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
              No Bookings Found
            </h3>
            <p className="text-zinc-500">
              You haven&apos;t made any bookings yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
