"use client"

import * as React from "react"
import {
  IconSettings,
  IconUsers,
  IconFileDescription,
  IconCalendarEvent,
  IconSchool,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { AdminNavUser } from "@/components/admin-nav-user"
import { AdminNavMain } from "@/components/admin-nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@bhvenglish.com",
    avatar: "/bhv-english-logo-transparent.png",
  },
  navMain: [
    {
      title: "Đăng ký khóa học",
      url: "#courses",
      icon: IconFileDescription,
    },
    {
      title: "Đăng ký thành viên Hội Thảo",
      url: "#members",
      icon: IconUsers,
    },
    {
      title: "Đăng ký tư vấn",
      url: "#consultations",
      icon: IconCalendarEvent,
    },
    {
      title: "IELTS Test Management",
      url: "#ielts",
      icon: IconSchool,
    },
    {
      title: "Cài đặt",
      url: "#settings",
      icon: IconSettings,
    },
  ],
}

interface AdminSidebarProps {
  onLogout: () => void
  currentTab: string
  onTabChange: (tab: string) => void
}

export function AdminSidebar({ onLogout, currentTab, onTabChange, ...props }: AdminSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2">
                <img 
                  src="/bhv-english-logo-transparent.png" 
                  alt="BHV English Logo" 
                  className="size-8 object-contain"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BHV English</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain 
          items={data.navMain.map(item => ({
            ...item,
            isActive: currentTab === item.url.replace('#', ''),
            onClick: () => onTabChange(item.url.replace('#', ''))
          }))} 
        />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={data.user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
