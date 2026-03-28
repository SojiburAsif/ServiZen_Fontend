import { NotificationList } from "@/components/modules/dashboard/notification-list";

export default function DashboardNotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Your <span className="text-green-600 dark:text-green-500">Notifications</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          Stay updated with your service bookings and important messages.
        </p>
      </div>

      <NotificationList />
    </div>
  );
}
