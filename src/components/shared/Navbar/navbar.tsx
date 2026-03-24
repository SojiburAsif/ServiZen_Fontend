"use client";

import Them from "@/components/features/Theme/them";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { NotificationContent } from "@/app/(commonLayout)/notification/page";
import { 
  Menu, 
  Search, 
  LayoutDashboard, 
  LogOut, 
  UserCircle,
  Home,
  Info,
  Phone,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Role } from "@/app/constants/role";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Browse Services", icon: Search },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

const Navbar = () => {
  const pathname = usePathname();
  
  // Hardcoded for demonstration, replace with actual auth logic
  const userRole = Role.ADMIN;
  const isLoggedIn = !!userRole;

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
        <Link href="/" className="group flex items-center gap-2 transition-transform active:scale-95">
          <img src="/favicon.ico" alt="" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
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

                {/* Notification Modal */}
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
               <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800">
                 <UserCircle className="size-5 text-gray-600 dark:text-gray-300" />
               </button>
               <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                 <LogOut className="size-4" />
               </Button>
             </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Them />
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white dark:bg-black">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <nav className="flex flex-col gap-4 mt-8 px-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className={`group flex items-center gap-3 text-lg font-medium border-b border-gray-100 dark:border-gray-800/50 pb-3 transition-colors ${
                          isActive 
                            ? "text-green-600 dark:text-green-500" 
                            : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500" : "bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 group-hover:bg-green-50 dark:group-hover:bg-green-500/10 group-hover:text-green-600 dark:group-hover:text-green-400"}`}>
                          <link.icon className="size-5" />
                        </div>
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;