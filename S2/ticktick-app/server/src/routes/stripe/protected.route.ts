import { Router } from "express";
import { jwtMiddleware } from "../../middleware/jwtMiddleware";
import { StripeController } from "../../controllers/stripe/stripeController";

const router = Router()

const stripeController = new StripeController();

router.use(jwtMiddleware); 

router.post('/subscribe', stripeController.subscribe.bind(stripeController));
router.get('/get-invoices', stripeController.getInvoices.bind(stripeController));

export { router as protectedStripeRoutes };
 