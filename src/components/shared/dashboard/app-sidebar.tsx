"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";



import { LogOut, Home, LayoutDashboard } from "lucide-react";
import { Route } from "@/types/Router.type";
import { AdminRouters } from "@/Routers/adminRouter";
import { ProviderRouters } from "@/Routers/ProviderRouter";
import { UserRouters } from "@/Routers/userRouter";

function cn(...inputs: (string | boolean | undefined | null | number)[]) {
    return inputs.filter(Boolean).join(" ");
}

export function AppSidebar({
    user,
    ...props
}: {
    user: { role: string };
} & React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const router = useRouter();

    let routes: Route[] = [];

    switch (user.role) {
        case "ADMIN":
            routes = AdminRouters;
            break;
        case "USER":
            routes = UserRouters;
            break;
        case "PROVIDER":
            routes = ProviderRouters;
            break;
    }


    //   const handleLogout = async () => {
    //     await authClient.signOut({
    //       fetchOptions: {
    //         onSuccess: () => {
    //           router.push("/"); 
    //           router.refresh(); 
    //         },
    //       },
    //     });
    //   };

    return (
        <Sidebar
            {...props}
            className="border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-black transition-colors duration-300"
        >
            <SidebarContent className="flex flex-col justify-between h-full bg-white dark:bg-black">

                <div>
                    <div className="px-6 py-8">
                        <div className="flex items-center gap-3">


                            <Link href="/" className="group flex items-center gap-2 transition-transform active:scale-95">
                                <img src="/favicon.ico" alt="" className="h-10 w-10" />
                                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Serv<span className="font-serif italic text-gray-500 dark:text-gray-400">ZEN</span>
                                </span>
                            </Link>



                        </div>
                    </div>

                    <div className="px-4 mb-6">
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200",
                                pathname === "/"
                                    ? "bg-green-600 text-white shadow-xl shadow-green-500/25"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900"
                            )}
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {routes.map((group) => (
                            <SidebarGroup key={group.title} className="px-4">
                                <SidebarGroupLabel className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-2">
                                    {group.title}
                                </SidebarGroupLabel>

                                <SidebarGroupContent>
                                    <SidebarMenu className="gap-1">
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.url;
                                            const Icon = item.icon || LayoutDashboard;

                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton asChild>
                                                        <Link
                                                            href={item.url}
                                                            className={cn(
                                                                "flex items-center gap-3 px-4 py-6 rounded-2xl font-bold transition-all duration-200 group",
                                                                isActive
                                                                    ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                                                                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-green-600 dark:hover:text-green-400"
                                                            )}
                                                        >
                                                            <Icon
                                                                size={18}
                                                                className={cn(
                                                                    "transition-transform group-hover:scale-110",
                                                                    isActive ? "text-white" : "text-slate-400 group-hover:text-green-600"
                                                                )}
                                                            />
                                                            <span className="text-sm tracking-wide">{item.title}</span>

                                                            {isActive && (
                                                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                            )}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </div>
                </div>

                <div className="px-4 pb-8">
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-900">
                        <button
                            onClick={() => { }}
                            className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl
              font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 
              border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all duration-200"
                        >
                            <LogOut size={18} />
                            <span className="text-sm">Logout Session</span>
                        </button>
                    </div>
                </div>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}