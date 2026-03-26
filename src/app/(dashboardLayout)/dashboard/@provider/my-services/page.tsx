import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles, Wallet, Layers } from "lucide-react";

import { ServicesManager } from "@/components/modules/services/services-manager";
import type { SpecialtyOption } from "@/components/modules/services/services-manager";
import { ProviderProfileRequired } from "@/components/modules/services/provider-profile-required";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProviderSelfProfile } from "@/services/provider.service";

const formatCurrency = (value?: number | null) =>
  Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value ?? 0);

export default async function ProviderMyServicesPage() {
  const providerProfile = await getProviderSelfProfile();

  if (!providerProfile) {
    return (
      <div className="p-6">
        <ProviderProfileRequired />
      </div>
    );
  }

  const specialtyOptions: SpecialtyOption[] = (providerProfile.specialties ?? [])
    .map((item) => item.specialty)
    .filter((specialty): specialty is NonNullable<typeof specialty> => Boolean(specialty?.id))
    .map((specialty) => ({
      id: specialty.id,
      title: specialty.title ?? "Untitled specialty",
    }));

  const specialtyCount = specialtyOptions.length;

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 md:p-10 font-sans">
      
      {/* --- Minimal Modern Header --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
            Provider Workspace
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">My Services</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-base">
            Manage your service catalog, adjust pricing, and track your performance from one dashboard.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800">
            <Link href="/dashboard/manage-services" className="gap-2">
              Advanced Manager <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
            <Link href="/dashboard/create-service" className="gap-2">
              <Plus className="h-4 w-4" /> New Service
            </Link>
          </Button>
        </div>
      </header>

      {/* --- Snapshot Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group p-6 rounded-[24px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-5 transition-all hover:shadow-md">
          <div className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm text-emerald-600">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Linked Specialties</p>
            <h3 className="text-2xl font-bold">{specialtyCount} Categories</h3>
          </div>
        </div>

        <div className="group p-6 rounded-[24px] bg-zinc-900 dark:bg-emerald-950 border border-zinc-800 flex items-center gap-5 transition-all hover:shadow-md">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-white">
              {formatCurrency(providerProfile.totalEarned ?? providerProfile.walletBalance ?? 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* --- Categories Badge Section --- */}
      <div className="py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
        <span className="text-sm font-semibold text-zinc-400">Categories:</span>
        <div className="flex flex-wrap gap-2">
          {specialtyOptions.map((s) => (
            <Badge key={s.id} variant="secondary" className="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium px-4">
              {s.title}
            </Badge>
          ))}
          {specialtyCount === 0 && <span className="text-sm text-zinc-400">No specialties linked.</span>}
        </div>
      </div>

      {/* --- Main Manager Component --- */}
      <div className="pt-4">
        <ServicesManager context="provider" providerId={providerProfile.id} specialtyOptions={specialtyOptions} />
      </div>
    </div>
  );
}