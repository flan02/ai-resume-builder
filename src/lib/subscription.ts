import { env } from "@/env"
import { cache } from "react"
import { db } from "@/db"

export type SubscriptionLevel = "free" | "pro"  // "pro_plus"

export const getUserSubscriptionLevel = cache(async (userId: string): Promise<SubscriptionLevel> => {
  const subscription = await db.billingStripe.findUnique({
    where: {
      userId
    }
  })

  // if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
  //   return "free"
  // }
  if (!subscription) {
    return "free"
  }

  if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE) {
    return "pro"
  }

  // if (
  //   subscription.stripePriceId ===
  //   env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
  // ) {
  //   return "pro_plus"
  // }

  throw new Error("Invalid subscription")
})