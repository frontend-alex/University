import { Router } from "express";
import { handleStripeWebhook } from "../../webhooks/stripeWebhookHandler";

const router = Router();

router.post("/webhook", (req, res, next) => {
  Promise.resolve(handleStripeWebhook(req, res)).catch(next);
});

export { router as publicStripeRoutes };
