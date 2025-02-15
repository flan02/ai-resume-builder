import { Button } from "@/components/ui/button"
import { storePremiumModal } from "@/zustand/store"
import { canUseCustomizations } from "@/lib/permissions"
import { Circle, Square, Squircle } from "lucide-react"
import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider"

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle"
}

const borderStyles = Object.values(BorderStyles)

interface BorderStyleButtonProps {
  borderStyle: string | undefined
  onChange: (borderStyle: string) => void
}

export default function BorderStyleButton({ borderStyle, onChange }: BorderStyleButtonProps) {

  const subscriptionLevel = useSubscriptionLevel()
  const premiumModal = storePremiumModal()

  function handleClick() {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true)
      return
    }

    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0
    const nextIndex = (currentIndex + 1) % borderStyles.length
    onChange(borderStyles[nextIndex])
  }

  const Icon = borderStyle === "square"
    ? Square
    : borderStyle === "circle"
      ? Circle
      : Squircle

  return (
    <Button variant="outline" size="icon" title="Modifica borde de la imagen" onClick={handleClick} >
      <Icon className="size-5" />
    </Button>
  )
}