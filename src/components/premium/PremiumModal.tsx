"use client"

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { storePremiumModal } from "@/zustand/store";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCheckoutSession } from "@/server-actions/actions";

const premiumFeatures = ["Asistencia IA", "Autocompletado Inteligente", "Diseños Premium", "Hasta 10 curriculums"]
//const premiumPlusFeatures = ["Curriculums infinitos", "Diseños personalizados"]

export default function PremiumModal() {

  const { open, setOpen } = storePremiumModal() // ? it contains the state and the setter from the zustand store
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true)
      const redirectUrl = await createCheckoutSession(priceId)
      window.location.href = redirectUrl // * redirect to the stripe checkout
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        description: "Algo salio mal, por favor intenta de nuevo."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open)
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-2xl text-center">Diseña tu curriculum con Inteligencia Artificial</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p className="font-roboto text-muted-foreground text-sm lg:text-lg">Cambia tu suscripcion a premium para desbloquear mas herramientas.</p>
          <div className="flex justify-center">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="list-inside space-y-2">
                {
                  premiumFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 text-green-500" />
                      {feature}
                    </li>
                  ))
                }
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE
                  )
                }
                disabled={loading}
              >
                Hazte Premium
              </Button>
            </div>
            {/*<div className="mx-6 border-l" />
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium
              </h3>
              <ul className="list-inside space-y-2">
                {
                  premiumPlusFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 text-green-500" />
                      {feature}
                    </li>
                  ))
                }
              </ul>
               <Button
                variant="premium"
                ! Only in case we need to offer an extra plan
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Hazte Premium +
              </Button> 
          </div>*/}
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
}