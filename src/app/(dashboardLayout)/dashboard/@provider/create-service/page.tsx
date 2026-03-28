import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { CreateServiceForm } from "@/components/modules/services/create-service-form";
import { getProviderSelfProfile } from "@/services/provider.service";

const EmptyProviderState = () => (
  <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-amber-200 bg-amber-50/80 p-10 text-center shadow-sm dark:border-amber-500/30 dark:bg-amber-950/40">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
      <AlertTriangle className="h-8 w-8" />
    </div>
    <h1 className="mt-6 text-2xl font-bold text-amber-900 dark:text-amber-50">Complete provider profile first</h1>
    <p className="mt-3 text-sm text-amber-800/80 dark:text-amber-100/70">
      We could not find an active provider profile tied to your account. Finish the onboarding form and attach at least
      one specialty to start publishing services.
    </p>
    <div className="mt-6 inline-flex rounded-full border border-amber-400 bg-white/70 px-6 py-2 text-sm font-semibold text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-transparent dark:text-amber-200">
      <Link href="/dashboard/provider-profile">Go to Provider Settings</Link>
    </div>
  </div>
);

export default async function CreateServicespage() {
  const providerProfile = await getProviderSelfProfile();

  if (!providerProfile) {
    return (
      <div className="space-y-6 p-6">
        <EmptyProviderState />
      </div>
    );
  }

  const hasSpecialties = providerProfile.specialties && providerProfile.specialties.length > 0;

  if (!hasSpecialties) {
    return (
      <div className="space-y-6 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-amber-200 bg-amber-50/80 p-10 text-center shadow-sm dark:border-amber-500/30 dark:bg-amber-950/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-amber-900 dark:text-amber-50">Add a specialty first</h1>
          <p className="mt-3 text-sm text-amber-800/80 dark:text-amber-100/70">
            You need to add at least one specialty to your profile before you can create services. Visit your provider settings to add specialties.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-amber-400 bg-white/70 px-6 py-2 text-sm font-semibold text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-transparent dark:text-amber-200">
            <Link href="/dashboard/specialties">Go to Specialty Settings</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <CreateServiceForm specialties={providerProfile.specialties!} />
    </div>
  );
}
