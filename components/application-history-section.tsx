import { ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ApplicationHistorySectionProps {
  className?: string
}

export function ApplicationHistorySection({ className }: ApplicationHistorySectionProps) {
  const applications = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "WebSolutions Inc.",
      appliedDate: "May 15, 2023",
      status: "Rejected",
      statusIcon: XCircle,
      statusColor: "text-red-500",
    },
    {
      id: 2,
      title: "React Developer",
      company: "AppWorks",
      appliedDate: "May 20, 2023",
      status: "Accepted",
      statusIcon: CheckCircle,
      statusColor: "text-green-500",
    },
    {
      id: 3,
      title: "UI Engineer",
      company: "DesignCraft",
      appliedDate: "May 25, 2023",
      status: "In Progress",
      statusIcon: Clock,
      statusColor: "text-yellow-500",
    },
    {
      id: 4,
      title: "Full Stack Developer",
      company: "TechStack",
      appliedDate: "June 1, 2023",
      status: "In Progress",
      statusIcon: Clock,
      statusColor: "text-yellow-500",
    },
    {
      id: 5,
      title: "JavaScript Developer",
      company: "CodeCraft",
      appliedDate: "June 5, 2023",
      status: "In Progress",
      statusIcon: Clock,
      statusColor: "text-yellow-500",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Application History</CardTitle>
          <CardDescription>Track your job application progress</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-2">
        {applications.map((application) => {
          const StatusIcon = application.statusIcon
          return (
            <div key={application.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="grid gap-1">
                <div className="font-medium">{application.title}</div>
                <div className="text-sm text-muted-foreground">{application.company}</div>
                <div className="text-xs text-muted-foreground">Applied: {application.appliedDate}</div>
              </div>
              <Badge variant="outline" className={cn("flex items-center gap-1", application.statusColor)}>
                <StatusIcon className="h-3 w-3" />
                {application.status}
              </Badge>
            </div>
          )
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Applications
        </Button>
      </CardFooter>
    </Card>
  )
}
