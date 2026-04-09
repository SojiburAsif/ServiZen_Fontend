/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Role } from "@/app/constants/role";
import { AppSidebar } from "@/components/shared/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { NotificationContent } from "@/components/shared/NotificationContent";
import { ProfileUpdateForm } from "@/components/features/ProfileUpdateForm";
import { ChangePasswordForm } from "@/components/modules/Auth/changePasswordForm";
import { Bell, BellRing, UserCircle, LayoutDashboard, LogOut, Settings, Lock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";

type DashboardUser = {
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  emailVerified?: boolean;
  needPasswordChange?: boolean;
  contactNumber?: string;
  address?: string;
  isGoogleLogin?: boolean;
};

type DashboardHeaderProps = {
  user: DashboardUser | null;
  userRole: string;
  admin: React.ReactNode;
  provider: React.ReactNode;
  clinte: React.ReactNode;
};

function ClientNotificationBell() {
  const { unreadCount } = useNotifications();
  return (
    <DialogTrigger asChild>
      <button className="relative p-2 text-zinc-400 hover:text-emerald-500 transition-colors rounded-xl">
        <div className="relative">
          {unreadCount > 0 ? (
             <BellRing className="size-5 text-zinc-400 hover:text-emerald-500 transition-colors" />
          ) : (
             <Bell className="size-5 text-zinc-400 hover:text-emerald-500 transition-colors" />
          )}
          {unreadCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse ring-2 ring-white dark:ring-black">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : (
             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-black" />
          )}
        </div>
      </button>
    </DialogTrigger>
  );
}

