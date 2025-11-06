"use client";

import type * as React from "react";
import {
  IconBook,
  IconHeart,
  IconUser,
  IconBooks,
  IconCompass,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Discover",
      url: "/discover",
      icon: IconCompass,
    },
    {
      title: "My Books",
      url: "/my-books",
      icon: IconBooks,
    },
    {
      title: "Matches",
      url: "/matches",
      icon: IconHeart,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconBook className="!size-5" />
                <span className="text-base font-semibold">BookSwap</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
