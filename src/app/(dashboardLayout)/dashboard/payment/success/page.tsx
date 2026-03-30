import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ booking_id?: string; session_id?: string }>
}) {
  const { booking_id, session_id } = await searchParams;

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <PaymentSuccessClient />
      <div className="mx-auto max-w-md text-center bg-card p-8 rounded-2xl shadow-sm border border-green-200/50 dark:border-green-900/50">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-20 w-20 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Your payment has been processed successfully. Your booking is now confirmed.
        </p>

        {booking_id && (
          <div className="bg-muted p-4 rounded-lg mb-8 font-mono text-sm break-all">
            Booking ID: <br/>{booking_id}
          </div>
        )}

        {session_id && (
          <div className="bg-muted p-4 rounded-lg mb-8 font-mono text-sm break-all">
            Session ID: <br/>{session_id}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard/my-bookings">
            <Button>View My Bookings</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}