import { CreateProviderForm } from "@/components/modules/Provider/createProviderForm";
import { httpClient } from "@/lib/axios/httpClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Specialty {
  id: string;
  name: string;
}

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
  title: "Create Provider | ServZEN",
  description: "Onboard a new service provider",
};

export default async function CreateProviderPage() {
  const specialties = await getSpecialties();

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Provider Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Create and configure new service provider accounts
            </p>
          </div>
          <Link
            href="/dashboard/admin/providers"
            className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={18} />
            Back to List
          </Link>
        </div>

        <div className="mt-4">
          <CreateProviderForm specialties={specialties} />
        </div>
      </div>
    </section>
  );
}