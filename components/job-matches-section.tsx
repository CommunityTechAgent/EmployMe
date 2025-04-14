import { ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface JobMatchesSectionProps {
  className?: string
}

export function JobMatchesSection({ className }: JobMatchesSectionProps) {
  const jobMatches = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA (Remote)",
      matchPercentage: 92,
      salary: "$120K - $150K",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "New York, NY (Hybrid)",
      matchPercentage: 87,
      salary: "$110K - $140K",
      posted: "1 day ago",
      skills: ["Node.js", "React", "MongoDB", "Express"],
    },
    {
      id: 3,
      title: "UI/UX Developer",
      company: "DesignHub",
      location: "Austin, TX (Remote)",
      matchPercentage: 85,
      salary: "$100K - $130K",
      posted: "3 days ago",
      skills: ["Figma", "React", "CSS", "User Testing"],
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Job Matches</CardTitle>
          <CardDescription>Based on your skills and preferences</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {jobMatches.map((job) => (
          <div key={job.id} className="flex flex-col gap-2 rounded-lg border p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.company} • {job.location}
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> {job.matchPercentage}% Match
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{job.salary}</span>
              <span className="text-muted-foreground">{job.posted}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="w-full">
                Apply Now
              </Button>
              <Button size="sm" variant="outline">
                Save
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Find More Matches
        </Button>
      </CardFooter>
    </Card>
  )
}
