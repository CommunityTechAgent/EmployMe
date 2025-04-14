import { Button } from "@/components/ui/button"

export function CoverLettersHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Cover Letters</h1>
          <p className="text-sm text-muted-foreground">Create and manage your cover letters</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>Create New</Button>
        </div>
      </div>
    </div>
  )
}
