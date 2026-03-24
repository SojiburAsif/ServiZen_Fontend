"use client";

import Them from "@/components/features/Theme/them";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-400/30 bg-white/85 backdrop-blur-sm dark:border-emerald-500/20 dark:bg-black/95">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-black font-extrabold shadow-sm">
            SZ
          </span>
          <span className="text-lg font-bold tracking-wide text-emerald-700 dark:text-emerald-400">ServZEN</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={isActive ? "bg-emerald-500 text-black hover:bg-emerald-500/90" : "text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800/30 dark:hover:text-emerald-200"}
                >
                  {link.label}
                </Button>
              </Link>
            );
          })}
          </nav>
          <Them />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Them />
          <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-emerald-700 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-800/30"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[280px] border-l border-emerald-300/40 bg-white text-emerald-900 dark:border-emerald-500/20 dark:bg-black dark:text-emerald-100">
            <div className="mt-10 flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} className={isActive ? "rounded-md bg-emerald-500 px-4 py-2 font-semibold text-black" : "rounded-md px-4 py-2 text-emerald-800 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-800/40"}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
