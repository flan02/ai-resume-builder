import { create } from "zustand"

interface PremiumModalState {
  open: boolean
  setOpen: (open: boolean) => void
}

interface AddPhotoState {
  showImage: boolean
  setShowImage: (show: boolean) => void
}

interface LanguagePickerState {
  language: "en" | "es"
  setLanguage: (language: "en" | "es") => void
}

export const storePremiumModal = create<PremiumModalState>((set) => ({ open: false, setOpen: (open: boolean) => set({ open }) }))
export const storeAddPhoto = create<AddPhotoState>((set) => ({ showImage: true, setShowImage: (show: boolean) => set({ showImage: show }) }))
export const storeLanguagePicker = create<LanguagePickerState>((set) => ({ language: "es", setLanguage: (language: "en" | "es") => set({ language }) }))