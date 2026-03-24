import { Route } from "@/types/Router.type";

export const ProviderRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard" },
            { title: "Stats", url: "/dashboard/stats" },
            { title: "Profile", url: "/dashboard/profile" },
            { title: "Bookings", url: "/dashboard/bookings" },
            { title: "My Services", url: "/dashboard/my-services" },
            { title: "Create Service", url: "/dashboard/create-service" },
            { title: "Manage Services", url: "/dashboard/manage-services" },
            { title: "Specialties", url: "/dashboard/specialties" },
            { title: "Reviews", url: "/dashboard/reviews" },
            { title: "Earnings & Payouts", url: "/dashboard/earnings" },
            { title: "My Schedule", url: "/dashboard/schedule" },
            { title: "Settings", url: "/dashboard/settings" }
        ],
    }
]