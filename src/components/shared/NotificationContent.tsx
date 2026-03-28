"use client";

import React, { useEffect, useState } from "react";
import { Bell, Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getMyNotifications, getProviderNotifications, Notification } from "@/services/notification.service";
import { jwtUtils } from "@/lib/jwtUtils";

export function NotificationContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadNotifs() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];
          
        let role = "USER";
        if (token) {
          const decoded = jwtUtils.decodedToken(token);
          const r = (decoded?.role as string) || "USER";
          role = r === "CLIENT" ? "USER" : r;
        }

        const filters = { page: 1, limit: 3 };
        let res;
        
        if (role === "PROVIDER") {
          res = await getProviderNotifications(filters);
        } else {
          res = await getMyNotifications(filters);
        }

        if (isMounted) {
          if (res?.data) {
            setNotifications(res.data);
          }
        }
      } catch (error) {
        console.error("Failed to load notifications nav menu:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadNotifs();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-green-600 size-6" /></div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center">
        <Bell className="size-8 mb-2 opacity-20" />
        <p>No new notifications</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notifications.slice(0, 3).map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-xl border ${
            notification.isRead
              ? "bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-gray-800"
              : "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20"
          } flex gap-4 transition-all duration-300 hover:shadow-md hover:border-green-200 dark:hover:border-green-800/30 cursor-pointer`}
        >
          <div className={`mt-1 flex-shrink-0 size-10 rounded-full flex items-center justify-center ${
            notification.type.includes("COMPLETED") ? "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400" :
            notification.type.includes("CANCELLED") ? "bg-orange-100 dark:bg-orange-800/30 text-orange-600 dark:text-orange-400" :
            "bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400"  
          }`}>
            {notification.type.includes("COMPLETED") && <CheckCircle2 size={20} />}     
            {notification.type.includes("CANCELLED") && <AlertCircle size={20} />}        
            {!notification.type.includes("COMPLETED") && !notification.type.includes("CANCELLED") && <Calendar size={20} />}
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${notification.isRead ? "text-gray-800 dark:text-gray-200" : "text-gray-900 dark:text-white"}`}>
              {notification.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
          {!notification.isRead && (
            <div className="flex-shrink-0">
              <span className="flex size-2.5 rounded-full bg-green-500 mt-2"></span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
