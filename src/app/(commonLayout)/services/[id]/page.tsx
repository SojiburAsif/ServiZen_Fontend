/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  Star,
  Tag,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { getServiceById } from "@/services/services.service";
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
  } catch (error) {
    console.error(error);
  }

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-emerald-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-600/10 dark:bg-emerald-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-emerald-900/10 dark:bg-emerald-900/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </Link>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 shadow-2xl">
              <img
                src={service.imageUrl || "https://via.placeholder.com/800"}
                alt={service.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/60 dark:bg-black/60 px-4 py-2 text-xs font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/20">
                  <BadgeCheck className="h-4 w-4" />
                  Verified Provider
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock3, label: service.duration || "Flexible", sub: "Duration" },
                { icon: ShieldCheck, label: "Secure", sub: "Payment" },
                { icon: MapPin, label: "Dinajpur", sub: "Available In" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-4 text-center">
                  <item.icon className="mx-auto h-5 w-5 text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold block text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-zinc-500 font-semibold">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-black uppercase">
                  <Star className="h-3 w-3 fill-black" />
                  {service.provider?.averageRating?.toFixed(1) || "5.0"}
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-zinc-500 uppercase tracking-widest">
                  {service.specialty?.title || "Premium Category"}
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 dark:text-white">
                {service.name}
              </h1>

              <p className="text-lg text-gray-700 dark:text-zinc-400 leading-relaxed font-medium">
                {service.description || "Top-tier service provider in Dinajpur with a focus on quality."}
              </p>
            </div>

            <div className="group flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors hover:border-emerald-500/30">
              <Avatar className="h-14 w-14 ring-2 ring-emerald-500/20">
                <AvatarImage src={service.provider?.profilePhoto} />
                <AvatarFallback className="bg-emerald-500 text-black font-semibold">
                  {service.provider?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-semibold text-gray-900 dark:text-zinc-200">{service.provider?.name}</h4>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-500">{service.provider?.contactNumber}</p>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/80 p-8 backdrop-blur-xl">
              <div className="">
                <p className="text-xs font-semibold uppercase text-gray-600 dark:text-zinc-500 tracking-widest mb-1">Service Fee</p>
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-semibold text-emerald-500">
                    {formatCurrency(service.price)}
                  </p>
                  <Tag className="h-8 w-8 text-gray-300 dark:text-zinc-800" />
                </div>
              </div>
              
              <div className="pt-2  ">
                <BookingForm service={service} />
              </div>

              <p className="text-center text-[10px] text-gray-600 dark:text-zinc-500 font-medium">
                No hidden charges • 100% Satisfaction Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}