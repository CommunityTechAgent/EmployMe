import { Button } from "@/components/ui/button"

export function SkillsHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Skills Management</h1>
          <p className="text-sm text-muted-foreground">Manage and optimize your skills for better job matches</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>Add New Skill</Button>
        </div>
      </div>
    </div>
  )
}
