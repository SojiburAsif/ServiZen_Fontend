import { Route } from "@/types/Router.type";
import {
    CalendarDays,
    CircleHelp,
    ClipboardList,
    CreditCard,
    Home,
    User,
    Bell,
    MessageSquarePlus,
} from "lucide-react";

export const UserRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "My Bookings", url: "/dashboard/my-bookings", icon: CalendarDays },
            { title: "My Payments", url: "/dashboard/my-payments", icon: CreditCard },
            { title: "My Reviews", url: "/dashboard/my-reviews", icon: ClipboardList },
            { title: "Add Review", url: "/dashboard/add-review", icon: MessageSquarePlus },
            { title: "Notifications", url: "/dashboard/client-notifications", icon: Bell }
        ],
    }
]