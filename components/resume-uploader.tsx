"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ResumeUploader() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState("")

  const handleUpload = () => {
    setUploadState("uploading")
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadState("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      handleUpload()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>Upload your resume to get started with job matching</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          {uploadState === "idle" ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
              <div className="rounded-full bg-muted p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Drag and drop your resume</p>
                <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files up to 5MB</p>
              </div>
              <Button asChild>
                <label>
                  Browse Files
                  <input type="file" className="sr-only" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
                </label>
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-md bg-muted p-2">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{fileName || "resume.pdf"}</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadState === "uploading"
                      ? `Uploading... ${progress}%`
                      : uploadState === "success"
                        ? "Upload complete"
                        : "Upload failed"}
                  </p>
                </div>
                {uploadState === "success" ? (
                  <div className="rounded-full bg-green-100 p-1 text-green-600 dark: bg-green-900 dark:text-green-400">
                    <Check className="h-5 w-5" />
                  </div>
                ) : uploadState === "error" ? (
                  <div className="rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                ) : null}
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={uploadState === "uploading"}>
          Cancel
        </Button>
        <Button disabled={uploadState === "uploading" || uploadState === "idle"}>Parse Resume</Button>
      </CardFooter>
    </Card>
  )
}
