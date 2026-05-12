import { IUser } from "../../models/user";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/userService";
import { StripeService } from "../../services/stripe/stripeService";

;

export class StripeController {

  private stripeService = new StripeService()

  public async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as IUser).id;
      const { tier, isAnual } = req.body;

      if (!["pro", "premium"].includes(tier)) {
        throw new Error("Invalid subscription tier");
      }
      
      if (!["monthly", "annual"].includes(isAnual)) {
        throw new Error("Invalid billing interval");
      }

      const sessionUrl = await this.stripeService.createCheckoutSession(userId, tier, isAnual);

      res.status(200).json({
        success: true,
        url: sessionUrl,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getInvoices(req: Request, res: Response, next: NextFunction) {
    try{

      const userId = (req.user as IUser).id;

      const invoices = await this.stripeService.getInvoices(userId);

      res.status(200).json({
        success: true,
        message: "Invoices successfully fetched",
        invoices
      })

    } catch(err){
      next(err)
    }
  }
}
