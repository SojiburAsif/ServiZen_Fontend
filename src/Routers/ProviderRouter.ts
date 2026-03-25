import { Route } from "@/types/Router.type";
import {
    CalendarClock,
    CalendarDays,
    ClipboardList,
    CreditCard,
    Building,
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
            { title: "My Profile", url: "/dashboard/my-profile", icon: User },
            { title: "My Provider Profile", url: "/dashboard/provider-profile", icon: Building },
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