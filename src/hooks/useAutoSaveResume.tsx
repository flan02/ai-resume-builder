import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import useDebounce from "@/hooks/useDebounce"
import { fileReplacer } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "@/server-actions/actions"

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams()

  const { toast } = useToast()
  const debouncedResumeData = useDebounce(resumeData, 1500)

  const [resumeId, setResumeId] = useState(resumeData.id)

  const [lastSavedData, setLastSavedData] = useState(structuredClone(resumeData)) // ? Clone the resume data (We dont need to import because it is a global function available in the browser)
  // * We need a deep clone of the resume data to compare it with the last saved data.

  const [isSaving, setIsSaving] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsError(false)
  }, [debouncedResumeData])

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true)
        setIsError(false)
        // ? artificial delayer (it pretends that we are sending the data to the server)
        // await new Promise((resolve) => setTimeout(resolve, 1500))

        const newData = structuredClone(debouncedResumeData)

        const updatedResume = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined
          }),
          id: resumeId
        })

        setResumeId(updatedResume.id)
        setLastSavedData(newData)

        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set("resumeId", updatedResume.id)
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          )
        }
      } catch (error) {
        setIsError(true)
        console.error(error)
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false)
      }
    }

    // ! DELETE IT LATER
    console.log("debouncedResumeData", JSON.stringify(debouncedResumeData, fileReplacer))
    console.log("lastSavedData", JSON.stringify(lastSavedData, fileReplacer));

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer)

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save() // ? Asynchronous fc declared above to save the resume data
    }
  }, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId, searchParams, toast])

  return {
    isSaving,
    hasUnsavedChanges: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData)
  }
}