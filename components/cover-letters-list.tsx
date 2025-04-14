"use client"

import { useState } from "react"
import { File, MoreHorizontal, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface CoverLettersListProps {
  className?: string
}

export function CoverLettersList({ className }: CoverLettersListProps) {
  const [selectedLetter, setSelectedLetter] = useState<number>(1)

  const coverLetters = [
    {
      id: 1,
      title: "Frontend Developer - TechCorp",
      createdAt: "May 15, 2023",
      updatedAt: "May 16, 2023",
    },
    {
      id: 2,
      title: "React Developer - AppWorks",
      createdAt: "May 20, 2023",
      updatedAt: "May 20, 2023",
    },
    {
      id: 3,
      title: "UI Engineer - DesignCraft",
      createdAt: "May 25, 2023",
      updatedAt: "May 26, 2023",
    },
    {
      id: 4,
      title: "General Template",
      createdAt: "June 1, 2023",
      updatedAt: "June 5, 2023",
    },
  ]

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Your Cover Letters</CardTitle>
        <CardDescription>{coverLetters.length} cover letters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input placeholder="Search cover letters..." />
        </div>
        <div className="space-y-2">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted",
                selectedLetter === letter.id && "bg-muted",
              )}
              onClick={() => setSelectedLetter(letter.id)}
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{letter.title}</p>
                  <p className="text-xs text-muted-foreground">Updated: {letter.updatedAt}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-1">
          <Plus className="h-4 w-4" /> Create New Cover Letter
        </Button>
      </CardFooter>
    </Card>
  )
}
