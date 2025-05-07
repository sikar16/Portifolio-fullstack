
import { AppSidebar } from "@/components/serviceProvider/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function Dashboard_layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <SidebarTrigger />
                <Outlet /> {/* This replaces children */}
            </main>
        </SidebarProvider>
    )
}
