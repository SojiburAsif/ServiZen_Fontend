"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  Clock3,
  DollarSign,
  Eye,
  Hash,
  Mail,
  MapPin,
  MessageSquare,
  Star,
  User,
  XCircle,
  AlertCircle,
  ChevronRight,
  Ban,
  PencilLine,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookingStatus = "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED";

type ReviewRecord = {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type BookingRecord = {
  id: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  city: string;
  address: string;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: "PAID" | "UNPAID" | string;
  service: {
    id?: string;
    name: string;
    duration?: number | string | null;
    imageUrl?: string | null;
  };
  provider: {
    name: string;
    email: string;
    profilePhoto?: string | null;
  };
};

type Props = {
  bookings: BookingRecord[];
  reviews: ReviewRecord[];
  updateBookingStatus: (formData: FormData) => Promise<void> | void;
  submitReview: (formData: FormData) => Promise<void> | void;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const [h, m] = value.split(":");
  const d = new Date("2024-01-01T00:00:00Z");
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
    case "WORKING":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200";
  }
}

function getStatusIcon(status: string) {
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
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getStats(bookings: BookingRecord[], reviews: ReviewRecord[]) {
  return {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    reviews: reviews.length,
  };
}

function SubmitButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? "Please wait..." : children}
    </Button>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge className={`rounded-full px-3 py-1.5 font-semibold ${getStatusColor(status)}`}>
      <span className="mr-1 inline-flex">{getStatusIcon(status)}</span>
      {status}
    </Badge>
  );
}

function PaymentBadge({ paymentStatus }: { paymentStatus: string }) {
  const paid = paymentStatus === "PAID";

  return (
    <Badge
      className={`rounded-full px-3 py-1.5 font-semibold ${
        paid
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
          : "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200"
      }`}
    >
      {paymentStatus}
    </Badge>
  );
}

