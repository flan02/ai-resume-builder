import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { storeLanguagePicker, storePremiumModal } from "@/zustand/store"
import { canUseCustomizations } from "@/lib/permissions"
import { PaletteIcon } from "lucide-react"
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color"
import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider"

interface ColorPickerProps {
  color: Color | undefined
  onChange: ColorChangeHandler
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {

  const subscriptionLevel = useSubscriptionLevel()
  const premiumModal = storePremiumModal()
  const [showPopover, setShowPopover] = useState(false)
  const { language, setLanguage } = storeLanguagePicker()
  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Modifica el color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true)
              return
            }
            setShowPopover(true)
          }}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-none bg-transparent shadow-none" align="end" >
        <TwitterPicker color={color} onChange={onChange} triangle="top-right" />
      </PopoverContent>
      <Popover>
        <button className="border dark:bg-[#111] dark:text-white rounded-md px-2 py-1.5 bg-transparent uppercase text-sm" onClick={() => setLanguage(language === "en" ? "es" : "en")}>{language}</button>
      </Popover>
    </Popover>
  );
}