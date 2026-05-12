import { Router } from "express";
import { SubscriptionTier } from "../../models/user";
import { jwtMiddleware } from "../../middleware/jwtMiddleware";
import { ChatController } from "../../controllers/chat/chatController";
import { authorizeSubscription } from "../../middleware/subscribtionMiddleware";

const router = Router()

const chatController = new ChatController();

router.use(jwtMiddleware);
// router.use(authorizeSubscription([SubscriptionTier.Premium, SubscriptionTier.Pro]));

router.get("/", chatController.getUserChats.bind(chatController));
router.post("/", chatController.startConversation.bind(chatController));

export { router as protectedChatRoutes };
