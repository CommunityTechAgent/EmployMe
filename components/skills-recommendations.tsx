import { ArrowRight, Plus, Sparkles, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SkillsRecommendations() {
  const trendingSkills = [
    {
      name: "React Native",
      category: "Mobile Development",
      jobGrowth: "+24%",
      relevance: "High",
    },
    {
      name: "GraphQL",
      category: "API Development",
      jobGrowth: "+18%",
      relevance: "Medium",
    },
    {
      name: "Docker",
      category: "DevOps",
      jobGrowth: "+32%",
      relevance: "High",
    },
    {
      name: "AWS",
      category: "Cloud",
      jobGrowth: "+28%",
      relevance: "High",
    },
  ]

  const recommendedSkills = [
    {
      name: "Vue.js",
      reason: "Complements your React skills",
      jobCount: 1245,
    },
    {
      name: "Jest",
      reason: "Testing framework for React",
      jobCount: 987,
    },
    {
      name: "Redux",
      reason: "State management for React",
      jobCount: 1532,
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skill Recommendations</CardTitle>
        <CardDescription>Skills that can improve your job matches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Trending Skills in Your Field
          </h3>
          <div className="space-y-3">
            {trendingSkills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-muted-foreground">{skill.category}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {skill.jobGrowth} job growth
                  </Badge>
                  <span className="text-xs text-muted-foreground">{skill.relevance} relevance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <ThumbsUp className="h-4 w-4 text-blue-500" />
            Recommended for You
          </h3>
          <div className="space-y-3">
            {recommendedSkills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-muted-foreground">{skill.reason}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{skill.jobCount} jobs</span>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add {skill.name}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-1">
          Explore More Skills <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
