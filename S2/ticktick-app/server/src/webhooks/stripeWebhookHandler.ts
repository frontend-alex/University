import Stripe from "stripe";

import { Request, Response } from "express";
import { stripe } from "../utils/stripe/stripe";
import { eventBus } from "../events/EventBus";
import { STRIPE_EVENTS } from "../events/stripe/stripe.events";
import { config } from "../config/config";
import { logger } from "../services/loggerService";
import { createError } from "../middleware/errorHandler";

type StripeEventType =
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "checkout.session.completed"
  | string;

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    logger.warn("Missing or invalid stripe-signature header");
    return createError("STRIPE_SIGNATURE_MISSING");
  }

  const buf = (req as any).rawBody;
  if (!buf) {
    logger.error("Raw body is missing on request");
    return createError("STRIPE_RAW_BODY_MISSING");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      config.STRIPE_WEBHOOK_SECRET!
    );
    logger.info("Stripe webhook signature verified", { eventType: event.type });
  } catch (err) {
    logger.error("Webhook signature verification failed", { error: err });
    return createError("STRIPE_WEBHOOK_VERIFICATION_FAILED");
  }

  const eventType = event.type as StripeEventType;
  logger.info(`Received Stripe event`, { eventType });

  try {
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        logger.debug("Emitting subscription changed event");
        eventBus.emit(STRIPE_EVENTS.SUBSCRIPTION_CHANGED, event.data.object);
        break;
      }

      case "checkout.session.completed": {
        logger.debug("Handling checkout.session.completed event");

        const session = event.data.object as Stripe.Checkout.Session;

        if (typeof session.subscription === "string") {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription
            );
            eventBus.emit(STRIPE_EVENTS.SUBSCRIPTION_CHANGED, subscription);
          } catch (error) {
            logger.error("Failed to retrieve subscription from Stripe", {
              error,
            });
            return createError("STRIPE_SUBSCRIPTION_RETRIEVE_FAILED");
          }
        } else {
          logger.warn("Checkout session subscription ID not available yet", {
            sessionId: session.id,
          });
          return createError("STRIPE_SUBSCRIPTION_ID_NOT_AVAILABLE");
        }
        break;
      }

      default:
        logger.warn(`Unhandled Stripe event type received`, { eventType });
        return createError("STRIPE_UNHANDLED_EVENT", res);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    logger.error("Error processing Stripe webhook event", {
      error: err,
      eventType,
    });
    return createError("STRIPE_EVENT_PROCESSING_ERROR");
  }
};
