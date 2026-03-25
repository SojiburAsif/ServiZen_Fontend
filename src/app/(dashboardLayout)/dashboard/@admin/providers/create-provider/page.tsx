import { CreateProviderForm } from "@/components/modules/Provider/createProviderForm";
import { httpClient } from "@/lib/axios/httpClient";

// Define specialty type
interface Specialty {
  id: string;
  name: string;
}

interface SpecialtiesResponse {
  data: Specialty[] | Specialty;
  success: boolean;
}

async function getSpecialties(): Promise<Specialty[]> {
  try {
    // TODO: Update endpoint and response mapping based on actual backend API response shape
    const response = await httpClient.get<SpecialtiesResponse | Specialty[]>("/specialties");
    
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response && typeof response === "object" && "data" in response) {
      const data = (response as SpecialtiesResponse).data;
      return Array.isArray(data) ? data : [data];
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch specialties:", error);
    return [];
  }
}

export const metadata = {
  title: "Create Provider",
  description: "Create a new provider account",
};

export default async function CreateProviderPage() {
  const specialties = await getSpecialties();

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 dark:from-slate-900 dark:to-slate-800">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Provider Management</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Create and manage service provider accounts</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/dashboard/admin/providers"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ← Back to Providers
          </a>
        </div>
      </div>

      <div className="mt-8">
        <CreateProviderForm specialties={specialties} />
      </div>
    </section>
  );
}
