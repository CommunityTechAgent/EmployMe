"use client"

import { useState } from "react"
import { Plus, X, Edit, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function SkillsManager() {
  const [newSkill, setNewSkill] = useState("")

  const technicalSkills = [
    { name: "JavaScript", level: 90, years: 5, highlighted: true },
    { name: "TypeScript", level: 85, years: 3, highlighted: true },
    { name: "React", level: 90, years: 4, highlighted: true },
    { name: "Next.js", level: 80, years: 2, highlighted: true },
    { name: "HTML", level: 95, years: 6, highlighted: false },
    { name: "CSS", level: 85, years: 6, highlighted: false },
    { name: "Tailwind CSS", level: 90, years: 3, highlighted: true },
    { name: "Node.js", level: 75, years: 3, highlighted: false },
    { name: "Git", level: 85, years: 5, highlighted: false },
  ]

  const softSkills = [
    { name: "Communication", level: 85, highlighted: true },
    { name: "Teamwork", level: 90, highlighted: true },
    { name: "Problem Solving", level: 95, highlighted: true },
    { name: "Time Management", level: 80, highlighted: false },
    { name: "Leadership", level: 75, highlighted: false },
    { name: "Adaptability", level: 85, highlighted: false },
  ]

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      // Add skill logic would go here
      setNewSkill("")
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skills Management</CardTitle>
        <CardDescription>Add, edit, and highlight your skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Input
            placeholder="Add a new skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddSkill()
              }
            }}
          />
          <Button onClick={handleAddSkill}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Skill</span>
          </Button>
        </div>

        <Tabs defaultValue="technical">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="technical">Technical Skills</TabsTrigger>
            <TabsTrigger value="soft">Soft Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="technical" className="mt-4 space-y-4">
            {technicalSkills.map((skill) => (
              <div key={skill.name} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{skill.name}</span>
                    {skill.highlighted && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit {skill.name}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {skill.name}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Proficiency:</span>
                  <Progress value={skill.level} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{skill.level}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {skill.years} {skill.years === 1 ? "year" : "years"} of experience
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="soft" className="mt-4 space-y-4">
            {softSkills.map((skill) => (
              <div key={skill.name} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{skill.name}</span>
                    {skill.highlighted && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit {skill.name}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {skill.name}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Proficiency:</span>
                  <Progress value={skill.level} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{skill.level}%</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Import Skills from Resume
        </Button>
      </CardFooter>
    </Card>
  )
}
