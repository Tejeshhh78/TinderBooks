"use client"

import { useRouter, usePathname } from "next/navigation"
import { BookOpen, User, Heart, MessageCircle, Library } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavBar() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: Library, label: "Books", path: "/books" },
    { icon: BookOpen, label: "Swipe", path: "/swipe" },
    { icon: Heart, label: "Matches", path: "/matches" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-none ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
