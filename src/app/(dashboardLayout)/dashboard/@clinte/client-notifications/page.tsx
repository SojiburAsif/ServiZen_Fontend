"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  X,
  CheckCheck,
  Filter,
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
      return <CheckCircle className="size-5 text-emerald-500" />;
    }
    if (type.includes("CANCELLED") || type.includes("REMINDER") || type.includes("REFUND")) {
      return <AlertCircle className="size-5 text-amber-500" />;
    }
    return <Info className="size-5 text-zinc-400" />;
  };

  const getBgColor = (isRead: boolean) => {
    if (!isRead) return "bg-zinc-50/80 dark:bg-zinc-900/40 border-emerald-500/20";
    return "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="h-12 w-80 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-lg" />
              <div className="h-4 w-96 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-lg" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
              Client <span className="text-emerald-500">Notifications</span>
            </h1>
            <p className="text-zinc-500 mt-2 max-w-md font-medium text-sm">
              Stay updated with your latest activities and important service alerts.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
               <Bell className="text-emerald-500 size-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Unread Alerts</p>
              <p className="text-xl font-black text-emerald-500 leading-none">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-xs uppercase tracking-widest">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-widest">
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-20 text-center shadow-sm">
              <div className="mx-auto w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Bell className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Queue Clear
              </h3>
              <p className="text-zinc-500 text-sm font-medium">
                {filter === "unread" ? "You've read everything!" : "No notifications to show."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-6 md:p-8 ${getBgColor(notification.isRead)}`}
              >
                {!notification.isRead && (
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                )}
                
                <div className="flex items-start gap-6">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${notification.isRead ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-emerald-500/10'}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none">
                          {notification.title}
                          {!notification.isRead && (
                             <span className="ml-3 text-[9px] font-black bg-emerald-500 text-black px-2 py-0.5 rounded-full uppercase tracking-tighter align-middle">
                               New
                             </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="size-3 text-zinc-400" />
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                            {format(new Date(notification.createdAt), "dd MMM yyyy • h:mm a")}
                          </p>
                        </div>
                      </div>

                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                          className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shrink-0"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed font-medium ${notification.isRead ? 'text-zinc-400' : 'text-zinc-600 dark:text-zinc-300'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {notifications.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
            <p className="text-center text-[9px] text-zinc-400 font-bold uppercase tracking-[0.4em]">
              Showing {filteredNotifications.length} of {notifications.length} Alerts
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
