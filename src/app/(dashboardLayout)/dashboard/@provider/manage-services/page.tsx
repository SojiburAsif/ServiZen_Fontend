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
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white font-sans selection:bg-green-300">
      {/* Noise Filter Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Service Catalog</h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">Manage and optimize your professional offerings.</p>
        </div>
        
        <ServicesManager context="provider" providerId={providerProfile.id} specialtyOptions={specialtyOptions} />
      </div>
    </div>
  );
}