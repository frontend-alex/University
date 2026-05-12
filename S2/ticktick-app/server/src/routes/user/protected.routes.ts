import { Router } from "express";
import { jwtMiddleware } from "../../middleware/jwtMiddleware";
import { UserController } from "../../controllers/workspace/user/userController";

const router = Router()

const userController = new UserController();

router.use(jwtMiddleware); 

router.get('/me', userController.getUserById.bind(userController));

router.post('/change-username', userController.changeUsername.bind(userController));
router.post('/change-email', userController.changeEmail.bind(userController));

export { router as protectedUserRoutes };
 