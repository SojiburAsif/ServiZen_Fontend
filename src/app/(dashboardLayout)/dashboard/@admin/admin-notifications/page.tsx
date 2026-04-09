"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Bell,
  AlertCircle,
  CheckCheck,
  Filter,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, isLoading: loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<string>("all");

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return true; 
  });

  const getNotificationIcon = (type: string) => {
    if (type.includes("COMPLETED") || type.includes("PAID") || type.includes("REGISTERED")) {
      return <ShieldCheck className="h-5 w-5" />;
    }
    if (type.includes("CANCELLED") || type.includes("REMINDER") || type.includes("REFUND")) {
      return <AlertCircle className="h-5 w-5" />;
    }
    return <Zap className="h-5 w-5" />;
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="w-full px-4 py-8 space-y-6">
        <div className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-50 dark:bg-zinc-900/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-[10px] font-black tracking-widest uppercase w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative h-2 w-2 bg-emerald-500 rounded-full"></span>
          </span>
          System Center
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white">Admin Notifications</h1>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Real-time system activity</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-black text-white dark:bg-white dark:text-black rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest border-none">
              {unreadCount} Actions Required
            </Badge>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-56 h-11 rounded-xl font-black text-[10px] tracking-widest bg-zinc-50 dark:bg-zinc-800 border-none uppercase">
            <SelectValue placeholder="FILTER" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
            <SelectItem value="all" className="font-black text-[10px] uppercase">ALL ENTRIES</SelectItem>
            <SelectItem value="unread" className="font-black text-[10px] uppercase">UNREAD ONLY</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="w-full sm:w-auto h-11 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl font-black text-[10px] tracking-widest uppercase px-8"
        >
          <CheckCheck className="h-4 w-4 mr-2" />
          MARK ALL PROCESSED
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="rounded-[3rem] border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-transparent">
            <CardContent className="p-20 text-center">
              <Bell className="mx-auto h-10 w-10 text-zinc-300 mb-4" />
              <h3 className="text-lg font-black text-zinc-400 uppercase tracking-tighter">Queue Clear</h3>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`group relative rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                notification.isRead
                  ? "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 opacity-60"
                  : "bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xl"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Fixed Visual Indicator - FIXED HERE */}
                  <div className={`w-1.5 sm:w-2 shrink-0 ${notification.isRead ? "bg-zinc-200 dark:bg-zinc-800" : "bg-black dark:bg-white"}`} />
                  
                  <div className="flex-1 p-6 md:p-8 flex items-start gap-6 min-w-0">
                    <div className={`shrink-0 p-4 rounded-2xl ${
                      notification.isRead 
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400" 
                        : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-tight truncate">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          )}
                        </div>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                          {format(new Date(notification.createdAt), "HH:mm // dd MMM")}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 pt-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:underline underline-offset-4"
                          >
                            Mark as processed
                          </button>
                        )}
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                          ID: {notification.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}