"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellRing, CheckCircle, AlertCircle, CreditCard, Calendar, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { markNotificationAsRead, getMyNotifications, getProviderNotifications, type Notification } from "@/services/notification.service";
import { jwtUtils } from "@/lib/jwtUtils";

interface NotificationListProps {
  userRole: "USER" | "PROVIDER" | "ADMIN";
  limit?: number;
  onNotificationClick?: (bookingId?: string) => void;
}

export function NotificationList({ userRole, limit = 10, onNotificationClick }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, [userRole]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = userRole === "PROVIDER"
        ? await getProviderNotifications({ limit })
        : await getMyNotifications({ limit });

      if (result) {
        setNotifications(result.data);
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);
      const success = await markNotificationAsRead(notificationId);

      if (success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification.bookingId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_COMPLETED":
      case "BOOKING_PAYMENT_PAID_FOR_PROVIDER":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PAYMENT_REMINDER":
        return <CreditCard className="w-5 h-5 text-yellow-600" />;
      case "BOOKING_COMPLETED":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "BOOKING_CANCELLED_BY_USER":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "BOOKING_CREATED_FOR_PROVIDER":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PAYMENT_COMPLETED":
      case "BOOKING_PAYMENT_PAID_FOR_PROVIDER":
        return "bg-green-100 text-green-800 border-green-200";
      case "PAYMENT_REMINDER":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "BOOKING_COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "BOOKING_CANCELLED_BY_USER":
        return "bg-red-100 text-red-800 border-red-200";
      case "BOOKING_CREATED_FOR_PROVIDER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadNotifications}
          className="mt-3"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className={`text-sm font-medium truncate ${
                      !notification.isRead ? "text-blue-900" : "text-gray-900"
                    }`}>
                      {notification.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ml-2 flex-shrink-0 ${getTypeColor(notification.type)}`}
                    >
                      {notification.type.replace(/_/g, " ").toLowerCase()}
                    </Badge>
                  </div>

                  <p className={`text-sm mt-1 ${
                    !notification.isRead ? "text-blue-800" : "text-gray-600"
                  }`}>
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>

                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}