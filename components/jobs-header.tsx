import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function JobsHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Job Search</h1>
          <p className="text-sm text-muted-foreground">Find and apply to jobs that match your skills</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search jobs..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button>Save Search</Button>
        </div>
      </div>
    </div>
  )
}
