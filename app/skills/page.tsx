import { SkillsHeader } from "@/components/skills-header"
import { SkillsManager } from "@/components/skills-manager"
import { SkillsRecommendations } from "@/components/skills-recommendations"

export default function SkillsPage() {
  return (
    <div className="flex flex-col">
      <SkillsHeader />
      <div className="container grid gap-6 px-4 py-6 md:grid-cols-2">
        <SkillsManager />
        <SkillsRecommendations />
      </div>
    </div>
  )
}
