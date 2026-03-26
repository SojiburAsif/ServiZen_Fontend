import { ServicesManager } from "@/components/modules/services/services-manager";
import type { SpecialtyOption } from "@/components/modules/services/services-manager";
import { ProviderProfileRequired } from "@/components/modules/services/provider-profile-required";
import { getProviderSelfProfile } from "@/services/provider.service";

export default async function ManageServicesPage() {
  const providerProfile = await getProviderSelfProfile();

  if (!providerProfile) {
    return (
      <div className="space-y-6 p-6">
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
    <div className="space-y-8 p-6">
      <ServicesManager context="provider" providerId={providerProfile.id} specialtyOptions={specialtyOptions} />
    </div>
  );
}
