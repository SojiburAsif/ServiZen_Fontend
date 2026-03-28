"use client";

import useSWR from 'swr';
import { getMyNotifications, getProviderNotifications, markNotificationAsRead, Notification } from '@/services/notification.service';
import { getUserRoleFromServer } from '@/app/actions/getUserRole';
import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { toast } from 'sonner';

const fetcher = async () => {
  const filters = { page: 1, limit: 10 };
  let res;

  const role = await getUserRoleFromServer();

  if (role === "PROVIDER") {
    res = await getProviderNotifications(filters);
  } else {
    res = await getMyNotifications(filters);
  }

  return res?.data || [];
};

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>('notifications', fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds for real-time feel
    revalidateOnFocus: true,
  });

  const [sound] = useState(() => typeof window !== 'undefined' ? new Howl({
    src: ['/sounds/notification.mp3'], // Assuming we put a sound file in public
    volume: 0.5,
  }) : null);

  // Play sound and show toast when new unread notifications arrive
  useEffect(() => {
    if (data) {
      const currentUnread = data.filter(n => !n.isRead).length;
      const previousParam = sessionStorage.getItem('prevUnreadCount');
      const prevUnread = previousParam ? parseInt(previousParam) : 0;
      
      if (currentUnread > prevUnread) {
        // We have a new notification! Let's find the newest unread one.
        const unreadNotifs = data.filter(n => !n.isRead);
        if (unreadNotifs.length > 0) {
           const latest = unreadNotifs[0]; // Assuming first is latest
           toast(latest.title, {
             description: latest.message,
             duration: 5000,
             icon: "🔔",
             position: "top-right"
           });
        }
        sound?.play();
      }
      
      sessionStorage.setItem('prevUnreadCount', currentUnread.toString());
    }
  }, [data, sound]);

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    if (data) {
      const newData = data.map(n => n.id === id ? { ...n, isRead: true } : n);
      mutate(newData, false);
    }
    
    // API Call
    const success = await markNotificationAsRead(id);
    if (!success) {
      // Revert if failed
      mutate();
    }
  };

  const markAllAsRead = async () => {
    if (!data) return;
    const unreadIds = data.filter(n => !n.isRead).map(n => n.id);
    
    // Optimistic
    mutate(data.map(n => ({...n, isRead: true})), false);

    // Call API for each
    await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
    mutate();
  };

  const unreadCount = data?.filter(n => !n.isRead).length || 0;

  return {
    notifications: data || [],
    unreadCount,
    isLoading,
    isError: error,
    markAsRead,
    markAllAsRead,
    mutate
  };
}