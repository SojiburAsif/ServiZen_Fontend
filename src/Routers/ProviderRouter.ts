import { Route } from "@/types/Router.type";
import {
    BarChart3,
    CalendarClock,
    CalendarDays,
    ClipboardList,
    CreditCard,
    Home,
    PlusSquare,
    Settings,
    Sparkles,
    Stethoscope,
    User,
    Wrench,
} from "lucide-react";

export const ProviderRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "Stats", url: "/dashboard/stats", icon: BarChart3 },
            { title: "Profile", url: "/dashboard/profile", icon: User },
            { title: "Bookings", url: "/dashboard/bookings", icon: CalendarDays },
            { title: "My Services", url: "/dashboard/my-services", icon: Stethoscope },
            { title: "Create Service", url: "/dashboard/create-service", icon: PlusSquare },
            { title: "Manage Services", url: "/dashboard/manage-services", icon: Wrench },
            { title: "Specialties", url: "/dashboard/specialties", icon: Sparkles },
            { title: "Reviews", url: "/dashboard/reviews", icon: ClipboardList },
            { title: "Earnings & Payouts", url: "/dashboard/earnings", icon: CreditCard },
            { title: "My Schedule", url: "/dashboard/schedule", icon: CalendarClock },
            { title: "Settings", url: "/dashboard/settings", icon: Settings }
        ],
    }
]