"use client";

import { NotificationList } from "@/components/modules/dashboard/notification-list";
import { useEffect, useState } from "react";
import { jwtUtils } from "@/lib/jwtUtils";

export default function ClientNotificationsPage() {
  const [userRole, setUserRole] = useState<"USER" | "PROVIDER" | "ADMIN">("USER");

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (token) {
      const decoded = jwtUtils.decodedToken(token);
      const role = (decoded?.role as string) || "USER";
      setUserRole(role === "CLIENT" ? "USER" : (role as "USER" | "PROVIDER" | "ADMIN"));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with your service bookings and important messages.</p>
      </div>

      <NotificationList userRole={userRole} />
    </div>
  );
}