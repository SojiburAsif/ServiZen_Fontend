import { getUserInfo } from "@/services/auth.service";
import { User, Mail, ShieldCheck, BadgeCheck, XCircle, Settings, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default async function MyProfilePage() {
  const user = await getUserInfo();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 transition-colors duration-500 dark:bg-slate-950">
      
      {/* Background Decorative Large Text "S Z" */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[300px] font-bold leading-none text-emerald-800/5 transition-all dark:text-emerald-500/5 md:text-[500px]">
        S Z
      </div>

      {/* Decorative Gradients */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-600/5"></div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Show alert if user is not verified */}
        {!user?.emailVerified && (
          <Alert className="mb-8 border-rose-200 bg-rose-50/80 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100 shadow-lg">
            <Info className="mt-1 text-rose-500" />
            <AlertTitle>Email Not Verified</AlertTitle>
            <AlertDescription>
              Please verify your email address to unlock all features. Check your inbox for a verification link or request a new one.
            </AlertDescription>
            <div className="col-start-2 mt-2">
              <Button variant="outline" className="border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-200">Resend Verification Email</Button>
            </div>
          </Alert>
        )}
        <div className="overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white/80 shadow-2xl backdrop-blur-xl transition-all dark:border-emerald-900/30 dark:bg-slate-950/80">
          
          {/* Header Section with Avatar */}
          <div className="relative h-32 bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-900 dark:to-emerald-700">
            <div className="absolute -bottom-12 left-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white p-1 shadow-xl dark:bg-slate-900">
                <div className="flex h-full w-full items-center justify-center rounded-[1.2rem] bg-emerald-100 text-3xl font-black text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-10 pt-16">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {user?.name || "User Profile"}
                </h1>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">@{user?.role?.toLowerCase() || "member"}</p>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:border-emerald-900/50 dark:bg-emerald-950/50">
                <Settings size={20} />
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              
              {/* Name Card */}
              <div className="group rounded-2xl border border-emerald-50 bg-emerald-50/30 p-4 transition-all hover:border-emerald-200 hover:bg-white dark:border-emerald-900/20 dark:bg-emerald-900/10 dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-slate-800">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.name || "Not Set"}</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group rounded-2xl border border-emerald-50 bg-emerald-50/30 p-4 transition-all hover:border-emerald-200 hover:bg-white dark:border-emerald-900/20 dark:bg-emerald-900/10 dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-slate-800">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{user?.email || "No Email"}</p>
                  </div>
                </div>
              </div>

              {/* Role Card */}
              <div className="group rounded-2xl border border-emerald-50 bg-emerald-50/30 p-4 transition-all hover:border-emerald-200 hover:bg-white dark:border-emerald-900/20 dark:bg-emerald-900/10 dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-slate-800">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Role</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.role || "USER"}</p>
                  </div>
                </div>
              </div>

              {/* Verification Status Card */}
              <div className="group rounded-2xl border border-emerald-50 bg-emerald-50/30 p-4 transition-all hover:border-emerald-200 hover:bg-white dark:border-emerald-900/20 dark:bg-emerald-900/10 dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
                    {user?.emailVerified ? (
                      <BadgeCheck size={20} className="text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                    <p className={`text-sm font-bold ${user?.emailVerified ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {user?.emailVerified ? "Verified User" : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Edit Button */}
            <button className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600">
              Edit Profile Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}