import { Role } from "@/app/constants/role";
import { AppSidebar } from "@/components/shared/dashboard/app-sidebar";
import { jwtUtils } from "@/lib/jwtUtils";
import { getUserInfo } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";



export default async function DashboardLayout({
  admin,
  provider,
  clinte,
}: {
  admin: React.ReactNode;
  provider: React.ReactNode;
  clinte: React.ReactNode;
}) {
  const user = await getUserInfo();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const decodedToken = accessToken ? jwtUtils.decodedToken(accessToken) : null;
  const tokenRole = String(decodedToken?.role || "").toUpperCase();

  if (!user && !decodedToken) {
    redirect("/login");
  }

  const rawRole = String(user?.role || tokenRole || "").toUpperCase();
  const userRole = rawRole === "ADMIN"
    ? Role.ADMIN
    : rawRole === "PROVIDER"
      ? Role.PROVIDER
      : Role.CLIENT;

  return (
    <SidebarProvider>
   
      <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-black transition-colors duration-300">

        <AppSidebar user={{ role: userRole }} />

        <SidebarInset className="bg-transparent">
          {/* --- Minimalist Header --- */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white/80 dark:bg-black/80 px-6 backdrop-blur-md transition-all dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all rounded-lg p-2" />
              <Separator orientation="vertical" className="h-6 bg-slate-200 dark:bg-zinc-800" />

              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-[11px] font-bold text-slate-500 hover:text-green-600 uppercase tracking-widest transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-300 dark:text-zinc-700" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[11px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest">
                      {userRole} Portal
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>


          </header>

          {/* --- Dynamic Content Body --- */}
          <main className="flex-1 overflow-y-auto relative">



            <div className="mx-auto w-full ">
              {userRole === Role.ADMIN && (
                <div className="pt-2">{admin}</div>
              )}

              {userRole === Role.CLIENT && (
                <div className="pt-2">{clinte}</div>
              )}

              {userRole === Role.PROVIDER && (
                <div className="pt-2">{provider}</div>
              )}
            </div>
            
          </main>

          {/* --- Minimalist Footer --- */}
          <footer className="px-10 py-6 border-t border-slate-100 dark:border-zinc-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-[2px]">
              &copy; 2026 ServZEN. All rights reserved.
            </p>
            <p className="text-[9px] font-medium text-slate-500 dark:text-zinc-400">
              Crafted with <span className="text-red-500">❤</span> by the ServZEN Team
            </p>
            <div className="flex gap-6">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase cursor-pointer hover:text-green-600 dark:hover:text-green-500 transition-colors">Privacy</span>
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase cursor-pointer hover:text-green-600 dark:hover:text-green-500 transition-colors">Terms</span>
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase cursor-pointer hover:text-green-600 dark:hover:text-green-500 transition-colors">Support</span>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}