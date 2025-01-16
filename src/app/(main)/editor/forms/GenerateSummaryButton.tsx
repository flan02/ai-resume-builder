import LoadingButton from "@/components/reutilizable/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "@/server-actions/actions";

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues;
  onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({ resumeData, onSummaryGenerated }: GenerateSummaryButtonProps) {

  const subscriptionLevel = useSubscriptionLevel()
  const premiumModal = usePremiumModal()

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!canUseAITools(subscriptionLevel)) {
      premiumModal.setOpen(true)
      return
    }

    try {
      setLoading(true)
      const aiResponse = await generateSummary(resumeData);
      onSummaryGenerated(aiResponse)
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Algo salio mal. Por favor intenta de nuevo."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      variant="outline"
      type="button"
      onClick={handleClick}
      loading={loading}
    >
      <WandSparklesIcon className="size-4" />
      Generar (IA)
    </LoadingButton>
  );
}