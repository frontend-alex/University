import { Router } from "express";
import { jwtMiddleware } from "../../middleware/jwtMiddleware";
import { OpenAIController } from "../../controllers/ai/openAIController";

const router = Router()

const openAIController = new OpenAIController();

router.use(jwtMiddleware); 

router.post('/enhance-task', openAIController.enhanceDescription.bind(openAIController));

export { router as protectedAIRoutes };
 