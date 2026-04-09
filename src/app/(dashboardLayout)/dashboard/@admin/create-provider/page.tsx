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
    <section className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-zinc-50 px-4 py-8 font-sans text-green-400 selection:bg-zinc-200 dark:bg-black dark:text-white md:px-6">
      {/* Abstract background letters */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 z-0 select-none -rotate-6 text-[300px] font-extrabold leading-none text-green-400  dark:text-green-400  md:text-[400px]">
        SZ
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-3xl space-y-10">
        {/* Page Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Users className="h-7 w-7 text-zinc-900 dark:text-zinc-100" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Onboard Provider
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Registry Access Level: Administrator
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/providers"
            className="group flex w-fit items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-zinc-900 shadow-sm transition-all hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-white dark:hover:text-black"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </Link>
        </div>

        {/* Form Container */}
        <div className="relative">
          <CreateProviderForm specialties={specialties} />
        </div>
      </div>
    </section>
  );
}