function ReviewBookingDialog({
  booking,
  review,
  submitReview,
}: {
  booking: BookingRecord;
  review?: ReviewRecord;
  submitReview: (formData: FormData) => Promise<void> | void;
}) {
  const [rating, setRating] = useState<number>(review?.rating ?? 0);
  const [comment, setComment] = useState<string>(review?.comment ?? "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-10 rounded-full bg-amber-500 px-4 text-white hover:bg-amber-600"
        >
          <PencilLine className="mr-2 size-4" />
          Write Review
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-[1.75rem] border border-white/40 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="rounded-t-[1.75rem] bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Review this service
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-white/90">
              Share your experience for <span className="font-semibold">{booking.service.name}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <form action={submitReview} className="space-y-6 p-6">
          <input type="hidden" name="bookingId" value={booking.id} />
          <input type="hidden" name="serviceId" value={booking.serviceId} />
          <input type="hidden" name="rating" value={rating} />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Rating
              </Label>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {rating ? `${rating}/5` : "Select rating"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                    star <= rating
                      ? "border-amber-400 bg-amber-400/10 text-amber-500"
                      : "border-slate-200 bg-white text-slate-300 hover:border-amber-200 hover:text-amber-400 dark:border-white/10 dark:bg-slate-950 dark:hover:text-amber-400"
                  }`}
                >
                  <Star className={`size-5 ${star <= rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Comment
            </Label>
            <Textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write what you liked, what can be better, and your overall experience..."
              className="min-h-[140px] rounded-2xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-slate-200 bg-white px-6 font-semibold dark:border-white/10 dark:bg-slate-900"
              onClick={() => {
                setRating(review?.rating ?? 0);
                setComment(review?.comment ?? "");
              }}
            >
              Reset
            </Button>

            <SubmitButton className="h-12 rounded-full bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
              <MessageSquare className="mr-2 size-4" />
              Submit Review
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BookingDetailsDialog({
  booking,
  review,
}: {
  booking: BookingRecord;
  review?: ReviewRecord;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-10 rounded-full bg-emerald-600 px-4 text-white hover:bg-emerald-700"
        >
          <Eye className="mr-2 size-4" />
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-[1.75rem] border border-white/40 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="rounded-t-[1.75rem] bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Booking Details
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-white/90">
              Booking #{booking.id.slice(-8)}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="size-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Booking Information
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <Row label="Service" value={booking.service.name} />
                <Row label="Date" value={formatDate(booking.bookingDate)} />
                <Row label="Time" value={formatTime(booking.bookingTime)} />
                <Row
                  label="Duration"
                  value={
                    booking.service.duration != null
                      ? `${booking.service.duration} hours`
                      : "N/A"
                  }
                />
                <Row
                  label="Provider"
                  value={booking.provider?.name || "Unknown"}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center gap-2">
                <DollarSign className="size-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Payment Details
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <Row label="Total Amount" value={formatCurrency(booking.totalAmount)} strong />
                <Row
                  label="Payment Status"
                  value={<PaymentBadge paymentStatus={booking.paymentStatus} />}
                />
                <Row
                  label="Booking Status"
                  value={<StatusBadge status={booking.status} />}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Service Location
              </h3>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                {booking.address}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {booking.city}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="mb-4 flex items-center gap-2">
              <User className="size-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Service Provider
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 text-white">
                {booking.provider?.profilePhoto ? (
                  <img
                    src={booking.provider.profilePhoto}
                    alt={booking.provider.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="size-7" />
                )}
              </div>

              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {booking.provider?.name || "Unknown"}
                </p>
                <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                  <Mail className="size-4" />
                  {booking.provider?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {booking.status === "COMPLETED" && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center gap-2">
                <Star className="size-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Review
                </h3>
              </div>

              {review ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-5 ${
                          index < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      ({review.rating}/5)
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                    {review.comment}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300">
                  No review submitted yet.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-0 last:pb-0 dark:border-white/10">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-right ${strong ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}

export function MyBookingsClient({ bookings, reviews, updateBookingStatus, submitReview }: Props) {
  const stats = useMemo(() => getStats(bookings, reviews), [bookings, reviews]);

  const reviewsMap = useMemo(() => {
    return reviews.reduce<Record<string, ReviewRecord>>((acc, review) => {
      acc[review.bookingId] = review;
      return acc;
    }, {});
  }, [reviews]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-6 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 right-[-8rem] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-[-8rem] h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/50 bg-white/65 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <BadgeCheck className="h-4 w-4" />
              Booking dashboard
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              My Bookings
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              আপনার সব বুকিং, স্ট্যাটাস, পেমেন্ট, provider info, আর review status
              এক জায়গায়।
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            icon={<CalendarDays className="size-6 text-blue-600 dark:text-blue-400" />}
            title="Total Bookings"
            value={stats.total}
            iconBg="bg-blue-100 dark:bg-blue-500/20"
          />
          <StatCard
            icon={<CheckCircle className="size-6 text-emerald-600 dark:text-emerald-400" />}
            title="Completed"
            value={stats.completed}
            iconBg="bg-emerald-100 dark:bg-emerald-500/20"
          />
          <StatCard
            icon={<AlertCircle className="size-6 text-amber-600 dark:text-amber-400" />}
            title="Pending"
            value={stats.pending}
            iconBg="bg-amber-100 dark:bg-amber-500/20"
          />
          <StatCard
            icon={<Star className="size-6 text-purple-600 dark:text-purple-400" />}
            title="Reviews Given"
            value={stats.reviews}
            iconBg="bg-purple-100 dark:bg-purple-500/20"
          />
        </section>

        {bookings.length === 0 ? (
          <div className="rounded-[2rem] border border-white/50 bg-white/70 p-12 text-center shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <CalendarDays className="size-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              No Bookings Found
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              You haven&apos;t made any bookings yet.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="grid gap-4 md:hidden">
              {bookings.map((booking) => {
                const review = reviewsMap[booking.id];
                const canReview = booking.status === "COMPLETED" && !review;
                const canCancel =
                  booking.status === "PENDING" || booking.status === "ACCEPTED";

                return (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-[1.75rem] border border-white/50 bg-white/75 shadow-[0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60"
                  >
                    <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
                      {booking.service.imageUrl ? (
                        <img
                          src={booking.service.imageUrl}
                          alt={booking.service.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-600 to-lime-500 text-white">
                          <CalendarDays className="size-10" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {booking.service.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {booking.provider.name}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm">
                        <InfoLine label="Date" value={formatDate(booking.bookingDate)} />
                        <InfoLine label="Time" value={formatTime(booking.bookingTime)} />
                        <InfoLine label="Location" value={`${booking.address}, ${booking.city}`} />
                        <InfoLine label="Amount" value={formatCurrency(booking.totalAmount)} />
                        <InfoLine label="Payment" value={<PaymentBadge paymentStatus={booking.paymentStatus} />} />
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <BookingDetailsDialog booking={booking} review={review} />

                        {canReview ? (
                          <ReviewBookingDialog
                            booking={booking}
                            review={review}
                            submitReview={submitReview}
                          />
                        ) : null}

                        {canCancel ? (
                          <form action={updateBookingStatus}>
                            <input type="hidden" name="bookingId" value={booking.id} />
                            <input type="hidden" name="status" value="CANCELLED" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="destructive"
                              className="h-10 rounded-full px-4"
                            >
                              <Ban className="mr-2 size-4" />
                              Cancel
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-[2rem] border border-white/50 bg-white/75 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-white/5 md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <tr>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">#</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Service</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Date & Time</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Location</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Amount</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Payment</th>
                      <th className="p-5 text-left text-sm font-bold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking, index) => {
                      const review = reviewsMap[booking.id];
                      const canReview = booking.status === "COMPLETED" && !review;
                      const canCancel =
                        booking.status === "PENDING" || booking.status === "ACCEPTED";

                      return (
                        <tr
                          key={booking.id}
                          className="border-t border-slate-200/70 transition hover:bg-white/70 dark:border-white/10 dark:hover:bg-white/5"
                        >
                          <td className="p-5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              {index + 1}
                            </div>
                          </td>

                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-600 dark:from-emerald-500/20 dark:to-lime-500/20 dark:text-emerald-300">
                                {booking.service.imageUrl ? (
                                  <img
                                    src={booking.service.imageUrl}
                                    alt={booking.service.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Hash className="size-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {booking.service.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {booking.provider.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {formatDate(booking.bookingDate)}
                              </p>
                              <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                <Clock3 className="size-3.5" />
                                {formatTime(booking.bookingTime)}
                              </p>
                            </div>
                          </td>

                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {booking.city}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {booking.address}
                              </p>
                            </div>
                          </td>

                          <td className="p-5">
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {formatCurrency(booking.totalAmount)}
                            </p>
                          </td>

                          <td className="p-5">
                            <StatusBadge status={booking.status} />
                          </td>

                          <td className="p-5">
                            <PaymentBadge paymentStatus={booking.paymentStatus} />
                          </td>

                          <td className="p-5">
                            <div className="flex flex-wrap items-center gap-2">
                              <BookingDetailsDialog booking={booking} review={review} />

                              {canReview ? (
                                <ReviewBookingDialog
                                  booking={booking}
                                  review={review}
                                  submitReview={submitReview}
                                />
                              ) : null}

                              {canCancel ? (
                                <form action={updateBookingStatus}>
                                  <input type="hidden" name="bookingId" value={booking.id} />
                                  <input type="hidden" name="status" value="CANCELLED" />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant="destructive"
                                    className="h-10 rounded-full px-4"
                                  >
                                    <Ban className="mr-2 size-4" />
                                    Cancel
                                  </Button>
                                </form>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  iconBg: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/75 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
