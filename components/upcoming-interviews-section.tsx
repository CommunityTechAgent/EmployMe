import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface UpcomingInterviewsSectionProps {
  className?: string
}

export function UpcomingInterviewsSection({ className }: UpcomingInterviewsSectionProps) {
  const interviews = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Senior Frontend Developer",
      date: "June 15, 2023",
      time: "10:00 AM - 11:30 AM",
      type: "Technical Interview",
    },
    {
      id: 2,
      company: "InnovateTech",
      position: "Full Stack Engineer",
      date: "June 18, 2023",
      time: "2:00 PM - 3:00 PM",
      type: "HR Interview",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
        <CardDescription>Your scheduled interviews</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="grid gap-2 rounded-lg border p-3">
              <h3 className="font-semibold">{interview.company}</h3>
              <p className="text-sm">{interview.position}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{interview.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{interview.time}</span>
              </div>
              <div className="mt-2 rounded-md bg-muted px-2 py-1 text-xs">{interview.type}</div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="w-full">
                  Prepare
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Reschedule
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Interviews</h3>
            <p className="mt-2 text-sm text-muted-foreground">You don't have any upcoming interviews scheduled.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Calendar
        </Button>
      </CardFooter>
    </Card>
  )
}
