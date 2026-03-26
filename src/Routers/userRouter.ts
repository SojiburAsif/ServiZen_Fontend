import { Route } from "@/types/Router.type";
import {
    CalendarDays,
    CircleHelp,
    ClipboardList,
    CreditCard,
    Home,
    User,
    Bell,
} from "lucide-react";

export const UserRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "My Profile", url: "/dashboard/my-profile", icon: User },
            { title: "My Bookings", url: "/dashboard/bookings", icon: CalendarDays },
            { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
            { title: "My Reviews", url: "/dashboard/reviews", icon: ClipboardList },
            { title: "Support Tickets", url: "/dashboard/support", icon: CircleHelp },
            { title: "Notifications", url: "/dashboard/notifications", icon: Bell }
        ],
    }
]