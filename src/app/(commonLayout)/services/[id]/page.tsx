/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getServiceById, type ServiceRecord } from "@/services/services.service";
import { BookingForm } from "@/components/modules/services/booking-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  let service: any = null;
  try {
    const response = await getServiceById(serviceId);
    service = response?.data ?? null;
  } catch (error) { console.error(error); }

  if (!service) notFound();

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white">
      {/* Background SZ Logo - Dinajpur Aesthetic */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[200px] font-black leading-none text-green-600/5 md:text-[300px] lg:text-[450px]">
        SZ
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="group mb-12 inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-green-600 transition-all"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
          Back to listing
        </Link>

        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Left: Image Container */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-green-500/20 to-lime-500/20 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
              <img
                src={service.imageUrl || "https://via.placeholder.com/800"}
                alt={service.name}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 dark:bg-black/90 px-4 py-2 text-xs font-bold text-zinc-900 dark:text-white shadow-xl backdrop-blur-xl">
                  <BadgeCheck className="h-4 w-4 text-green-600" />
                  Premium Service
                </span>
              </div>
            </div>
          </div>

          {/* Right: Service Details */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white uppercase tracking-tighter">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {service.provider?.averageRating?.toFixed(1) || "5.0"}
                </div>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  {service.specialty?.title || "General"}
                </span>
              </div>

              <h1 className="text-5xl font-black leading-[1.1] tracking-tighter sm:text-7xl">
                {service.name}
              </h1>

              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {service.description || "Top-tier service provider in Dinajpur with a focus on quality and customer satisfaction."}
              </p>
            </div>

            {/* Provider Spotlight */}
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <Avatar className="h-14 w-14 border-2 border-green-500/20">
                <AvatarImage src={service.provider?.profilePhoto} />
                <AvatarFallback>{service.provider?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black">{service.provider?.name}</h4>
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">{service.provider?.contactNumber}</p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800">
                <Clock3 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold uppercase tracking-tight">{service.duration || "Quick Response"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800">
                <Tag className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold uppercase tracking-tight">Fixed Price</span>
              </div>
            </div>

            {/* CTA Box */}
            <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex-1">
                <p className="text-xs font-black uppercase text-zinc-400 tracking-widest mb-1">Total Amount</p>
                <p className="text-4xl font-black text-green-600">{formatCurrency(service.price)}</p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <BookingForm service={service} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}