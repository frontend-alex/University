import { Router } from "express";
import { SubscriptionTier } from "../../models/user";
import { jwtMiddleware } from "../../middleware/jwtMiddleware";
import { MessageController } from "../../controllers/chat/messageController";
import { authorizeSubscription } from "../../middleware/subscribtionMiddleware";

const router = Router();
const messageController = new MessageController();

router.use(jwtMiddleware);
// router.use(authorizeSubscription([SubscriptionTier.Pro, SubscriptionTier.Premium]));

router.get("/:chatId", messageController.getMessages.bind(messageController));
router.post("/", messageController.postMessage.bind(messageController));
router.post("/read", messageController.markAsRead.bind(messageController));
router.delete("/:chatId/:messageId", messageController.deleteMessage.bind(messageController));

export { router as protectedMessagesRoutes };
