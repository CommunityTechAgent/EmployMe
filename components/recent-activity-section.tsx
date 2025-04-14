import { ArrowRight, FileText, Mail, MessageSquare, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentActivitySectionProps {
  className?: string
}

export function RecentActivitySection({ className }: RecentActivitySectionProps) {
  const activities = [
    {
      id: 1,
      type: "application",
      icon: FileText,
      title: "Applied to Frontend Developer at WebSolutions Inc.",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "message",
      icon: MessageSquare,
      title: "Received a message from Sarah Thompson at TechCorp",
      time: "Yesterday",
      person: {
        name: "Sarah T",
        image: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 3,
      type: "interview",
      icon: Phone,
      title: "Completed phone interview with InnovateTech",
      time: "2 days ago",
    },
    {
      id: 4,
      type: "email",
      icon: Mail,
      title: "Sent follow-up email to DesignHub",
      time: "3 days ago",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest job search activities</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex">
                <div className="relative mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5" />
                  {activity.person && (
                    <Avatar className="absolute -bottom-1 -right-1 h-5 w-5 border border-background">
                      <AvatarImage src={activity.person.image} alt={activity.person.name} />
                      <AvatarFallback>{activity.person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  )
}
