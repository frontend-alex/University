import { IUser, SubscriptionTier } from "../../models/user";
import { createError } from "../../middleware/errorHandler";
import { UserRepository } from "../../repositories/user/userRepository";
import { config } from "../../config/config";

const USAGE_LIMITS: Record<string, number> = {
  [SubscriptionTier.Free] : config.FREE_AI_USAGE,
  [SubscriptionTier.Pro]: config.PRO_AI_USAGE,
  [SubscriptionTier.Premium]: config.PREMIUM_AI_USAGE,
};

export class AiUsageService {
  private userRepository = new UserRepository();

  public async checkUsage(user: IUser): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const tier = user.subscription?.tier || SubscriptionTier.Free;
    const limit = USAGE_LIMITS[tier];

    if (limit === Infinity) return;

    if (user.aiUsage?.date === today && user.aiUsage.count >= limit) {
      throw createError("LIMIT_REACHED");
    }
  }

  public async incrementUsage(user: IUser): Promise<void> {
    const today = new Date().toISOString().split("T")[0];

    const updatedUsage = user.aiUsage?.date === today
      ? { date: today, count: user.aiUsage.count + 1 }
      : { date: today, count: 1 };

    await this.userRepository.update({ _id: user._id }, { aiUsage: updatedUsage });
  }
}
