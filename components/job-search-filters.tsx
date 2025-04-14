import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface JobSearchFiltersProps {
  className?: string
}

export function JobSearchFilters({ className }: JobSearchFiltersProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Refine your job search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-title">Job Title</Label>
          <Input id="job-title" placeholder="e.g. Frontend Developer" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="e.g. San Francisco, CA" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-type">Job Type</Label>
          <Select defaultValue="all">
            <SelectTrigger id="job-type">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select defaultValue="all">
            <SelectTrigger id="experience">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="salary-range">Salary Range</Label>
            <span className="text-sm text-muted-foreground">$50k - $150k+</span>
          </div>
          <Slider id="salary-range" defaultValue={[50, 150]} max={200} step={5} className="py-4" />
        </div>

        <div className="space-y-3">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">JavaScript</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="outline">+ Add Skill</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Work Environment</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="remote" />
              <label
                htmlFor="remote"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remote
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hybrid" />
              <label
                htmlFor="hybrid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hybrid
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="onsite" />
              <label
                htmlFor="onsite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                On-site
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="match-skills" />
          <Label htmlFor="match-skills">Only show jobs matching my skills</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button>Apply Filters</Button>
      </CardFooter>
    </Card>
  )
}
