import { Suspense } from "react";
import { PaymentHandler } from "@/components/modules/services/payment-handler";

interface PaymentConfirmPageProps {
  params: {
    id: string;
  };
}

export default function PaymentConfirmPage({ params }: PaymentConfirmPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentHandler bookingId={params.id} />
    </Suspense>
  );
}