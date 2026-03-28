"use client";

import useSWR from 'swr';
import { getMyNotifications, getProviderNotifications, markNotificationAsRead, Notification } from '@/services/notification.service';
import { jwtUtils } from '@/lib/jwtUtils';
import { useEffect, useState } from 'react';
import { Howl } from 'howler';

const fetcher = async () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  let role = "USER";
  if (token) {
    try {
      const decoded = jwtUtils.decodedToken(token);
      const r = (decoded?.role as string) || "USER";
      role = r === "CLIENT" ? "USER" : r;
    } catch(e) {}
  }

  const filters = { page: 1, limit: 10 };
  let res;

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

  // Play sound when new unread notifications arrive
  useEffect(() => {
    if (data) {
      const currentUnread = data.filter(n => !n.isRead).length;
      const previousParam = sessionStorage.getItem('prevUnreadCount');
      const prevUnread = previousParam ? parseInt(previousParam) : 0;
      
      if (currentUnread > prevUnread) {
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