import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Sparkles,
  Star,
  Tag,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getServiceById, type ServiceRecord } from "@/services/services.service";
import { BookingForm } from "@/components/modules/services/booking-form";

type ServiceDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id: serviceId } = await params;

  if (!serviceId || serviceId === "undefined") notFound();

  let service: ServiceRecord | null = null;

  try {
    const response = await getServiceById(serviceId);
    service = response?.data ?? null;
  } catch (error) {
    console.error("Error fetching service:", error);
  }

  if (!service) notFound();

  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] text-gray-900 selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white">
      <div className="pointer-events-none absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-lime-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[180px] font-bold leading-none text-green-800/5 dark:text-green-500/5 md:text-[280px] lg:text-[400px]">
        S Z
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-x-1 hover:text-emerald-600 dark:border-white/10 dark:bg-black/20 dark:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-28 w-28 rounded-3xl bg-emerald-500 sm:-right-6 sm:-top-6 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />
            <div className="absolute -left-4 -bottom-4 h-28 w-28 rounded-3xl border border-white/60 bg-white/60 backdrop-blur sm:-left-6 sm:-bottom-6 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />

            <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/50 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/60">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-600 to-lime-500 text-white">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-3 h-10 w-10" />
                      <p className="text-base font-semibold">No Preview Available</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur dark:bg-slate-950/90 dark:text-white">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  Premium service
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                    <UserRound className="h-3.5 w-3.5" />
                    Verified provider
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white backdrop-blur ${
                      service.isActive ? "bg-emerald-500/90" : "bg-rose-500/90"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {service.isActive ? "Available now" : "Currently paused"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <Star className="h-4 w-4 fill-current" />
                {service.specialty?.title || "General"}
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                {service.name}
              </h1>

              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                {service.description ||
                  "Get a reliable, high-quality service tailored to your needs with clear pricing and smooth booking."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {service.specialty?.title || "Professional worker"}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <Clock3 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {service.duration ? `Duration: ${service.duration}` : "Fast response"}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <Tag className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Fixed price: {formatCurrency(service.price)}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Quality checked service
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Why this service stands out
              </div>

              <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Smooth booking experience
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Transparent pricing
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Trusted provider profile
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Mobile-friendly details
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookingForm service={service} />

              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full border-white/60 bg-white/70 px-8 text-sm font-bold shadow-sm backdrop-blur hover:bg-white dark:border-white/10 dark:bg-slate-950/40 dark:hover:bg-slate-950/70"
              >
                <Link href="/services">Browse more services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
