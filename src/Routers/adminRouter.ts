import { Route } from "@/types/Router.type";

export const AdminRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard" },
            { title: "Stats", url: "/dashboard/stats" },
            { title: "Admin Profile", url: "/dashboard/profile" },
            { title: "All Users", url: "/dashboard/users" },
            { title: "All Providers", url: "/dashboard/providers" },
            { title: "All Services", url: "/dashboard/services" },
            { title: "All Bookings", url: "/dashboard/bookings" },
            { title: "Specialties", url: "/dashboard/specialties" },
            { title: "Payments", url: "/dashboard/payments" },
            { title: "Reviews & Ratings", url: "/dashboard/reviews" },
            { title: "Financial Reports", url: "/dashboard/reports" },
            { title: "Settings", url: "/dashboard/settings" }
        ],
    }
]