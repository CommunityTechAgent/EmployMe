import { ResumeHeader } from "@/components/resume-header"
import { ResumeUploader } from "@/components/resume-uploader"
import { ResumePreview } from "@/components/resume-preview"
import { ParsedResumeData } from "@/components/parsed-resume-data"

export default function ResumePage() {
  return (
    <div className="flex flex-col">
      <ResumeHeader />
      <div className="container grid gap-6 px-4 py-6 md:grid-cols-2">
        <div className="space-y-6">
          <ResumeUploader />
          <ParsedResumeData />
        </div>
        <ResumePreview />
      </div>
    </div>
  )
}
