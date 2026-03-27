/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Them from "@/components/features/Theme/them";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { NotificationContent } from "@/app/(commonLayout)/notification/page";
import { ProfileUpdateForm } from "@/components/features/ProfileUpdateForm";
import {
  Menu,
  Search,
  LayoutDashboard,
  LogOut,
  Mail,
  Shield,
  Home,
  Info,
  Phone,
  Bell,
  User,
  Settings,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type NavbarUser = {
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  emailVerified?: boolean;
  needPasswordChange?: boolean;
  contactNumber?: string;
  address?: string;
};

type NavbarProps = {
  initialUser?: NavbarUser | null;
};

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Browse Services", icon: Search },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

const Navbar = ({ initialUser = null }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(initialUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const userRole = user?.role?.trim();

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
      setUser(null);
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  };

  const handleProfileModalOpen = async () => {
    if (!user) return;

    setIsProfileModalOpen(true);
    setIsLoadingProfile(true);

    try {
      // Import the service functions dynamically to avoid SSR issues
      const { getUserInfo } = await import("@/services/auth.service");
      const { getLoggedInUserProfile } = await import("@/services/user.service");

      const [userData, profileData] = await Promise.all([
        getUserInfo(),
        getLoggedInUserProfile()
      ]);

      setUser(userData);
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

  const renderDesktopLinks = () => (
    navLinks.map((link) => {
      const isActive = pathname === link.href;
      return (
        <Link 
          key={link.href} 
          href={link.href} 
          className={`group flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${
            isActive 
              ? "text-green-600 dark:text-green-500" 
              : "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
          }`}
        >
          <link.icon className={`size-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-green-600 dark:text-green-500" : "text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-400"}`} />
          {link.label}
        </Link>
      )
    })
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-900/10 bg-gradient-to-r from-[#F0F0F0] via-[#D5F0C8] to-[#70E06A] dark:from-[#030303] dark:via-[#081808] dark:to-[#032003] text-gray-900 dark:text-white font-sans shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[88px] w-full max-w-7xl items-center justify-between px-6 lg:px-12">
        
        {/* --- Logo Section --- */}
        <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-95">
          <img src="/favicon.ico" alt="" className="h-12 w-12 transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Serv<span className="font-serif italic text-gray-500 dark:text-gray-400">ZEN</span>
          </span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <div className="hidden items-center md:flex flex-1 justify-center">
          <nav className="flex items-center space-x-10">
            {renderDesktopLinks()}
          </nav>
        </div>

        {/* --- Right Section --- */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mr-2">
            
            {isLoggedIn && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
                    <LayoutDashboard className="size-4 mr-1.5" />
                    Dashboard
                  </Button>
                </Link>

                {mounted ? (
                  <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                        onClick={handleProfileModalOpen}
                      >
                        <User className="size-4 mr-1.5" />
                        My Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] md:max-w-[1000px] max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <User className="size-5" />
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
                ) : (
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                    disabled
                  >
                    <User className="size-4 mr-1.5" />
                    My Profile
                  </Button>
                )}

                {/* Notification Modal */}
                {mounted ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="relative text-gray-500 hover:text-gray-900 rounded-full dark:text-gray-400 dark:hover:text-white transition-colors">
                        <Bell className="size-4" />
                        <span className="absolute right-2.5 top-2.5 flex size-1.5 rounded-full bg-orange-500"></span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
                      <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell className="size-5 text-green-500" /> Notifications
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                          Stay updated with your latest alerts and offers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto p-6 pt-2 custom-scrollbar">
                         <NotificationContent />
                      </div>
                      <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-black/50 text-center">
                        <Link href="/notification" className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors">
                          View all notifications
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="icon" variant="ghost" className="relative text-gray-500 hover:text-gray-900 rounded-full dark:text-gray-400 dark:hover:text-white transition-colors">
                    <Bell className="size-4" />
                    <span className="absolute right-2.5 top-2.5 flex size-1.5 rounded-full bg-orange-500"></span>
                  </Button>
                )}
              </>
            )}

            <Them />
          </div>

          <div className="hidden md:block h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mr-2" />

          {!isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/10"
              >
                Get Started
              </Link>
            </div>
          ) : (
             <div className="flex items-center gap-3">
               {mounted ? (
               <Dialog>
                 <DialogTrigger asChild>
                   <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden ring-2 ring-transparent hover:ring-green-300 transition-all">
                     {user?.image ? (
                      <img src={user.image} alt={user?.name || "User"} className="h-full w-full object-cover" />
                     ) : (
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{userInitial}</span>
                     )}
                   </button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-md bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800">
                   <DialogHeader>
                     <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <User className="size-5 text-green-500" />
                       My Profile
                     </DialogTitle>
                   </DialogHeader>

                   <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                       <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-4 ring-white dark:ring-gray-900">
                         {user?.image ? (
                           <img src={user.image} alt={user?.name || "User"} className="h-full w-full object-cover" />
                         ) : (
                           <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{userInitial}</span>
                         )}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                           <Mail className="size-4 flex-shrink-0" />
                           {user?.email || "No email"}
                         </p>
                         {userRole && (
                           <div className="flex items-center gap-1 mt-1">
                             <Shield className="size-4 text-green-600 flex-shrink-0" />
                             <span className="text-xs font-medium text-green-700 dark:text-green-300">{userRole}</span>
                           </div>
                         )}
                       </div>
                     </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all duration-200 hover:shadow-md">
                        <LayoutDashboard className="size-4 mr-2" />
                        Go to Dashboard
                      </Link>
                      <Link href="/dashboard/my-profile" className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-950/30 transition-all duration-200 hover:shadow-md">
                        <Settings className="size-4 mr-2" />
                        Manage Profile
                      </Link>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full px-4 py-3 text-rose-600 border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all duration-200 hover:shadow-md"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : (
                          <LogOut className="size-4 mr-2" />
                        )}
                        Logout
                      </Button>
                    </div>
                   </div>
                 </DialogContent>
               </Dialog>
               ) : (
                <button className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden ring-2 ring-transparent">
                  {user?.image ? (
                    <img src={user.image} alt={user?.name || "User"} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{userInitial}</span>
                  )}
                </button>
               )}
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={handleLogout}
                 disabled={isLoggingOut}
                 className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-10 w-10"
               >
                 {isLoggingOut ? (
                   <Loader2 className="size-5 animate-spin" />
                 ) : (
                   <LogOut className="size-5" />
                 )}
               </Button>
             </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Them />
            {mounted ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-green-900/10 w-[300px] flex flex-col p-4">
                <SheetTitle className="text-left text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  Navigation Menu
                </SheetTitle>
                
                <div className="flex flex-col justify-between h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-2">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link 
                          key={link.href} 
                          href={link.href} 
                          className={`group flex items-center gap-3 text-sm font-medium p-3 rounded-xl transition-colors ${
                            isActive 
                              ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
                          }`}
                        >
                          <link.icon className="size-5" />
                          {link.label}
                        </Link>
                      )
                    })}

                    {isLoggedIn && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        <Link href="/dashboard" className="group flex items-center gap-3 text-sm font-medium p-3 rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400">
                           <LayoutDashboard className="size-5" /> Dashboard
                        </Link>
                        <Link href="/dashboard/my-profile" className="group flex items-center gap-3 text-sm font-medium p-3 rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400">
                          <User className="size-5" /> My Profile
                        </Link>
                        <Link href="/notification" className="group flex items-center gap-3 text-sm font-medium p-3 rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400">
                           <Bell className="size-5" /> Notifications
                        </Link>
                      </div>
                    )}
                  </nav>

                  <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 pb-4">
                     {isLoggedIn ? (
                       <div className="flex items-center justify-between px-2">
                         <div className="flex items-center gap-3">
                           <Dialog>
                             <DialogTrigger asChild>
                               <button className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 overflow-hidden">
                                  {user?.image ? (
                                    <img src={user.image} alt={user?.name || "User"} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-sm font-semibold">{userInitial}</span>
                                  )}
                               </button>
                             </DialogTrigger>
                             <DialogContent className="sm:max-w-md bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800">
                               <DialogHeader>
                                 <DialogTitle>My Profile</DialogTitle>
                                 <DialogDescription>
                                   Account details and quick actions.
                                 </DialogDescription>
                               </DialogHeader>
                               <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                 <p><strong>Name:</strong> {user?.name || "User"}</p>
                                 <p><strong>Email:</strong> {user?.email || "No email"}</p>
                                 {userRole && <p><strong>Role:</strong> {userRole}</p>}
                               </div>
                             </DialogContent>
                           </Dialog>
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name || "My Profile"}</span>
                         </div>
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={handleLogout}
                           disabled={isLoggingOut}
                           className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                         >
                           <LogOut className="size-5" />
                         </Button>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-3">
                          <Link href="/login" className="w-full flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Login
                          </Link>
                          <Link href="/register" className="w-full flex items-center justify-center py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                            Get Started
                          </Link>
                       </div>
                     )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            ) : (
              <Button size="icon" variant="ghost" aria-label="Open navigation">
                <Menu className="size-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;