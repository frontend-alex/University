import { Router } from 'express';
import { jwtMiddleware } from '../../middleware/jwtMiddleware';
import { AuthController } from '../../controllers/admin/authController';

const router = Router();
const authController = new AuthController();

router.use(jwtMiddleware); 

router.post("/reset-password", authController.resetPassword.bind(authController));
router.post("/create-password", authController.createPassword.bind(authController));
router.post("/update-password", authController.updatePassword.bind(authController));

router.post("/refresh", authController.refreshToken.bind(authController));

export { router as protectedAuthRoutes };
