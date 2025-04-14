import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ParsedResumeData() {
  const personalInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
  }

  const experience = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      description: "Led the development of the company's main product...",
    },
    {
      title: "Frontend Developer",
      company: "WebSolutions",
      location: "San Francisco, CA",
      startDate: "Mar 2018",
      endDate: "Dec 2019",
      description: "Developed and maintained client websites...",
    },
  ]

  const education = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "Sep 2014",
      endDate: "May 2018",
    },
  ]

  const skills = ["JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Node.js", "Git"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parsed Resume Data</CardTitle>
        <CardDescription>Information extracted from your resume</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="mt-4 space-y-4">
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Name</h3>
              <p className="text-sm">{personalInfo.name}</p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Email</h3>
              <p className="text-sm">{personalInfo.email}</p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Phone</h3>
              <p className="text-sm">{personalInfo.phone}</p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Location</h3>
              <p className="text-sm">{personalInfo.location}</p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">LinkedIn</h3>
              <p className="text-sm">{personalInfo.linkedin}</p>
            </div>
            <Button className="mt-4">Edit Personal Information</Button>
          </TabsContent>
          <TabsContent value="experience" className="mt-4 space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <p className="mt-2 text-sm">{exp.description}</p>
              </div>
            ))}
            <Button>Add Experience</Button>
          </TabsContent>
          <TabsContent value="education" className="mt-4 space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} • {edu.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <Button>Add Education</Button>
          </TabsContent>
          <TabsContent value="skills" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0 hover:bg-muted">
                    <span className="sr-only">Remove {skill}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </Badge>
              ))}
            </div>
            <Button className="mt-4">Add Skills</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
