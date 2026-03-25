import { Route } from "@/types/Router.type";
import {
    BarChart3,
    CalendarCheck,
    ClipboardList,
    CreditCard,
    Home,
    Settings,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    UserCog,
    Users,
    UserSquare2,
} from "lucide-react";

export const AdminRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "Stats", url: "/dashboard/stats", icon: BarChart3 },
            { title: "Create Provider", url: "/dashboard/CreateProvider", icon: Settings },
            { title: "Admin Profile", url: "/dashboard/profile", icon: UserCog },
            { title: "All Users", url: "/dashboard/users", icon: Users },
            { title: "All Providers", url: "/dashboard/providers", icon: UserSquare2 },
            { title: "All Services", url: "/dashboard/services", icon: Stethoscope },
            { title: "All Bookings", url: "/dashboard/bookings", icon: CalendarCheck },
            { title: "Specialties", url: "/dashboard/specialties", icon: Sparkles },
            { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
            { title: "Reviews & Ratings", url: "/dashboard/reviews", icon: ClipboardList },
            { title: "Financial Reports", url: "/dashboard/reports", icon: ShieldCheck },
        ],
    }
]