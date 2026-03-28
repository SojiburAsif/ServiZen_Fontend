/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicServicesGrid } from "@/components/modules/services/public-services-grid";
import { getAllServices } from "@/services/services.service";
import { getAllSpecialties } from "@/services/specialties.service";

export default async function ServicesPage() {
  const [servicesResponse, specialtiesResponse] = await Promise.allSettled([
    getAllServices({ page: 1, limit: 12 }),
    getAllSpecialties(),
  ]);

  const initialServices =
    servicesResponse.status === "fulfilled" && Array.isArray(servicesResponse.value?.data)
      ? servicesResponse.value.data
      : [];

  const initialMeta =
    servicesResponse.status === "fulfilled" ? servicesResponse.value?.meta : null;

  const specialties =
    specialtiesResponse.status === "fulfilled"
      ? (specialtiesResponse.value?.data ?? []).map((specialty: any) => ({
          id: specialty.id,
          title: specialty.title ?? "Untitled specialty",
        }))
      : [];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0A0A0A] dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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