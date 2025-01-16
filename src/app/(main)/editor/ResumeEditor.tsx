"use client"

import useUnloadWarning from "@/hooks/useUnloadWarning"
import { ResumeServerData } from "@/lib/types"
import { cn, mapToResumeValues } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Breadcrumbs from "./Breadcrumbs"
import Footer from "./Footer"
import ResumePreviewSection from "./ResumePreviewSection"
import { steps } from "./steps"
import useAutoSaveResume from "@/hooks/useAutoSaveResume"

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  const searchParams = useSearchParams();

  // const emptyResume = {
  //   id: '',
  //   title: '',
  //   description: '',
  //   photo: '',
  //   firstName: '',
  //   lastName: '',
  //   jobTitle: '',
  //   city: '',
  //   country: '',
  //   phone: '',
  //   email: '',
  //   workExperiences: [],
  //   educations: [],
  //   skills: [],
  //   borderStyle: '',
  //   colorHex: '',
  //   summary: ''
  // }

  const [resumeData, setResumeData] = useState<ResumeValues>(resumeToEdit ? mapToResumeValues(resumeToEdit) : {})

  const [showSmResumePreview, setShowSmResumePreview] = useState(false)

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData)

  useUnloadWarning(hasUnsavedChanges)

  const currentStep = searchParams.get("step") || steps[0].key

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("step", key)
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
  }

  const FormComponent = steps.find((step) => step.key === currentStep)?.component

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Diseña tu curriculum</h1>
        <p className="text-sm text-muted-foreground">
          Sigue los pasos a continuación para crear tu curriculum. Tu progreso
          sera guardado automaticamente.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {
              FormComponent && (
                <FormComponent
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
        isSaving={isSaving}
      />
    </div>
  );
}