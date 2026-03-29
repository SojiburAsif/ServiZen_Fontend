"use client";

import { useTransition, useState } from "react";
import { updateBookingStatusAction } from "@/app/actions/booking.actions";
import { Booking } from "@/types/booking.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { XCircle, AlertTriangle, Hash, CalendarDays, DollarSign, Loader2 } from "lucide-react";

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

export function CancelBookingDialog({ booking }: { booking: Booking }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    startTransition(async () => {
      const res = await updateBookingStatusAction(booking.id, "CANCELLED");
      if (res.success) {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="h-8 w-28 rounded-full text-xs"
        >
          <XCircle className="mr-1 size-3" />
          Cancel
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-md rounded-3xl border border-red-200/50 bg-black p-0 shadow-2xl dark:border-red-500/20 dark:bg-black">
        <div className="p-6">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
              <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/20">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Hash className="size-4 text-slate-400" />
                <span className="text-sm font-medium text-white">
                  Booking #{String(booking.id).slice(-8)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 text-slate-400" />
                <span className="text-sm text-slate-300">
                  {formatDate(booking.bookingDate)} at {formatTime(booking.bookingTime)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="size-4 text-slate-400" />
                <span className="text-sm font-semibold text-white">
                  ৳{booking.totalAmount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="flex-1 rounded-2xl border-slate-200 bg-white/80 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
            >
              Keep Booking
            </Button>

            <Button
              onClick={handleCancel}
              disabled={isPending}
              variant="destructive"
              className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 size-4" />
              )}
              {isPending ? "Canceling..." : "Cancel Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}