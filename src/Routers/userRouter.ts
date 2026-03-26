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
            { title: "My Bookings", url: "/dashboard/my-bookings", icon: CalendarDays },
            { title: "My Payments", url: "/dashboard/my-payments", icon: CreditCard },
            { title: "My Reviews", url: "/dashboard/my-reviews", icon: ClipboardList },
            { title: "Notifications", url: "/dashboard/notifications", icon: Bell }
        ],
    }
]