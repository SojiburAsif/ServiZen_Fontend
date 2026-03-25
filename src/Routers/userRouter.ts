import { Route } from "@/types/Router.type";
import {
    BarChart3,
    CalendarDays,
    CircleHelp,
    ClipboardList,
    CreditCard,
    Home,
    Settings,
    User,
} from "lucide-react";

export const UserRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "Stats", url: "/dashboard/stats", icon: BarChart3 },
            { title: "Profile", url: "/dashboard/profile", icon: User },
            { title: "My Bookings", url: "/dashboard/bookings", icon: CalendarDays },
            { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
            { title: "My Reviews", url: "/dashboard/reviews", icon: ClipboardList },
            { title: "Support Tickets", url: "/dashboard/support", icon: CircleHelp },
            { title: "Settings", url: "/dashboard/settings", icon: Settings }
        ],
    }
]