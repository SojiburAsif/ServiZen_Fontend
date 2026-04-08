import { ServicesManager } from "@/components/modules/services/services-manager";
import type { SpecialtyOption } from "@/components/modules/services/services-manager";
import { ProviderProfileRequired } from "@/components/modules/services/provider-profile-required";
import { getProviderSelfProfileServerAction } from "@/services/provider.client";

export default async function ManageServicesPage() {
  const profileResponse = await getProviderSelfProfileServerAction();
  const providerProfile = profileResponse.success ? profileResponse.data : null;

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

  return (
    <div className="mx-auto max-w-7xl space-y-8 mt-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Service Catalog</h1>
        <p className="font-medium text-zinc-600 dark:text-zinc-400">Manage and optimize your professional offerings.</p>
      </div>
      
      <ServicesManager context="provider" providerId={providerProfile.id} specialtyOptions={specialtyOptions} />
    </div>
  );
}