export function DashboardHeader({
  user,
  userRole,
  admin,
  provider,
  clinte
}: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const userRoleValue = user?.role?.trim();
  const isProviderOrAdmin = userRoleValue === "PROVIDER" || userRoleValue === "ADMIN";

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/logout", {
        method: "POST",
      });

      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
        duration: 3000,
      });
    } catch {
      // Ignore network errors and still clear client auth state.
      toast.error("Logout completed", {
        description: "You have been logged out (with network issues).",
        duration: 3000,
      });
    } finally {
      setIsLoggingOut(false);
      localStorage.removeItem("better-auth.session_token");
      localStorage.removeItem("better-auth.session_data");
      sessionStorage.removeItem("better-auth.session_token");
      sessionStorage.removeItem("better-auth.session_data");
      document.cookie = "better-auth.session_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
  };

  const handleProfileModalOpen = async () => {
    if (!user) return;

    setIsProfileModalOpen(true);
    setIsLoadingProfile(true);

    try {
      // Import the service functions dynamically to avoid SSR issues
      const { getLoggedInUserProfile } = await import("@/services/user.service");

      const profileData = await getLoggedInUserProfile();

      setProfileData(profileData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleProfileUpdateSuccess = () => {
    toast.success("Profile updated successfully!");
    setIsProfileModalOpen(false);
    // Optionally refresh user data
    handleProfileModalOpen();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fcfdfe] dark:bg-[#050505] transition-colors duration-500">

        {/* Sidebar Section */}
        <AppSidebar user={{ role: userRole }} />

        <SidebarInset className="bg-transparent">
          {/* --- Premium Minimalist Header --- */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-white/60 dark:bg-black/60 px-6 backdrop-blur-xl transition-all dark:border-zinc-800/50">

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="h-9 w-9 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all rounded-xl" />
                <Separator orientation="vertical" className="h-5 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Breadcrumb Style Role Indicator */}
              <div className="flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 leading-none mb-1">
                  Control Panel
                </p>
                <h2 className="text-sm font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {userRole} MODE
                </h2>
              </div>
            </div>

            {/* Header Right Side Icons */}
            <div className="flex items-center gap-3">
              {/* Notification Dialog */}
              {mounted && (
                <Dialog>
                  <ClientNotificationBell />
                  <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="size-5 text-emerald-500" /> Notifications
                      </DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Stay updated with your latest alerts and offers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto p-6 pt-2 custom-scrollbar">
                       <NotificationContent />
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-black/50 text-center">
                      <Link href="/notifications" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                        View all notifications
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Separator orientation="vertical" className="h-5 mx-1 bg-zinc-200 dark:bg-zinc-800" />

              {/* Profile Update Modal */}
              {mounted && (
                <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                  <DialogContent className="sm:max-w-[900px] md:max-w-[1000px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Settings className="size-5" />
                        Update Profile
                      </DialogTitle>
                      <DialogDescription>
                        Update your profile information below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      {isLoadingProfile ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="size-6 animate-spin" />
                          <span className="ml-2">Loading profile...</span>
                        </div>
                      ) : profileData && user ? (
                        <ProfileUpdateForm
                          initialData={{
                            name: profileData?.name || user?.name,
                            email: profileData?.email || user?.email,
                            contactNumber: (profileData?.provider?.contactNumber ?? profileData?.client?.contactNumber) || undefined,
                            address: (profileData?.provider?.address ?? profileData?.client?.address) || undefined,
                            image: profileData?.image || undefined,
                          }}
                          onSuccess={handleProfileUpdateSuccess}
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Failed to load profile data. Please try again.
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Change Password Modal */}
              {mounted && (
                <Dialog open={isChangePasswordModalOpen} onOpenChange={setIsChangePasswordModalOpen}>
                  <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-xl">
                    <DialogTitle className="sr-only">Change Password</DialogTitle>
                    <DialogDescription className="sr-only">Change your account password.</DialogDescription>
                    <ChangePasswordForm
                      onSuccess={() => setIsChangePasswordModalOpen(false)}
                      onCancel={() => setIsChangePasswordModalOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}

              {/* User Identity with Dropdown */}
              <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                 <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                        {user?.name || "Member"}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium">{user?.email?.split('@')[0]}</p>
                 </div>
                 {mounted ? (
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <div className="cursor-pointer">
                         <Avatar className="h-9 w-9">
                           <AvatarImage src={user?.image} alt={user?.name || "User"} />
                           <AvatarFallback className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                             <UserCircle size={22} />
                           </AvatarFallback>
                         </Avatar>
                       </div>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-64 p-2 mt-2 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl space-y-2 relative right-2" align="end">

                       <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                         <div className="h-10 w-10 text-white rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                           {user?.image ? (
                             <img src={user.image} alt={user?.name || "User"} className="h-full w-full object-cover" />
                           ) : (
                             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{userInitial}</span>
                           )}
                         </div>
                         <div className="flex flex-col min-w-0">
                           <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "No email"}</p>
                         </div>
                       </div>

                       <DropdownMenuItem asChild className="p-0">
                         <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full cursor-pointer">
                           <LayoutDashboard className="size-4 mr-3 text-gray-500 group-hover:text-emerald-600" />
                           Dashboard
                         </Link>
                       </DropdownMenuItem>

                       {!isProviderOrAdmin && (
                         <DropdownMenuItem asChild className="p-0">
                           <button onClick={handleProfileModalOpen} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full cursor-pointer text-left">
                             <Settings className="size-4 mr-3 text-gray-500 group-hover:text-emerald-600" />
                             My Profile
                           </button>
                         </DropdownMenuItem>
                       )}

{!user?.isGoogleLogin && (
                         <DropdownMenuItem asChild className="p-0">
                           <button onClick={() => setIsChangePasswordModalOpen(true)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full cursor-pointer text-left">
                             <Lock className="size-4 mr-3 text-gray-500 group-hover:text-green-500" />
                             Change Password
                           </button>
                         </DropdownMenuItem>
                       )}

                       <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800 my-2" />

                       <DropdownMenuItem asChild className="p-0">
                         <button
                           onClick={handleLogout}
                           disabled={isLoggingOut}
                           className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                         >
                           {isLoggingOut ? (
                             <Loader2 className="size-4 mr-3 animate-spin" />
                           ) : (
                             <LogOut className="size-4 mr-3" />
                           )}
                           {isLoggingOut ? "Logging out..." : "Logout"}
                         </button>
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 ) : (
                   <Avatar className="h-9 w-9">
                     <AvatarImage src={user?.image} alt={user?.name || "User"} />
                     <AvatarFallback className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                       <UserCircle size={22} />
                     </AvatarFallback>
                   </Avatar>
                 )}
              </div>
            </div>
          </header>

          {/* --- Dynamic Content Body --- */}
          <main className="flex-1 overflow-y-auto">
            {/* Ambient Background Glow for Main Content */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-full mx-auto">
              {userRole === Role.ADMIN && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">{admin}</div>
              )}

              {userRole === Role.CLIENT && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">{clinte}</div>
              )}

              {userRole === Role.PROVIDER && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">{provider}</div>
              )}
            </div>
          </main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}