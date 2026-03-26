/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PublicServicesGrid } from "@/components/modules/services/public-services-grid";
import type { SpecialtyOption } from "@/components/modules/services/services-manager";
import { getAllServices } from "@/services/services.service";
import { getAllSpecialties } from "@/services/specialties.service";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [initialServices, setInitialServices] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialMeta, setInitialMeta] = useState<any>(null);
  const [specialties, setSpecialties] = useState<SpecialtyOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, specialtiesResponse] = await Promise.allSettled([
          getAllServices({ page: 1, limit: 12 }),
          getAllSpecialties(),
        ]);

        const services =
          servicesResponse.status === "fulfilled" && Array.isArray(servicesResponse.value.data)
            ? servicesResponse.value.data
            : [];

        const meta =
          servicesResponse.status === "fulfilled" ? servicesResponse.value.meta : null;

        const specs: SpecialtyOption[] =
          specialtiesResponse.status === "fulfilled"
            ? (specialtiesResponse.value.data ?? []).map((specialty) => ({
                id: specialty.id,
                title: specialty.title ?? "Untitled specialty",
              }))
            : [];

        setInitialServices(services);
        setInitialMeta(meta);
        setSpecialties(specs);
      } catch (error) {
        console.error("Error fetching services data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] text-gray-900 selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white">
      <div className="pointer-events-none absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-lime-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/40 bg-white/55 px-6 py-10 shadow-[0_20px_80px_rgba(16,185,129,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-black/20 sm:px-10">
          <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[180px] font-bold leading-none text-green-800/5 dark:text-green-500/5 md:text-[280px] lg:text-[400px]">
            S Z
          </div>


        </div>

        <PublicServicesGrid
          initialServices={initialServices}
          initialMeta={initialMeta}
          specialties={specialties}
        />
      </div>
    </div>
  );
}
