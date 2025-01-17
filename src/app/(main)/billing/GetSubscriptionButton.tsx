"use client";

import { Button } from "@/components/ui/button";
import { storePremiumModal } from "@/zustand/store";

export default function GetSubscriptionButton() {
  const premiumModal = storePremiumModal()

  return (
    <Button onClick={() => premiumModal.setOpen(true)} variant="premium">
      Hazte Premium
    </Button>
  );
}