"use client";

import { useLocation } from "react-router-dom";  // Import from react-router-dom
import {
    Home,
    Inbox,
    Code,
    Briefcase,
    GraduationCap,
    Award,
    MessageSquare,
    BookOpen
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

    return (
        <Sidebar>
            <SidebarContent className="bg-[hsl(var(--primary))]">
                <SidebarGroup className="text-white gap-4">
                    <SidebarGroupLabel className="text-white">Name dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={isActive ? "bg-[hsl(var(--accent))] text-white rounded-md " : ""}
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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
