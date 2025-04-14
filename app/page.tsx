import { DashboardHeader } from "@/components/dashboard-header"
import { JobMatchesSection } from "@/components/job-matches-section"
import { ApplicationHistorySection } from "@/components/application-history-section"
import { RecentActivitySection } from "@/components/recent-activity-section"
import { UpcomingInterviewsSection } from "@/components/upcoming-interviews-section"
import { StatsCards } from "@/components/stats-cards"

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="container grid gap-6 px-4 py-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCards />
        <JobMatchesSection className="md:col-span-2 lg:col-span-2" />
        <ApplicationHistorySection className="md:col-span-2 lg:col-span-1" />
        <UpcomingInterviewsSection className="md:col-span-1 lg:col-span-1" />
        <RecentActivitySection className="md:col-span-1 lg:col-span-2" />
      </div>
    </div>
  )
}
