import Image from "next/image";
import Link from "next/link";

import { ProviderProfileForm } from "@/components/modules/Provider/providerProfileForm";
import { Badge } from "@/components/ui/badge";
import { getProviderSelfProfile } from "@/services/provider.service";
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
} from "lucide-react";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--";

const formatCurrency = (amount?: number | null) =>
  typeof amount === "number" ? `Tk ${amount.toLocaleString("en-US")}` : "Tk 0";

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
  const provider = await getProviderSelfProfile();

  if (!provider) {
    return (
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center bg-white px-6 text-center dark:bg-black">
        <div className="rounded-[40px] border border-slate-200 bg-white/50 p-12 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
          <p className="text-lg font-medium text-slate-500 dark:text-zinc-400">Provider profile data is unavailable.</p>
        </div>
      </div>
    );
  }

  const specialties = provider.specialties ?? [];
  const stats = [
    { label: "Rating", value: typeof provider.averageRating === "number" ? provider.averageRating.toFixed(1) : "0.0", icon: Star, color: "text-amber-500" },
    { label: "Total Earned", value: formatCurrency(provider.totalEarned), icon: Wallet, color: "text-emerald-500" },
    { label: "Balance", value: formatCurrency(provider.walletBalance), icon: Briefcase, color: "text-blue-500" },
    { label: "Experience", value: formatExperience(provider.experience), icon: CalendarDays, color: "text-purple-500" },
  ];

  const contactDetails = [
    { icon: Mail, label: "Email", value: provider.email || provider.user?.email || "Not available" },
    { icon: Phone, label: "Phone", value: provider.contactNumber || "Not available" },
    { icon: MapPin, label: "Address", value: provider.address || "Add address in settings" },
  ];

  const complianceDetails = [
    { icon: IdCard, label: "Registration", value: provider.registrationNumber || "Pending" },
    { icon: ShieldCheck, label: "Status", value: provider.user?.status || "ACTIVE" },
    { icon: Award, label: "Member Since", value: formatDate(provider.createdAt) },
  ];

  const avatarImage = resolveAvatarProps(provider.profilePhoto);

  return (
    <main className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-linear-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] font-sans text-gray-900 selection:bg-green-300 dark:from-[#000000] dark:via-[#051505] dark:to-[#002200] dark:text-white">
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-green-400/20 blur-[120px] dark:bg-green-900/20" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 lg:py-20">
        <section className="relative mb-12 overflow-hidden rounded-[40px] border border-white/40 bg-white/60 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/50 lg:flex lg:items-center lg:gap-8 lg:p-10">
          <div className="relative mx-auto mb-6 h-32 w-32 shrink-0 lg:mx-0">
            <div className="absolute -inset-3 rounded-full bg-linear-to-tr from-green-500 to-emerald-400 opacity-30 blur-2xl" />
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-800">
              {avatarImage ? (
                <Image
                  src={avatarImage.src}
                  alt={provider.name || "Provider photo"}
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized={avatarImage.unoptimized}
                />
              ) : (
                <span className="text-4xl font-black text-green-600">{provider.name?.[0] || "P"}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Sparkles className="size-3" /> Verified Provider
            </p>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">{provider.name || provider.user?.name || "Provider"}</h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 opacity-80 dark:text-slate-200">
              {provider.bio || "Crafting professional experiences with excellence and precision."}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-900 lg:justify-start dark:text-white">
              <span className="rounded-full border border-black/10 bg-white/60 px-4 py-1 font-semibold tracking-wide dark:border-white/10 dark:bg-white/10">
                ID: {provider.registrationNumber || "PENDING"}
              </span>
              <Link
                href="#provider-profile-editor"
                className="inline-flex items-center gap-1 rounded-full border border-black/10 px-4 py-1 text-xs font-black uppercase tracking-widest text-slate-700 transition-colors hover:bg-white dark:border-white/10 dark:text-white dark:hover:bg-white/20"
              >
                Edit Profile
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-[28px] border border-white/60 bg-white/40 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/40">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner dark:bg-zinc-800 ${color}`}>
                <Icon className="size-5" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{label}</p>
              <p className="mt-1 text-3xl font-black tracking-tight">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-[32px] border border-white/50 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 dark:text-green-400">Contact</p>
            <div className="mt-6 space-y-6 text-sm">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-800">
                    <Icon className="size-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{label}</p>
                    <p className="mt-1 font-semibold text-base text-slate-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/50 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 dark:text-green-400">Compliance</p>
            <div className="mt-6 space-y-6 text-sm">
              {complianceDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-800">
                    <Icon className="size-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{label}</p>
                    <p className="mt-1 font-semibold text-base text-slate-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/50 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 dark:text-green-400">Bio</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {provider.bio || "No biography has been added yet."}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[40px] border border-white/50 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 dark:text-green-400">Professional Specialties</p>
            <Badge variant="outline" className="border-white/40 text-slate-600 dark:border-white/10 dark:text-slate-200">
              {specialties.length} skills
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {specialties.length > 0 ? (
              specialties.map((item, index) => (
                <div key={item.specialty?.id ?? index} className="flex items-center gap-4 rounded-3xl border border-white/50 bg-white/70 p-5 transition-colors hover:bg-green-50 dark:border-white/5 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold">{item.specialty?.title || "Specialty"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.specialty?.description || "Expert level service"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm italic text-slate-500 dark:text-slate-400">No specialties listed yet.</p>
            )}
          </div>
        </div>

        <div
          id="provider-profile-editor"
          className="mt-10 rounded-[40px] border border-white/50 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/50"
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 dark:text-green-400">Update Provider Profile</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Refresh your public info so clients always see accurate details.</p>
            </div>
            <Link href="#" className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-500 dark:text-emerald-300">
              Back to top
            </Link>
          </div>
          <ProviderProfileForm initialData={provider} />
        </div>
      </div>
    </main>
  );
}