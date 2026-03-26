import { getUserPayments } from "@/services/user-payment.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CalendarDays, User as UserIcon, Wrench } from "lucide-react";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function MyPaymentsPage() {
  const paymentsResponse = await getUserPayments({ page: 1, limit: 20 });

  if (!paymentsResponse) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Failed to load payments</p>
      </main>
    );
  }

  const { data: payments, meta } = paymentsResponse;

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-12 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-lime-400/20 blur-[140px] dark:bg-lime-500/10" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Payment History</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">View your completed payments and invoices</p>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-12 text-center shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
            <DollarSign className="mx-auto size-16 text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No payments yet</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Your completed payments will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {payments.map((payment, index) => (
              <Card key={`payment-${payment.id}-${index}`} className="rounded-[24px] border border-white/60 bg-white/80 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                        ${payment.amount}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Transaction #{payment.transactionId?.slice(-8)}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      PAID
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-100">
                    <Wrench className="size-4 text-emerald-500" />
                    <span>{payment.booking.service.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-100">
                    <UserIcon className="size-4 text-emerald-500" />
                    <span>{payment.booking.provider.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-100">
                    <CalendarDays className="size-4 text-emerald-500" />
                    <span>{formatDate(payment.createdAt)}</span>
                  </div>
                  <div className="pt-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>Booking Status: {payment.booking.status}</p>
                    <p>Payment Status: {payment.booking.paymentStatus}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {meta.total > meta.limit && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Showing {payments.length} of {meta.total} payments
            </p>
          </div>
        )}
      </div>
    </main>
  );
}