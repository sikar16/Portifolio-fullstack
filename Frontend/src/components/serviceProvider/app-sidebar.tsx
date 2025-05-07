"use client";

import { useLocation, useNavigate } from "react-router-dom";
import {
    Users,
    LogOut,

} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
    { title: "Users", url: "/dashboard_sp/users", icon: Users },
];

export function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.clear();
        navigate('/');

        alert('You have been logged out successfully');
    };

    return (
        <Sidebar>
            <SidebarContent className="bg-[hsl(var(--primary))]">
                <SidebarGroup className="text-white gap-4">
                    <SidebarGroupLabel className="text-white">Service Provider Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.url);
                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={isActive ? "bg-[hsl(var(--accent))] text-white rounded-md" : ""}
                                    >
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} className="flex items-center gap-2 p-2">
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-xs">{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}

                            <div className="pt-4 border-t">
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 p-2 w-full text-red-400 hover:text-red-300"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-xs">Logout</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </div>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}