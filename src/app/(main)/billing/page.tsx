import { db } from "@/db";
import stripe from "@/lib/stripe";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import Stripe from "stripe";
import GetSubscriptionButton from "./GetSubscriptionButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Facturacion"
};

export default async function Page() {
  const session = await auth()

  if (!session) {
    return null
  }

  const subscription = await db.billingStripe.findUnique({
    where: {
      userId: session?.user?.id
    }
  })

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
      expand: ["product"]
    })
    : null

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Facturacion</h1>
      <p>
        Tu plan actual:{" "}
        <span className="font-bold">
          {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
        </span>
      </p>
      {
        subscription ? (
          <>
            {
              subscription.stripeCancelAtPeriodEnd && (
                <p className="text-destructive">
                  Tu suscripcion sera cancelada en{" "}
                  {formatDate(subscription.stripeCurrentPeriodEnd, "MMMM dd, yyyy")}
                </p>
              )
            }
            <ManageSubscriptionButton />
          </>
        ) : (
          <GetSubscriptionButton />
        )
      }
    </main>
  )
}