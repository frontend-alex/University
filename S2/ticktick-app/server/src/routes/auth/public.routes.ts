import passport from "passport";

import { Router } from "express";
import { AuthController } from "../../controllers/admin/authController";
import { OtpController } from "../../controllers/admin/otpController";

const router = Router();
const authController = new AuthController();
const otpController = new OtpController();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  authController.googleManager.bind(authController)
);

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);

router.post("/send-otp", otpController.sendOtp.bind(otpController));
router.post("/verify-otp", otpController.verifyOtp.bind(otpController));

export { router as publicAuthRoutes };
