import Image from "next/image";
import Link from "next/link";

import { ProviderProfileForm } from "@/components/modules/Provider/providerProfileForm";
import { Badge } from "@/components/ui/badge";
import { getProviderSelfProfileServerAction } from "@/services/provider.client";
import {
  Award,
  Briefcase,
  CalendarDays,
  ExternalLink,
  IdCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--";

const formatCurrency = (amount?: number | null) =>
  typeof amount === "number" ? `?${amount.toLocaleString("en-US")}` : "?0";

const formatExperience = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return "0 yrs";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? String(value) : `${numeric} yrs`;
};

const resolveAvatarProps = (url?: string | null) => {
  if (!url) return null;
  const normalized = url.trim();
  const isSvg = normalized.toLowerCase().endsWith(".svg") || normalized.includes("dicebear.com");
  return { src: normalized, unoptimized: isSvg } as const;
};

export default async function ProviderProfilePage() {
  const profileResponse = await getProviderSelfProfileServerAction();
  const provider = profileResponse.success ? profileResponse.data : null;

  if (!provider) {
    return (
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center bg-white px-6 text-center dark:bg-black">
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-lg font-bold uppercase tracking-tight text-zinc-400">Profile Unavailable</p>
        </div>
      </div>
    );
  }

  const specialties = provider.specialties ?? [];
  const stats = [
    { label: "Rating", value: typeof provider.averageRating === "number" ? provider.averageRating.toFixed(1) : "0.0", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Earnings", value: formatCurrency(provider.totalEarned), icon: Wallet, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Balance", value: formatCurrency(provider.walletBalance), icon: Briefcase, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Exp", value: formatExperience(provider.experience), icon: CalendarDays, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  const contactDetails = [
    { icon: Mail, label: "Email", value: provider.email || provider.user?.email || "Not available" },
    { icon: Phone, label: "Phone", value: provider.contactNumber || "Not available" },
    { icon: MapPin, label: "Address", value: provider.address || "Add address in settings" },
  ];

  const complianceDetails = [
    { icon: IdCard, label: "Registration", value: provider.registrationNumber || "Pending" },
    { icon: ShieldCheck, label: "Status", value: provider.user?.status || "ACTIVE" },
    { icon: Award, label: "Joined", value: formatDate(provider.createdAt) },
  ];

  const avatarImage = resolveAvatarProps(provider.profilePhoto);

  return (
    <main className="min-h-screen w-full bg-white font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        
        {/* HEADER SECTION - B&W Glass */}
        <section className="relative mb-12 overflow-hidden rounded-[3rem] border border-zinc-100 bg-zinc-50/50 p-8 dark:border-zinc-800/50 dark:bg-zinc-900/20 lg:flex lg:items-center lg:gap-10 lg:p-12">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-emerald-500/5 blur-3xl" />
          
          <div className="relative mx-auto mb-8 h-40 w-40 shrink-0 lg:mx-0 lg:mb-0">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-white bg-zinc-100 shadow-2xl dark:border-zinc-800 dark:bg-zinc-800">
              {avatarImage ? (
                <Image
                  src={avatarImage.src}
                  alt={provider.name || "Provider photo"}
                  fill
                  sizes="160px"
                  className="object-cover"
                  unoptimized={avatarImage.unoptimized}
                />
              ) : (
                <User className="size-20 text-zinc-300" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-lg">
              <ShieldCheck className="size-5" />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              <Zap className="size-3 fill-emerald-500" /> Verified Professional
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter lg:text-6xl dark:text-white">
              {provider.name || provider.user?.name || "Expert Provider"}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
              {provider.bio || "Excellence in service, delivering professional results with precision."}
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                REG: {provider.registrationNumber || "PENDING"}
              </div>
              <Link
                href="#provider-profile-editor"
                className="group inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Edit Account
                <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* STATS GRID */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="group rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm transition-all hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-50">
              <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110", bg, color)}>
                <Icon className="size-5" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{label}</p>
              <p className="mt-1 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* DETAILS GRID */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* CONTACT INFO */}
          <div className="flex flex-col rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 p-8 dark:border-zinc-800 dark:bg-zinc-900/20">
            <h3 className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              <Mail className="size-4" /> Reachable At
            </h3>
            <div className="space-y-8">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                    <Icon className="size-5 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
                    <p className="mt-1 truncate text-base font-bold text-zinc-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLIANCE INFO */}
          <div className="flex flex-col rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 p-8 dark:border-zinc-800 dark:bg-zinc-900/20">
            <h3 className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              <ShieldCheck className="size-4" /> Compliance
            </h3>
            <div className="space-y-8">
              {complianceDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                    <Icon className="size-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
                    <p className={cn("mt-1 text-base font-bold", label === "Status" ? "text-emerald-600" : "text-zinc-900 dark:text-white")}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BIOGRAPHY */}
          <div className="flex flex-col rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 p-8 dark:border-zinc-800 dark:bg-zinc-900/20">
            <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              <User className="size-4" /> About Me
            </h3>
            <div className="flex-1 overflow-y-auto pr-2">
              <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
                {provider.bio || "Professional summary not provided."}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Link href="#provider-profile-editor" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 transition-colors">
                Update Biography ?
              </Link>
            </div>
          </div>
        </div>

        {/* SPECIALTIES SECTION */}
        <div className="mt-12 overflow-hidden rounded-[3rem] border border-zinc-100 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-10 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Expertise</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Validated Skills &amp; Services</p>
            </div>
            <div className="rounded-2xl bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase text-black">
              {specialties.length} Modules
            </div>
          </div>
          
          {specialties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {specialties.map((item, index) => (
                <div key={item.specialty?.id ?? index} className="group flex items-center gap-5 rounded-[2rem] border border-zinc-50 bg-zinc-50/50 p-6 transition-all hover:border-zinc-900 dark:border-zinc-900 dark:bg-zinc-900/40 dark:hover:border-zinc-50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-zinc-900 text-white transition-transform group-hover:-rotate-6 dark:bg-zinc-50 dark:text-zinc-950">
                    <Sparkles className="size-6" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tight text-zinc-900 dark:text-white">{item.specialty?.title || "Professional Skill"}</p>
                    <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {item.specialty?.description || "High-quality professional service delivery."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 italic">No specialties listed yet.</p>
            </div>
          )}
        </div>

        {/* EDITOR SECTION */}
        <div id="provider-profile-editor" className="mt-12 rounded-[3.5rem] border border-zinc-900 bg-white p-10 dark:border-zinc-100 dark:bg-zinc-950">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
              <IdCard className="size-7" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Edit Profile Details</h2>
            <div className="mt-2 h-1 w-12 bg-emerald-500 rounded-full" />
          </div>
          <ProviderProfileForm initialData={provider} />
        </div>
      </div>
    </main>
  );
}
