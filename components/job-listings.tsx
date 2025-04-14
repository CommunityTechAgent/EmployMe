"use client"

import { useState } from "react"
import { Bookmark, BookmarkCheck, Building, Clock, MapPin, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JobListingsProps {
  className?: string
}

export function JobListings({ className }: JobListingsProps) {
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSaveJob = (id: number) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]))
  }

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120K - $150K",
      posted: "2 days ago",
      matchPercentage: 92,
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      description:
        "We are looking for a Senior Frontend Developer to join our team. You will be responsible for developing and implementing user interface components using React.js and other frontend technologies.",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "New York, NY (Hybrid)",
      type: "Full-time",
      salary: "$110K - $140K",
      posted: "1 day ago",
      matchPercentage: 87,
      skills: ["Node.js", "React", "MongoDB", "Express"],
      description:
        "As a Full Stack Engineer, you will work on both the frontend and backend of our applications. You should have experience with JavaScript, Node.js, and React.",
    },
    {
      id: 3,
      title: "UI/UX Developer",
      company: "DesignHub",
      location: "Austin, TX (Remote)",
      type: "Full-time",
      salary: "$100K - $130K",
      posted: "3 days ago",
      matchPercentage: 85,
      skills: ["Figma", "React", "CSS", "User Testing"],
      description:
        "We're seeking a UI/UX Developer who can bridge the gap between design and implementation. You'll work closely with our design team to create beautiful and functional user interfaces.",
    },
    {
      id: 4,
      title: "Frontend Developer",
      company: "WebSolutions",
      location: "Chicago, IL (Remote)",
      type: "Contract",
      salary: "$80K - $100K",
      posted: "1 week ago",
      matchPercentage: 78,
      skills: ["JavaScript", "React", "HTML", "CSS"],
      description:
        "We are looking for a Frontend Developer to help build responsive and interactive web applications. You should have strong skills in JavaScript and React.",
    },
    {
      id: 5,
      title: "React Native Developer",
      company: "MobileApps Inc.",
      location: "Seattle, WA (Hybrid)",
      type: "Full-time",
      salary: "$110K - $135K",
      posted: "5 days ago",
      matchPercentage: 82,
      skills: ["React Native", "JavaScript", "TypeScript", "Mobile Development"],
      description:
        "Join our mobile development team to create cross-platform mobile applications using React Native. Experience with both iOS and Android development is a plus.",
    },
  ]

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>{jobs.length} jobs found matching your criteria</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option>Relevance</option>
              <option>Date Posted</option>
              <option>Salary</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="matched">Best Matches</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> {job.matchPercentage}% Match
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => toggleSaveJob(job.id)}>
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                      <span className="sr-only">{savedJobs.includes(job.id) ? "Unsave" : "Save"} job</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-sm">{job.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <Badge variant="outline">{job.type}</Badge>
                    <span className="ml-2 text-sm font-medium">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1">Apply Now</Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="matched" className="mt-4 space-y-4">
            {jobs
              .filter((job) => job.matchPercentage >= 85)
              .map((job) => (
                <div key={job.id} className="rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> {job.matchPercentage}% Match
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => toggleSaveJob(job.id)}>
                        {savedJobs.includes(job.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                        <span className="sr-only">{savedJobs.includes(job.id) ? "Unsave" : "Save"} job</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-sm">{job.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <Badge variant="outline">{job.type}</Badge>
                      <span className="ml-2 text-sm font-medium">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
          </TabsContent>
          <TabsContent value="saved" className="mt-4">
            {savedJobs.length > 0 ? (
              <div className="space-y-4">
                {jobs
                  .filter((job) => savedJobs.includes(job.id))
                  .map((job) => (
                    <div key={job.id} className="rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" /> {job.matchPercentage}% Match
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => toggleSaveJob(job.id)}>
                            <BookmarkCheck className="h-5 w-5 text-primary" />
                            <span className="sr-only">Unsave job</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-sm">{job.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <Badge variant="outline">{job.type}</Badge>
                          <span className="ml-2 text-sm font-medium">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button className="flex-1">Apply Now</Button>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Bookmark className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Saved Jobs</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't saved any jobs yet. Click the bookmark icon to save jobs for later.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">Page 1 of 5</div>
          <Button variant="outline">Next</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
