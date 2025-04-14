"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, FileText, Briefcase, Award, Mail, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: BarChart,
      title: "Dashboard",
    },
    {
      href: "/resume",
      icon: FileText,
      title: "Resume",
    },
    {
      href: "/skills",
      icon: Award,
      title: "Skills",
    },
    {
      href: "/jobs",
      icon: Briefcase,
      title: "Jobs",
    },
    {
      href: "/cover-letters",
      icon: Mail,
      title: "Cover Letters",
    },
  ]

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-r bg-muted/40 p-3 md:w-64">
      <div className="flex flex-col gap-6">
        <div className="flex h-16 items-center px-2 md:px-4">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            <span className="hidden text-xl font-bold md:inline-block">JobTrack</span>
          </Link>
        </div>
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("justify-start", pathname === route.href && "bg-secondary")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                <span className="hidden md:inline-block">{route.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto grid gap-1 px-2">
        <Button variant="ghost" className="justify-start" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-5 w-5" />
            <span className="hidden md:inline-block">Settings</span>
          </Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <Link href="/profile">
            <User className="mr-2 h-5 w-5" />
            <span className="hidden md:inline-block">Profile</span>
          </Link>
        </Button>
        <div className="mt-6 flex items-center gap-2 rounded-lg px-2 py-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
