import { Route } from "@/types/Router.type";

export const UserRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard" },
            { title: "Stats", url: "/dashboard/stats" },
            { title: "Profile", url: "/dashboard/profile" },
            { title: "My Bookings", url: "/dashboard/bookings" },
            { title: "Payments", url: "/dashboard/payments" },
            { title: "My Reviews", url: "/dashboard/reviews" },
            { title: "Support Tickets", url: "/dashboard/support" },
            { title: "Settings", url: "/dashboard/settings" }
        ],
    }
]