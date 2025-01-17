import LoadingButton from "@/components/reutilizable/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storePremiumModal } from "@/zustand/store";
import { canUseAITools } from "@/lib/permissions";
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { generateWorkExperience } from "@/server-actions/actions";

interface GenerateWorkExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

export default function GenerateWorkExperienceButton({ onWorkExperienceGenerated }: GenerateWorkExperienceButtonProps) {

  const subscriptionLevel = useSubscriptionLevel()
  const premiumModal = storePremiumModal()
  const [showInputDialog, setShowInputDialog] = useState(false)

  return (
    <>
      <Button variant="outline" type="button"
        onClick={() => {
          if (!canUseAITools(subscriptionLevel)) {
            premiumModal.setOpen(true);
            return
          }
          setShowInputDialog(true)
        }}
      >
        <WandSparklesIcon className="size-4" />
        Autocompletado (IA)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={(workExperience) => {
          onWorkExperienceGenerated(workExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

// * Subcomponent InputDialog that we will use in GenerateWorkExperienceButton
interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

function InputDialog({ open, onOpenChange, onWorkExperienceGenerated }: InputDialogProps) {
  const { toast } = useToast()

  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: ""
    }
  })

  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const response = await generateWorkExperience(input)
      onWorkExperienceGenerated(response)
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Algo salio mal. Por favor intenta nuevamente.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generar experiencia laboral</DialogTitle>
          <DialogDescription>
            Describe esta experiencia laboral y la IA generará una entrada optimizada.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Ej: "Desde noviembre 2020 hasta diciembre 2024, trabaje en CVAI como programador, mis tareas fueron: ..."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generar (IA)
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}