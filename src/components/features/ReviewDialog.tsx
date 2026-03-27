"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/features/ReviewForm";
import { Booking } from "@/types/booking.types";

interface ReviewDialogProps {
  booking: Booking;
}

export function ReviewDialog({ booking }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-10 rounded-xl border-yellow-300 bg-yellow-50 px-4 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-900"
          suppressHydrationWarning={true}
        >
          <Star className="mr-2 size-4" />
          Review
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] max-w-2xl rounded-3xl p-0 border border-white/20">
        <DialogHeader className="sr-only">
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience for {booking.service?.name}.
          </DialogDescription>
        </DialogHeader>
        <ReviewForm booking={booking} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}