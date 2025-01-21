"use client"

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { storePremiumModal } from "@/zustand/store";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCheckoutSession } from "@/server-actions/actions";

const premiumFeatures = ["Asistencia IA", "Autocompletado Inteligente", "Diseños Premium", "Hasta 6 plantillas", "Libre de anuncios", "Acceso a nuevas funciones"]
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
      <DialogContent className="py-8 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm lg:text-xl text-center td font-mono underline-offset-4 underline" >Crea tu curriculum con Inteligencia Artificial</DialogTitle>
          <DialogDescription className="font-roboto text-muted-foreground text-xs lg:text-sm">
            Cambia tu suscripción a premium para desbloquear más herramientas y mejorar tu experiencia.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">

          <div className="flex justify-center">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center font-mono text-lg lg:text-xl font-bold">Premium</h3>
              <ul className="list-inside space-y-2">
                {
                  premiumFeatures.map((feature) => (
                    <li key={feature} className="flex items-center text-xs lg:text-sm gap-2 text-blue-950 dark:td font-roboto">
                      <Check className="size-4 text-green-500" />
                      {feature}
                    </li>
                  ))
                }
              </ul>
              <Button
                className="text-xs lg:text-md"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE
                  )
                }
                // disabled={loading}
                disabled={true}
              >
                Hazte Premium
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog >
  )
}