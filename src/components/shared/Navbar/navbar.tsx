"use client";

import Them from "@/components/features/Theme/them";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Browse Services", icon: Search },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggedIn] = useState(false);

  const renderDesktopLinks = () => (
    navLinks.map((link) => {
      const isActive = pathname === link.href;
      return (
        <Link 
          key={link.href} 
          href={link.href} 
          className={`text-sm font-medium transition-colors duration-300 ${
            isActive 
              ? "text-green-500" 
              : "text-black hover:text-green-500 dark:text-white dark:hover:text-green-400"
          }`}
        >
          {link.label}
        </Link>
      )
    })
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 bg-[#FAFAFA]/80 backdrop-blur-md dark:bg-black/80 dark:border-gray-800/60 font-sans">
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
             <Button size="icon" variant="ghost" className="relative text-gray-500 hover:text-gray-900 rounded-full dark:text-gray-400 dark:hover:text-white transition-colors">
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 flex size-1.5 rounded-full bg-orange-500"></span>
            </Button>
            <Them />
          </div>

          <div className="hidden md:block h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mr-2" />

          {!isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Login
              </Link>
              <Link href="/register">
                <button className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/10">
                  Get Started
                </button>
              </Link>
            </div>
          ) : (
             <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800">
               <UserCircle className="size-5 text-gray-600 dark:text-gray-300" />
             </button>
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
                <nav className="flex flex-col gap-4 mt-10">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className={`text-lg font-medium border-b border-gray-100 dark:border-gray-800 pb-2 transition-colors ${
                          isActive 
                            ? "text-green-500" 
                            : "text-black dark:text-white hover:text-green-500 dark:hover:text-green-400"
                        }`}
                      >
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