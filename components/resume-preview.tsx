import { FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ResumePreview() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
        <CardDescription>Preview and edit your resume</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="ats">ATS View</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-dashed">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Resume Preview</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">Upload a resume to see a preview here</p>
            </div>
          </TabsContent>
          <TabsContent value="ats" className="mt-4">
            <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-dashed">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">ATS View</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                See how your resume appears to Applicant Tracking Systems
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
