"use client";

import LoadingButton from "@/components/reutilizable/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCustomerPortalSession } from "@/server-actions/actions";

export default function ManageSubscriptionButton() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false)

  async function handleClick() {
    try {
      setLoading(true)
      const redirectUrl = await createCustomerPortalSession()
      window.location.href = redirectUrl
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        description: "Algo salio mal, por favor intenta de nuevo."
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton onClick={handleClick} loading={loading}>
      ver suscripcion
    </LoadingButton>
  )
}