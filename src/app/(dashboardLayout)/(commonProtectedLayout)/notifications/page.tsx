"use client";

import { useEffect, useState } from "react";
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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Mock notifications data - in real app this would come from API
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "New Booking Request",
            message: "You have received a new booking request for Plumbing Service from John Doe.",
            type: "info",
            read: false,
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            actionUrl: "/dashboard/bookings",
          },
          {
            id: "2",
            title: "Payment Received",
            message: "Payment of ৳2,500 has been credited to your wallet for completed service.",
            type: "success",
            read: false,
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
          },
          {
            id: "3",
            title: "Service Completed",
            message: "Your Electrical Repair service has been marked as completed by the provider.",
            type: "success",
            read: true,
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
          },
          {
            id: "4",
            title: "Profile Update Required",
            message: "Please update your provider profile to improve visibility and attract more clients.",
            type: "warning",
            read: false,
            createdAt: new Date(Date.now() - 259200000), // 3 days ago
            actionUrl: "/dashboard/provider-profile",
          },
          {
            id: "5",
            title: "New Review Received",
            message: "You have received a 5-star review from Jane Smith for your Cleaning Service.",
            type: "success",
            read: true,
            createdAt: new Date(Date.now() - 345600000), // 4 days ago
          },
          {
            id: "6",
            title: "System Maintenance",
            message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM. Services may be temporarily unavailable.",
            type: "info",
            read: true,
            createdAt: new Date(Date.now() - 432000000), // 5 days ago
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case "error":
        return <X className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
      case "error":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      default:
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>

            {/* Notifications Skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-white"
         style={{
           background: 'linear-gradient(135deg, #FAFAFA 0%, #E2F7D8 50%, #80F279 100%)'
         }}
         data-theme="light">

      {/* Dark mode background */}
      <div className="absolute inset-0 dark:block hidden"
           style={{
             background: 'linear-gradient(135deg, #050505 0%, #0a1f0a 50%, #052e05 100%)'
           }}>
      </div>

      {/* Abstract background letters */}
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none select-none pointer-events-none transform -rotate-6 z-0">
        S Z
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Notifications
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Stay updated with your latest activities and important alerts
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="px-3 py-1">
                    {unreadCount} unread
                  </Badge>
                )}
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Bell className="h-5 w-5" />
                  <span>Activity Feed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter notifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                      <SelectItem value="error">Errors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                    <Bell className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {filter === "unread" ? "No unread notifications" : "No notifications found"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {filter === "unread"
                      ? "You've read all your notifications. Check back later for new updates!"
                      : "You don't have any notifications matching your current filter."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`shadow-sm border transition-all duration-200 hover:shadow-md ${
                    notification.read
                      ? "bg-white dark:bg-black border-gray-200 dark:border-gray-700"
                      : `${getNotificationColor(notification.type)} border-l-4`
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`flex-shrink-0 mt-1 ${!notification.read ? "" : "opacity-60"}`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-lg font-semibold mb-2 ${
                                notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-900 dark:text-white"
                              }`}>
                                {notification.title}
                                {!notification.read && (
                                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    New
                                  </Badge>
                                )}
                              </h4>

                              <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-3 ${
                                notification.read ? "opacity-75" : ""
                              }`}>
                                {notification.message}
                              </p>

                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {format(notification.createdAt, "EEEE, MMMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => window.location.href = notification.actionUrl!}
                          >
                            View Details
                          </Button>
                        )}

                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          {notifications.length > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredNotifications.length}</span> of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{notifications.length}</span> notifications
                  {unreadCount > 0 && (
                    <> • <span className="font-semibold text-blue-600 dark:text-blue-400">{unreadCount}</span> unread</>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}