import { CreateProviderForm } from "@/components/modules/Provider/createProviderForm";
import { httpClient } from "@/lib/axios/httpClient";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";
import { Specialty } from "@/services/specialties.service";

interface SpecialtiesResponse {
  data: Specialty[];
  success: boolean;
}

async function getSpecialties(): Promise<Specialty[]> {
  try {
    const response = await httpClient.get<SpecialtiesResponse>("/specialties");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (response as any)?.data || response;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch specialties:", error);
    return [];
  }
}

export const metadata = {
  title: "Create Provider | ServiZen",
  description: "Onboard a new service provider — Admin Only",
};

export default async function CreateProviderPage() {
  const specialties = await getSpecialties();

  return (
    <section className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] px-4 py-8 font-sans text-gray-900 selection:bg-green-300 dark:text-white md:px-6">
      {/* Abstract background letters */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 z-0 select-none transform -rotate-6 text-[300px] font-extrabold leading-none text-green-800/5 dark:text-green-500/5 md:text-[400px]">
        SZ
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/40 shadow-sm backdrop-blur-md dark:border-emerald-500/20 dark:bg-emerald-900/40">
              <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Provider Management
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-emerald-100/70">
                Onboard a new service provider · Admin only
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/providers"
            className="flex w-fit items-center gap-2 rounded-xl border border-white/50 bg-white/50 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={18} />
            Back to Providers
          </Link>
        </div>

        {/* Form */}
        <CreateProviderForm specialties={specialties} />
      </div>
    </section>
  );
}
