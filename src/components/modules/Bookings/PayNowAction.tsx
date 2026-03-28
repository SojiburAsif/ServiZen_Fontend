"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initiatePayment } from "@/services/booking.service";

export function PayNowAction({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    startTransition(async () => {
      try {
        const result = await initiatePayment(bookingId);
        if (result && result.success && result.data?.paymentUrl) {
          window.location.href = result.data.paymentUrl;
        } else {
          toast.error(result?.message || "Failed to initiate payment. It may have expired.");
        }
      } catch (error) {
        toast.error("An error occurred while creating the payment session.");
      }
    });
  };

  return (
    <Button 
      onClick={handlePay} 
      disabled={isPending}
      size="sm" 
      className="w-28 rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      {isPending ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <CreditCard className="mr-1 h-3 w-3" />
      )}
      Pay Now
    </Button>
  );
}