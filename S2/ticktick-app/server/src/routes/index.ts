import { Router } from "express";
import { publicAuthRoutes } from "./auth/public.routes";
import { protectedAIRoutes } from "./ai/protected.routes";
import { publicStripeRoutes } from "./stripe/public.route";
import { protectedAuthRoutes } from "./auth/protected.routes";
import { protectedUserRoutes } from "./user/protected.routes";
import { protectedStripeRoutes } from "./stripe/protected.route";
import { protectedWorkspaceRoutes } from "./workspace/protected.route";
import { protectedMessagesRoutes } from "./messages/protected.route";
import { protectedChatRoutes } from "./chat/protected.route";

const router = Router();

router.use("/api/auth", publicAuthRoutes);
router.use("/api/stripe", publicStripeRoutes);  

router.use("/api/auth", protectedAuthRoutes);
router.use("/api/users", protectedUserRoutes);
router.use("/api/workspace", protectedWorkspaceRoutes);
router.use("/api/stripe", protectedStripeRoutes);
router.use("/api/ai", protectedAIRoutes);

router.use('/api/chat', protectedChatRoutes)
router.use('/api/messages', protectedMessagesRoutes)

export { router };
