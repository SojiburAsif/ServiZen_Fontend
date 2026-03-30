/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicServicesGrid } from "@/components/modules/services/public-services-grid";
import { getAllServicesServerAction } from "@/services/services.service";
import { getAllSpecialtiesServerAction } from "@/services/specialties.service";

export default async function ServicesPage() {
  const [servicesResponse, specialtiesResponse] = await Promise.allSettled([
    getAllServicesServerAction({ page: 1, limit: 12 }),
    getAllSpecialtiesServerAction(),
  ]);

  const initialServices =
    servicesResponse.status === "fulfilled" && servicesResponse.value.success && Array.isArray(servicesResponse.value.data)
      ? servicesResponse.value.data
      : [];

  const initialMeta =
    servicesResponse.status === "fulfilled" && servicesResponse.value.success
      ? servicesResponse.value.meta
      : { page: 1, limit: 12, total: 0, totalPages: 0 };

  const specialties =
    specialtiesResponse.status === "fulfilled" && specialtiesResponse.value.success
      ? (specialtiesResponse.value.data ?? []).map((specialty: any) => ({
          id: specialty.id,
          title: specialty.title ?? "Untitled specialty",
        }))
      : [];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white font-sans selection:bg-green-300 transition-colors duration-300 min-h-screen">
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* Decorative Background Text */}
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none select-none pointer-events-none transform -rotate-6">
        S Z
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Included <span className="text-green-600">Services</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Find the best professionals for your needs.
          </p>
        </header>

        <PublicServicesGrid
          initialServices={initialServices}
          initialMeta={initialMeta}
          specialties={specialties}
        />
      </div>
    </div>
  );
}