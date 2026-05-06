import { config } from "../../config/config";
import { eventBus } from "../../events/EventBus";
import { STRIPE_EVENTS } from "../../events/stripe/stripe.events";
import { SubscriptionStatus, SubscriptionTier } from "../../models/user";
import { UserRepository } from "../../repositories/user/userRepository";
import { stripe } from "../../utils/stripe/stripe";

const userRepository = new UserRepository();

const tierMap: Record<string, SubscriptionTier> = {
  [config.STRIPE_PREMIUM_PRICE!]: SubscriptionTier.Premium,
  [config.STRIPE_PRO_PRICE!]: SubscriptionTier.Pro,
};

const toValidDate = (timestamp?: number): Date | undefined => {
  if (!timestamp) return undefined;
  const date = new Date(timestamp * 1000);
  return isNaN(date.getTime()) ? undefined : date;
};

eventBus.on(STRIPE_EVENTS.SUBSCRIPTION_CHANGED, async (subscription: any) => {
  try {
    const sessions = await stripe.checkout.sessions.list({
      subscription: subscription.id,
      limit: 1,
    });
    const session = sessions.data[0];
    if (!session) {
      console.error(
        `No checkout session found for subscription ${subscription.id}`
      );
      return;
    }

    const userId = session.client_reference_id || session.metadata?.userId;
    if (!userId) {
      console.error(
        `No userId found in checkout session for subscription ${subscription.id}`
      );
      return;
    }

    const priceId = subscription.items?.data?.[0]?.price?.id;
    const tier = tierMap[priceId] || SubscriptionTier.Free;

    const startedAt = toValidDate(subscription.start_date);
    const expiresAt = toValidDate(subscription.current_period_end);

    const updatedFields: Partial<Record<string, any>> = {
      "subscription.subscriptionId": subscription.id,
      "subscription.customerId": subscription.customer,
      "subscription.tier": tier,
      "subscription.status": subscription.status as SubscriptionStatus,
    };

    if (startedAt) updatedFields["subscription.startedAt"] = startedAt;
    if (expiresAt) updatedFields["subscription.expiresAt"] = expiresAt;

    await userRepository.update({ _id: userId }, updatedFields);
  } catch (error) {
    console.error("Error handling subscription change event:", error);
  }
});
