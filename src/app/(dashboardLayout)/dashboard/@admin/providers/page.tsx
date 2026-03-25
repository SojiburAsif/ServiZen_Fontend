import Link from "next/link";

export const metadata = {
  title: "Providers Management",
  description: "Manage service providers",
};

export default function AdminProvidersPage() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Providers Management</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage and create service provider accounts
        </p>
      </div>

      <div className="inline-flex">
        <Link
          href="/dashboard/admin/providers/create-provider"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Provider
        </Link>
      </div>

      {/* Provider list will be added here */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-400">Provider list coming soon...</p>
      </div>
    </section>
  );
}
