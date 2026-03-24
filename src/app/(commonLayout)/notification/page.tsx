"use client";

import React from 'react';
import { Bell, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultNotifications = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your plumbing service is scheduled for tomorrow at 10:00 AM.",
    time: "2 hours ago",
    type: "success",
    isRead: false,
  },
  {
    id: 2,
    title: "Special Offer!",
    message: "Get 20% off on all cleaning services this weekend.",
    time: "1 day ago",
    type: "promo",
    isRead: true,
  },
  {
    id: 3,
    title: "Action Required",
    message: "Please complete your profile to get the best out of ServZEN.",
    time: "2 days ago",
    type: "alert",
    isRead: true,
  }
];

export function NotificationContent() {
  return (
    <div className="flex flex-col gap-4">
      {defaultNotifications.map((notification, index) => (
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
            notification.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400' :
            notification.type === 'alert' ? 'bg-orange-100 dark:bg-orange-800/30 text-orange-600 dark:text-orange-400' :
            'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400'
          }`}>
            {notification.type === 'success' && <CheckCircle2 size={20} />}
            {notification.type === 'alert' && <AlertCircle size={20} />}
            {notification.type === 'promo' && <Calendar size={20} />}
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${notification.isRead ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
              {notification.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
              {notification.time}
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

export default function NotificationPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-12 bg-white dark:bg-black min-h-screen">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
          <Bell size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with your latest alerts and offers.</p>
        </div>
      </div>
      
      <NotificationContent />
    </div>
  );
}
