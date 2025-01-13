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
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={previousStep ? () => setCurrentStep(previousStep) : undefined}
            disabled={!previousStep}
          >
            Atras
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Siguiente
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className="md:hidden"
          title={showSmResumePreview ? "Show input form" : "Show resume preview"}
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" asChild>
            <Link href="/resumes">Cerrar</Link>
          </Button>
          <p className={cn("text-muted-foreground opacity-0", isSaving && "opacity-100")}
          >
            Guardando...
          </p>
        </div>
      </div>
    </footer>
  );
}