"use client";

import { useLocation, useNavigate } from "react-router-dom";  // Import from react-router-dom
import {
    Home,
    Inbox,
    Code,
    Briefcase,
    GraduationCap,
    Award,
    MessageSquare,
    BookOpen,
    LogOut
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

const items = [
    { title: "Profile", url: "/dashboard/profile", icon: Home },
    { title: "Service", url: "/dashboard/service", icon: Inbox },
    { title: "Skill", url: "/dashboard/skill", icon: Code },
    { title: "Project", url: "/dashboard/project", icon: Briefcase },
    { title: "Education", url: "/dashboard/education", icon: GraduationCap },
    { title: "Experience", url: "/dashboard/expriance", icon: Award },
    { title: "Testimony", url: "/dashboard/testimony", icon: MessageSquare },
    { title: "Blog", url: "/dashboard/blog", icon: BookOpen },
];

export function AppSidebar() {
    const location = useLocation();  // Get the current location
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
            <SidebarContent className="bg-[hsl(var(--primary))] flex flex-col min-h-screen">
                <SidebarGroup className="text-white gap-4 mt-6 flex-grow">
                    <SidebarGroupLabel className="text-[hsl(var(--accent))] text-xl">Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={isActive ? "bg-[hsl(var(--accent))] text-white rounded-md" : ""}
                                    >
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} className="flex items-center gap-3 p-3">
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-sm">{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                            <div className="pt-4 border-t border-white/20">
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
