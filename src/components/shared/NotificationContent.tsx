/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Bell, Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationContent() {
  const { notifications, isLoading, markAsRead } = useNotifications();

  if (isLoading && notifications.length === 0) {
    return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-green-600 size-6" /></div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center">
        <Bell className="size-8 mb-4 opacity-20" />
        <p className="font-medium">No new notifications</p>
        <p className="text-sm mt-1">Well notify you when something arrives.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.slice(0, 5).map((notification: any, index: number) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => {
            if (!notification.isRead) {
              markAsRead(notification.id);
            }
          }}
          className={`p-4 rounded-xl border ${
            notification.isRead
              ? "bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-gray-800 opacity-70"
              : "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/40 shadow-sm"
          } flex gap-4 transition-all duration-300 hover:shadow-md hover:border-green-300 dark:hover:border-green-800/60 cursor-pointer relative overflow-hidden`}
        >
          {/* Subtle gradient effect for unread */}
          {!notification.isRead && (
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600"></div>
          )}
          
          <div className={`mt-1 flex-shrink-0 size-10 rounded-full flex items-center justify-center ${
            notification.type.includes("COMPLETED") || notification.type.includes("PAID") ? "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400" :
            notification.type.includes("CANCELLED") || notification.type.includes("REMINDER") ? "bg-orange-100 dark:bg-orange-800/30 text-orange-600 dark:text-orange-400" :
            "bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400"  
          }`}>
            {(notification.type.includes("COMPLETED") || notification.type.includes("PAID")) && <CheckCircle2 size={20} />}
            {(notification.type.includes("CANCELLED") || notification.type.includes("REMINDER")) && <AlertCircle size={20} />}
            {(!notification.type.includes("COMPLETED") && !notification.type.includes("CANCELLED") && !notification.type.includes("PAID") && !notification.type.includes("REMINDER")) && <Calendar size={20} />}
          </div>
          <div className="flex-1 pr-6 flex justify-center flex-col">
            <h3 className={`text-sm font-semibold tracking-tight ${notification.isRead ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
              {notification.title}
            </h3>
            <p className={`text-sm mt-1 leading-snug ${notification.isRead ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"}`}>
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium flex items-center gap-1">
              <span>{new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              <span>•</span>
              <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          
          {!notification.isRead && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="flex size-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
