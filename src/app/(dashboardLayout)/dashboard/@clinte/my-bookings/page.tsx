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
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "WORKING":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
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
          className={`size-5 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
    <main className="min-h-screen bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] p-4 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            View and manage all your bookings here
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-500/20">
                <CalendarDays className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-100">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-green-100 p-3 dark:bg-green-500/20">
                <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Completed
                </p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-100">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-500/20">
                <AlertCircle className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Pending
                </p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-100">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-purple-100 p-3 dark:bg-purple-500/20">
                <Star className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Reviews Given
                </p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-100">
                  {reviews.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-5 text-left font-semibold">#</th>
                  <th className="px-6 py-5 text-left font-semibold">Service</th>
                  <th className="px-6 py-5 text-left font-semibold">Date & Time</th>
                  <th className="px-6 py-5 text-left font-semibold">Location</th>
                  <th className="px-6 py-5 text-left font-semibold">Amount</th>
                  <th className="px-6 py-5 text-left font-semibold">Status</th>
                  <th className="px-6 py-5 text-left font-semibold">Payment</th>
                  <th className="px-6 py-5 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking: Booking, index: number) => {
                  const hasReview = reviewsMap[booking.id];
                  const canReview = booking.status === "COMPLETED" && !hasReview;
                  const canChangeStatus =
                    booking.status === "PENDING" || booking.status === "ACCEPTED";

                  return (
                    <tr
                      key={booking.id}
                      className="border-t border-white/20 transition-colors hover:bg-white/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {index + 1}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20">
                            <Hash className="size-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {booking.service?.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {booking.service?.duration} hours
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-500/20">
                            <CalendarDays className="size-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {formatDate(booking.bookingDate)}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                              <Clock3 className="size-3" />
                              {formatTime(booking.bookingTime)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-red-100 p-2 dark:bg-red-500/20">
                            <MapPin className="size-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {booking.city}
                            </p>
                            <p className="max-w-[220px] text-sm text-slate-600 dark:text-slate-300">
                              {booking.address}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            ৳{booking.totalAmount}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        {canChangeStatus ? (
                          <div className="flex flex-col gap-2">
                            <Badge
                              className={`flex w-28 items-center justify-center gap-1 rounded-full px-3 py-1 ${getStatusColor(
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
                            className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 ${getStatusColor(
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
                            className={`w-fit rounded-full px-3 py-1 ${
                              booking.paymentStatus === "PAID"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
                            <Badge className="w-fit rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
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
          <div className="mt-8 rounded-3xl border border-white/60 bg-white/80 p-12 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-500/20">
              <CalendarDays className="size-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
              No Bookings Found
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              You haven&apos;t made any bookings yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
