import { Button } from "@/components/ui/button"

export function ResumeHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Resume Management</h1>
          <p className="text-sm text-muted-foreground">Upload, manage, and optimize your resume</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>Download Resume</Button>
        </div>
      </div>
    </div>
  )
}
