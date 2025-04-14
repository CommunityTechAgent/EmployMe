import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, John! Here's your job search overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input type="search" placeholder="Search..." className="w-[200px] md:w-[300px]" />
          </div>
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
