"use client"

import { useState } from "react"
import { Download, FileText, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CoverLetterEditorProps {
  className?: string
}

export function CoverLetterEditor({ className }: CoverLetterEditorProps) {
  const [content, setContent] = useState<string>(
    `Dear Hiring Manager,

I am writing to express my interest in the Frontend Developer position at TechCorp. With over 5 years of experience in web development, I am confident that my skills and expertise make me an excellent candidate for this role.

Throughout my career, I have focused on creating responsive, user-friendly web applications using modern JavaScript frameworks like React and Next.js. My experience includes:

- Developing and maintaining complex web applications
- Implementing responsive designs and ensuring cross-browser compatibility
- Collaborating with designers and backend developers to deliver high-quality products
- Optimizing applications for maximum speed and scalability

I am particularly drawn to TechCorp because of your commitment to innovation and your focus on creating products that solve real-world problems. I believe that my technical skills and passion for creating exceptional user experiences align perfectly with your company's mission.

I am excited about the opportunity to bring my skills to TechCorp and contribute to your team. Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to your organization.

Sincerely,
John Doe`,
  )

  const templates = [
    { id: 1, name: "Standard" },
    { id: 2, name: "Creative" },
    { id: 3, name: "Technical" },
    { id: 4, name: "Career Change" },
    { id: 5, name: "Recent Graduate" },
  ]

  const tones = [
    { id: 1, name: "Professional" },
    { id: 2, name: "Conversational" },
    { id: 3, name: "Enthusiastic" },
    { id: 4, name: "Formal" },
    { id: 5, name: "Confident" },
  ]

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Frontend Developer - TechCorp</CardTitle>
            <CardDescription>Last edited: May 16, 2023</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.id} value={tone.id.toString()}>
                        {tone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content</label>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Sparkles className="h-4 w-4" /> AI Enhance
                </Button>
              </div>
              <textarea
                className="h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-950">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Frontend Developer</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>john.doe@example.com</p>
                  <p>(555) 123-4567</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>
              <div className="whitespace-pre-line text-sm">{content}</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="gap-1">
          <FileText className="h-4 w-4" /> Generate from Resume
        </Button>
        <Button className="gap-1">
          <Sparkles className="h-4 w-4" /> AI Suggestions
        </Button>
      </CardFooter>
    </Card>
  )
}
