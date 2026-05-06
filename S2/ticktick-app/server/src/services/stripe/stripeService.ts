import { ObjectId } from "mongoose";
import { createError } from "../../middleware/errorHandler";
import { SubscriptionTier, SubscriptionStatus } from "../../models/user";
import { UserRepository } from "../../repositories/user/userRepository";
import { stripe } from "../../utils/stripe/stripe";
import { config } from "../../config/config";

export class StripeService {
  private userRepository = new UserRepository();

  public async createCheckoutSession(
    userId: ObjectId,
    tier: "pro" | "premium",
    isAnual: "monthly" | "annual"
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw createError("USER_NOT_FOUND");
  
    if (!user.subscription?.customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: userId.toString() },
      });
  
      await this.userRepository.update(
        { _id: userId },
        { "subscription.customerId": customer.id }
      );
  
      const {
        tier = SubscriptionTier.Free,
        status = SubscriptionStatus.Active,
        startedAt,
        expiresAt,
        trialEndsAt,
        subscriptionId,
        isLifetime = false,
      } = user.subscription || {};
  
      user.subscription = {
        tier,
        status,
        startedAt,
        expiresAt,
        trialEndsAt,
        subscriptionId,
        isLifetime,
        customerId: customer.id,
      };
    }
  
    let priceId: string;
  
    if (tier === "premium") {
      priceId = isAnual === "annual"
        ? config.STRIPE_ANNUAL_PREMIUM_PRICE || "default_annual_premium_price"
        : config.STRIPE_PREMIUM_PRICE || "default_premium_price";
    } else {
      priceId = isAnual === "annual"
        ? config.STRIPE_ANNUAL_PRO_PRICE || "default_annual_pro_price"
        : config.STRIPE_PRO_PRICE || "default_pro_price";
    }
  
    const session = await stripe.checkout.sessions.create({
      customer: user.subscription!.customerId!,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${config.URL}/billing`,
      cancel_url: `${config.URL}/billing`,
      metadata: {
        userId: user.id.toString(),
        tier,
        interval: isAnual,
      },
      client_reference_id: user.id.toString(),
    });
  
    return session.url;
  }
  
  public async getInvoices(userId: string){
    try{

      const user = await this.userRepository.findById(userId)

      if(!user) {
        return createError("USER_NOT_FOUND")
      }

      const invoices = await stripe.invoices.list({ customer: user.subscription?.customerId})

      return invoices

    } catch(err){
      throw createError("STRIPE_INVOICE_NOT_FOUND")
    }
  }
}

