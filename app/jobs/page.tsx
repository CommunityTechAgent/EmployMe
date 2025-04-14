import { JobsHeader } from "@/components/jobs-header"
import { JobSearchFilters } from "@/components/job-search-filters"
import { JobListings } from "@/components/job-listings"

export default function JobsPage() {
  return (
    <div className="flex flex-col">
      <JobsHeader />
      <div className="container grid gap-6 px-4 py-6 md:grid-cols-4">
        <JobSearchFilters className="md:col-span-1" />
        <JobListings className="md:col-span-3" />
      </div>
    </div>
  )
}
