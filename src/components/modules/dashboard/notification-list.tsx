"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, AlertCircle, Calendar, CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NotificationList() {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 dark:text-green-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-full p-6 mb-6 inline-flex">
          <Bell className="h-12 w-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">All caught up!</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">You don t have any new notifications.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {unreadCount > 0 && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => markAllAsRead()}
            variant="outline" 
            className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/20 rounded-full px-6"
          >
            Mark all as read
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {notifications.map((notification, index) => {
          const isUnread = !notification.isRead;
          const isPositive = notification.type.includes("COMPLETED") || notification.type.includes("PAID");
          const isWarning = notification.type.includes("CANCELLED") || notification.type.includes("REMINDER");
          const Icon = isPositive ? CheckCircle2 : isWarning ? AlertCircle : (notification.type.includes("PAYMENT") ? CreditCard : Calendar);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                if (isUnread) markAsRead(notification.id);
              }}
              className={`group relative flex flex-col sm:flex-row gap-5 p-5 md:p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isUnread 
                  ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-800" 
                  : "bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-gray-900 opacity-80 hover:opacity-100 hover:border-gray-200 dark:hover:border-gray-800"
              }`}
            >
              {isUnread && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"></div>
              )}
              
              <div className="flex items-start gap-5 flex-1">
                <div className={`flex-shrink-0 size-12 rounded-full flex items-center justify-center border ${
                  isPositive ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400" :
                  isWarning ? "bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/40 dark:border-orange-800 dark:text-orange-400" :
                  "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400"
                }`}>
                  <Icon className="size-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                    <h4 className={`text-base font-bold pr-6 ${isUnread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                      {notification.title}
                    </h4>
                    <Badge variant="outline" className={`whitespace-nowrap shrink-0 ${
                      isPositive ? "text-green-700 border-green-200 dark:text-green-400 dark:border-green-800" :
                      isWarning ? "text-orange-700 border-orange-200 dark:text-orange-400 dark:border-orange-800" :
                      "text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800"
                    }`}>
                      {notification.type.replace(/_/g, " ").toLowerCase()}
                    </Badge>
                  </div>
                  <p className={`text-sm mb-3 leading-relaxed ${isUnread ? "text-gray-700 dark:text-gray-300 font-medium" : "text-gray-500 dark:text-gray-500"}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 flex items-center gap-1.5 uppercase tracking-wider">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {isUnread && (
                <div className="absolute right-5 sm:right-6 top-6 sm:top-1/2 sm:-translate-y-1/2">
                  <span className="flex size-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"></span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
