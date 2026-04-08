"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  X,
  CheckCheck,
  Filter,
  Sparkles,
  Activity,
  Layers,
  Zap,
  Navigation,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationsLoading from "./loading";

export default function NotificationsPage() {
  const { notifications, isLoading: loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<string>("all");

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return true; 
  });

  const getNotificationIcon = (type: string) => {
    if (type.includes("COMPLETED") || type.includes("PAID")) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    }
    if (type.includes("CANCELLED") || type.includes("REMINDER") || type.includes("REFUND")) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
    return <Info className="h-5 w-5 text-zinc-400" />;
  };

  if (loading) {
    return <NotificationsLoading />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        
        {/* Compact Tactical Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50/50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                  <Bell className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Real-time Signal Feed
                </span>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                   Provider <span className="text-emerald-500">Alerts</span>
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                   Monitor system events, service updates, and consumer activity logs through your encrypted uplink.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {unreadCount > 0 && (
                <div className="rounded-xl bg-rose-500 px-4 py-2 shadow-lg shadow-rose-500/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">{unreadCount} Pending</p>
                </div>
               )}
               <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <Activity className="h-5 w-5 text-emerald-500" />
               </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-zinc-500/5 blur-3xl" />
        </div>

        {/* Tactical Command Bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
           <div className="flex-1">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-14 w-full lg:w-64 rounded-2xl border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-100 dark:text-black font-bold">
                  <SelectValue placeholder="Signal Filter" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-100 dark:border-zinc-800">
                  <SelectItem value="all">Every Signal</SelectItem>
                  <SelectItem value="unread">Unread Priority</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="h-14 rounded-2xl border-zinc-100 bg-white px-8 font-black text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
           >
            <CheckCheck className="mr-3 h-5 w-5 text-emerald-500" />
            Reset Protocol
           </Button>
        </div>

        {/* Notification Matrix */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-100 bg-zinc-50/30 py-24 dark:border-zinc-800/50 dark:bg-zinc-950/30">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl dark:bg-zinc-900">
                 <Zap className="h-8 w-8 text-zinc-200" />
              </div>
              <h3 className="mt-8 text-xl font-black text-zinc-900 dark:text-white uppercase">Feed Silent</h3>
              <p className="mt-2 text-zinc-500">No active signals found in the current stream.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative flex flex-col gap-4 rounded-3xl border p-6 transition-all hover:shadow-xl hover:shadow-zinc-500/5 ${
                  notification.isRead
                    ? "border-zinc-100 bg-white/50 opacity-80 dark:border-zinc-800 dark:bg-zinc-950/50"
                    : "border-emerald-500/20 bg-white dark:border-emerald-500/10 dark:bg-zinc-950"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      notification.isRead ? "bg-zinc-50 dark:bg-zinc-900" : "bg-emerald-500/10 dark:bg-emerald-500/5"
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                         <h4 className={`text-lg font-black tracking-tight ${notification.isRead ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-900 dark:text-white"}`}>
                           {notification.title}
                         </h4>
                         {!notification.isRead && (
                           <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         )}
                      </div>

                      <p className={`text-base font-medium leading-relaxed ${notification.isRead ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            <Clock className="h-3 w-3" />
                            {format(new Date(notification.createdAt), "HH:mm | MMM dd")}
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            <Layers className="h-3 w-3" />
                            Node: #{notification.id.slice(-6).toUpperCase()}
                         </div>
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="h-10 w-10 rounded-lg bg-zinc-900 p-0 text-white hover:bg-emerald-500 dark:bg-white dark:text-black dark:hover:bg-emerald-500 dark:hover:text-white"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tactical Status Bar */}
        {notifications.length > 0 && (
          <div className="flex justify-center">
             <div className="inline-flex items-center gap-6 rounded-full border border-zinc-100 bg-white px-10 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Stream Status: Active</p>
                </div>
                <div className="h-4 w-[1px] bg-zinc-100 dark:bg-zinc-800" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                  {filteredNotifications.length} Signal Packets Captured
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
