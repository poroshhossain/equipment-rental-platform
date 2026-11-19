import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"




export default function DashboardSidebar() {

    const dashboardSidebarItemsByRole = {
        customer: [
            
            {
                title: "dashboard",
                href: "/dashboard",
            },
            
            {
                title: "My Rentals",
                href: "/dashboard/my-rentals",
            },

            {
                title: "Favorites",
                href: "/dashboard/favorites",
            },

            {
                title: "Profile",
                href: "/dashboard/profile",
            },
        ],
        owner: [
            
            {
                title: "Dashboard",
                href: "/dashboard",
            },

            {
                title: "Add Equipment",
                href: "/dashboard/add-equipment",
            },

            {
                title: "My Equipment",
                href: "/dashboard/my-equipment",
            },

            {
                title: "My Equipment Rental",
                href: "/dashboard/my-equipment-rentals",
            },

            {
                title: "My Profile",
                href: "/dashboard/my-profile",
            },
        ],
        admin: [
            
            {
                title: "Dashboard",
                href: "/dashboard",
            },

            {
                title: "All Users",
                href: "/dashboard/all-users",
            },

            {
                title: "All Equipment",
                href: "/dashboard/all-equipment",
            },

            {
                title: "All Rentals",
                href: "/dashboard/all-rentals",
            },

            {
                title: "My Profile",
                href: "/dashboard/my-profile",
            },

        ],
    }
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}