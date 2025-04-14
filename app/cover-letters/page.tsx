import { CoverLettersHeader } from "@/components/cover-letters-header"
import { CoverLettersList } from "@/components/cover-letters-list"
import { CoverLetterEditor } from "@/components/cover-letter-editor"

export default function CoverLettersPage() {
  return (
    <div className="flex flex-col">
      <CoverLettersHeader />
      <div className="container grid gap-6 px-4 py-6 md:grid-cols-3">
        <CoverLettersList className="md:col-span-1" />
        <CoverLetterEditor className="md:col-span-2" />
      </div>
    </div>
  )
}
