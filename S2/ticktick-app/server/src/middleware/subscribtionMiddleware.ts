import { SubscriptionTier } from "../models/user";
import { createError } from "./errorHandler";
import { NextFunction, Request, Response } from "express";
import { DecodedUser } from "./jwtMiddleware";

/**
 * Middleware to restrict access to users with specific subscription tiers (Pro, Premium, etc).
 * @param allowedTiers Array of allowed tiers (e.g., [SubscriptionTier.Pro, SubscriptionTier.Premium])
 */

export const authorizeSubscription = (
  allowedTiers: SubscriptionTier[]
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as DecodedUser;

    if (!user) {
      return next(createError("FORBIDDEN_ACCESS"));
    }

    if (!allowedTiers.includes(user.tier)) {
      return next(createError("FORBIDDEN_ACCESS"));
    }

    next();
  };
};
