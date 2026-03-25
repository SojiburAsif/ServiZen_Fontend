import { getUserInfo } from "@/services/auth.service";

export default async function MyProfilePage() {
  const user = await getUserInfo();

  return (
    <section className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your account details</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name || "User"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user?.email || "No email available"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user?.role || "USER"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email Verified</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user?.emailVerified ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
