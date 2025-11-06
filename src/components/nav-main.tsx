"use client";

import type { Icon } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [hasNotif, setHasNotif] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setHasNotif(Boolean(data?.hasMatch || data?.hasMessage));
      })
      .catch(() => {});
    const id = setInterval(() => {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((data) => {
          if (!active) return;
          setHasNotif(Boolean(data?.hasMatch || data?.hasMessage));
        })
        .catch(() => {});
    }, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isMatches = item.title.toLowerCase() === "matches";
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url} className="relative">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {isMatches && hasNotif && (
                      <span
                        aria-label="notifications"
                        className={cn(
                          "absolute right-2 top-2 inline-block size-2 rounded-full bg-destructive",
                        )}
                      />
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
