import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import * as db from "./db";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout session completed:", session.id);

        // Extract metadata
        const beatId = session.metadata?.beat_id;
        const userId = session.metadata?.user_id;
        const customerEmail = session.customer_details?.email || session.metadata?.customer_email;
        const customerName = session.customer_details?.name || session.metadata?.customer_name;

        if (!beatId || !customerEmail) {
          console.error("[Webhook] Missing required metadata in checkout session");
          break;
        }

        // Create purchase record
        await db.createPurchase({
          beatId: parseInt(beatId),
          buyerEmail: customerEmail,
          buyerName: customerName || undefined,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total || 0,
          status: "completed",
        });

        console.log(`[Webhook] Purchase recorded for beat ${beatId} by ${customerEmail}`);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment intent failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).send("Webhook processing failed");
  }
}
