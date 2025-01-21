import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import Link from "next/link";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string
  showSmResumePreview: boolean
  isSaving: boolean
  setCurrentStep: (step: string) => void
  setShowSmResumePreview: (show: boolean) => void
}

export default function Footer({ currentStep, setCurrentStep, showSmResumePreview, setShowSmResumePreview, isSaving }: FooterProps) {

  const previousStep = steps.find((_, index) => steps[index + 1]?.key === currentStep)?.key
  const nextStep = steps.find((_, index) => steps[index - 1]?.key === currentStep)?.key

  return (
    <footer className="w-full border-t px-3 py-0 lg:py-5 bg-gray-50/70 dark:bg-gray-900/70">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-0 md:gap-3">
        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={previousStep ? () => setCurrentStep(previousStep) : undefined}
            disabled={!previousStep}
            className="px-3 text-xs lg:text-md"
          >
            Atras
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
            className="px-2 text-xs lg:text-md"
          >
            Siguiente
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className="md:hidden mt-4 lg:mt-0"
          title={showSmResumePreview ? "Mostrar input del form" : "Mostrar vista previa"}
        >
          {showSmResumePreview ? <PenLineIcon className="mt-4" /> : <FileUserIcon className="" />}
        </Button>
        <div className="flex items-center gap-3 mt-4">
          <Button variant="secondary" className="text-xs lg:text-md bg-gray-400 text-white hover:bg-gray-500/80" asChild>
            <Link href="/resumes">Cerrar</Link>
          </Button>
          <p className={cn("text-muted-foreground opacity-0 font-bold text-xs lg:text-md mx-2", isSaving && "opacity-100")}>Guardando...</p>
        </div>
      </div>
    </footer>
  );
}