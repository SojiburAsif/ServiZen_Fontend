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
} from "lucide-react";

import { getServiceById } from "@/services/services.service";
import { getUserInfo } from "@/services/auth.service";
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
  let user: any = null;
  try {
    const [response, userInfo] = await Promise.all([
      getServiceById(serviceId),
      getUserInfo()
    ]);
    service = response?.data ?? null;
    user = userInfo;
  } catch (error) {
    console.error(error);
  }

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-emerald-500/30">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-emerald-900/10 blur-[100px]" />
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
          {/* Left Side: Images & Quick Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 shadow-2xl">
              <img
                src={service.imageUrl || "https://via.placeholder.com/800"}
                alt={service.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/20">
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
                <div key={i} className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-5 text-center transition-all hover:border-emerald-500/30">
                  <item.icon className="mx-auto h-6 w-6 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold block text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Content & Booking Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black text-black uppercase">
                  <Star className="h-3 w-3 fill-black" />
                  {service.provider?.averageRating?.toFixed(1) || "5.0"}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
                  {service.specialty?.title || "Premium Category"}
                </span>
              </div>

              <h1 className="text-5xl font-black tracking-tighter sm:text-6xl text-gray-900 dark:text-white italic">
                {service.name}
              </h1>

              <p className="text-lg text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                {service.description || "Top-tier service provider in Dinajpur with a focus on quality."}
              </p>
            </div>

            {/* Provider Card */}
            <div className="group flex items-center gap-4 p-5 rounded-[2rem] bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
              <Avatar className="h-16 w-16 ring-4 ring-emerald-500/10">
                <AvatarImage src={service.provider?.profilePhoto} />
                <AvatarFallback className="bg-emerald-500 text-black font-black text-xl italic">
                  {service.provider?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-gray-900 dark:text-zinc-100">{service.provider?.name}</h4>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs font-medium text-gray-500">{service.provider?.contactNumber}</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="space-y-6 rounded-[2.5rem] border border-gray-200 dark:border-zinc-800 bg-emerald-500/5 p-8 backdrop-blur-xl">
              <div>
                <p className="text-xs font-black uppercase text-gray-500 tracking-widest mb-2">Service Fee</p>
                <div className="flex items-end justify-between">
                  <p className="text-6xl font-black text-emerald-500 tracking-tighter">
                    {formatCurrency(service.price)}
                  </p>
                  <Tag className="h-10 w-10 text-emerald-500/20" />
                </div>
              </div>
              
              <div className="pt-2">
                <BookingForm service={service} user={user} />
              </div>

              <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Safe & Verified • Instant Confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}