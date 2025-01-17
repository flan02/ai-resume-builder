
import { db } from "@/db";
import { env } from "@/env";
import stripe from "@/lib/stripe";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET)

    console.log(`Received event: ${event.type}`, event.data.object);

    switch (event.type) {
      // case "payment_intent.succeeded":
      //   await handlePayments(event.data.object as Stripe.PaymentIntent);
      //   break;
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

// * Utility functions

// ? In case you want to create payment system
// async function handlePayments(paymentIntent: Stripe.PaymentIntent) {
//   const paymentId = paymentIntent.id
//   try {
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
//     const isSuccessful = paymentIntent.status === "succeeded"
//     return {
//       success: isSuccessful,
//       amount: paymentIntent.amount_received / 100,
//       currency: paymentIntent.currency.toUpperCase()

//     }
//   } catch (error) {
//     console.error("Error al verificar el pago:", error);
//     return {
//       success: false,
//       amount: 0,
//       currency: null
//     }
//   }
// }

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  // await (
  //   await clerkClient()
  // ).users.updateUserMetadata(userId, {
  //   privateMetadata: {
  //     stripeCustomerId: session.customer as string,
  //   },
  // })
  const stripeCustomerId = session.customer as string

  await db.billingStripe.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: session.metadata?.priceId as string, // Si incluyes priceId en metadata
      stripeCurrentPeriodEnd: new Date(session.expires_at * 1000), // Timestamp a Date
      stripeCancelAtPeriodEnd: session.status === "expired" || false,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: session.metadata?.priceId as string, // Si incluyes priceId en metadata
      stripeCurrentPeriodEnd: new Date(session.expires_at * 1000),
      stripeCancelAtPeriodEnd: true || false
      // updatedAt: new Date()
    },
  })
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (subscription.status === "active" || subscription.status === "trialing" || subscription.status === "past_due") {
    await db.billingStripe.upsert({
      where: {
        userId: subscription.metadata.userId,
      },
      create: {
        userId: subscription.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } else {
    await db.billingStripe.deleteMany({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db.billingStripe.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    }
  })
}