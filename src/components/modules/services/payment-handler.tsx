"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { confirmPayment } from "@/services/booking.service";

interface PaymentHandlerProps {
  bookingId: string;
}

export function PaymentHandler({ bookingId }: PaymentHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setMessage("Payment session not found");
        return;
      }

      try {
        const result = await confirmPayment(bookingId, sessionId);

        if (result?.success) {
          setStatus("success");
          setMessage("Payment confirmed successfully!");
          // Redirect to booking details after a short delay
          setTimeout(() => {
            router.push(`/bookings/${bookingId}`);
          }, 2000);
        } else {
          setStatus("error");
          setMessage(result?.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying payment");
      }
    };

    handlePaymentConfirmation();
  }, [bookingId, searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to booking details...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push(`/bookings/${bookingId}`)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
}