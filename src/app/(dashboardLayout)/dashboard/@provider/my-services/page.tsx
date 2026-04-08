import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles, Wallet, Layers } from "lucide-react";

import { ServicesManager } from "@/components/modules/services/services-manager";
import type { SpecialtyOption } from "@/components/modules/services/services-manager";
import { ProviderProfileRequired } from "@/components/modules/services/provider-profile-required";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProviderSelfProfileServerAction } from "@/services/provider.client";

const formatCurrency = (value?: number | null) =>
  Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value ?? 0);

export default async function ProviderMyServicesPage() {
  const profileResponse = await getProviderSelfProfileServerAction();

  if (!profileResponse.success || !profileResponse.data) {
    return (
      <div className="p-6">
        <ProviderProfileRequired />
      </div>
    );
  }

  const providerProfile = profileResponse.data;

  const specialtyOptions: SpecialtyOption[] = (providerProfile.specialties ?? [])
    .map((item) => item.specialty)
    .filter((specialty): specialty is NonNullable<typeof specialty> => Boolean(specialty?.id))
    .map((specialty) => ({
      id: specialty.id,
      title: specialty.title ?? "Untitled specialty",
    }));

  const specialtyCount = specialtyOptions.length;

  return (
    <div className="max-w-7xl mx-auto space-y-12 p-6 md:p-12 font-sans bg-white dark:bg-zinc-950 min-h-screen">
      
      {/* --- Refined Minimalist Header --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50/50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900/50">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Provider Workspace
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
              My Services
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl font-medium">
              Manage your service catalog, adjust pricing, and track your performance from one dashboard.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-2xl h-12 border-zinc-200 px-5 text-xs font-bold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
            <Link href="/dashboard/manage-services" className="gap-2">
              Advanced Manager <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
          <Button asChild className="rounded-2xl h-12 bg-zinc-900 px-6 text-xs font-black text-white shadow-2xl transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <Link href="/dashboard/create-service" className="gap-2">
              <Plus className="h-4 w-4" /> New Service
            </Link>
          </Button>
        </div>
      </header>

      {/* --- High-Contrast Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group p-6 rounded-[2rem] bg-white border border-zinc-100 flex items-center justify-between transition-all hover:border-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-white">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-lg dark:bg-white dark:text-black">
              <Layers size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Active Categories</p>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">{specialtyCount} Specialties</h3>
            </div>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="group p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center gap-5 transition-all hover:shadow-xl dark:bg-white dark:border-zinc-100">
          <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white dark:bg-zinc-900 dark:text-white">
            <Wallet size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Revenue</p>
            <h3 className="text-lg font-black text-white dark:text-zinc-900">
              {formatCurrency(providerProfile.totalEarned ?? providerProfile.walletBalance ?? 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* --- Structured Categories Bar --- */}
      <div className="p-2 flex flex-col gap-4">
        <h5 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
           <div className="h-1 w-8 bg-emerald-500 rounded-full" />
           Industry Focus
        </h5>
        <div className="flex flex-wrap gap-3">
          {specialtyOptions.map((s) => (
            <Badge key={s.id} variant="secondary" className="rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-900 font-bold px-5 py-2 text-xs transition-all hover:bg-zinc-900 hover:text-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-white dark:hover:text-black">
              {s.title}
            </Badge>
          ))}
          {specialtyCount === 0 && (
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 italic">
              <Layers className="h-4 w-4" />
              Initial setup required: No specialties linked.
            </div>
          )}
        </div>
      </div>

      {/* --- Management Matrix --- */}
      <div className="pt-8 border-t border-zinc-50 dark:border-zinc-900">
        <div className="mb-8">
           <h4 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Service Matrix</h4>
           <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">Direct control over deployment state and pricing modules.</p>
        </div>
        <div className="bg-zinc-50/50 rounded-[3rem] p-4 dark:bg-zinc-900/30">
          <ServicesManager context="provider" providerId={providerProfile.id} specialtyOptions={specialtyOptions} />
        </div>
      </div>
    </div>
  );
}
   