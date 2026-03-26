import { PublicServicesGrid } from "@/components/modules/services/public-services-grid";
import type { SpecialtyOption } from "@/components/modules/services/services-manager";
import { getAllServices } from "@/services/services.service";
import { getAllSpecialties } from "@/services/specialties.service";

export default async function ServicesPage() {
  const [servicesResponse, specialtiesResponse] = await Promise.allSettled([
    getAllServices({ page: 1, limit: 12 }),
    getAllSpecialties(),
  ]);

  const initialServices =
    servicesResponse.status === "fulfilled" && Array.isArray(servicesResponse.value.data)
      ? servicesResponse.value.data
      : [];
  const initialMeta = servicesResponse.status === "fulfilled" ? servicesResponse.value.meta : null;

  const specialties: SpecialtyOption[] =
    specialtiesResponse.status === "fulfilled"
      ? (specialtiesResponse.value.data ?? []).map((specialty) => ({
          id: specialty.id,
          title: specialty.title ?? "Untitled specialty",
        }))
      : [];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-0">
      <PublicServicesGrid initialServices={initialServices} initialMeta={initialMeta} specialties={specialties} />
    </div>
  );
}
