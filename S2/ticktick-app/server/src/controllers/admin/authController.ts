import { config } from "../../config/config";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services/admin/authService";
import { IUser } from "../../models/user";

export class AuthController {
  private authService = new AuthService();

  public async register(req: Request, res: Response, next: NextFunction) {
    const { email, username, password } = req.body;
    try {
    await this.authService.registerUser(req, email, username, password);

      res.status(201).json({
        success: true,
        message:
          "User registered successfully. Please check your email for OTP.",
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password, rememberMe } = req.body;
    try {
      const { token, refreshToken } = await this.authService.loginUser(
        req,
        email,
        password,
        rememberMe
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  public async googleManager(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    try {
      const { token } = await this.authService.googleManager(req, user as IUser);

      res.redirect(`${config.URL}/auth/callback?token=${token}`);
    } catch (err) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const newAccessToken = await this.authService.refreshToken(
        req,
        refreshToken
      );

      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      const result = await this.authService.requestPasswordReset(req, email);
      res.status(200).json({
        success: true,
        message: "An Email with instructions is sent to you",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { token, newPassword } = req.body;
    try {
      const result = await this.authService.resetPassword(
        token,
        newPassword
      );
      res.status(200).json({
        success: true,
        message: "Password successfully changed!",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updatePassword(req: Request, res: Response, next: NextFunction){

    const { password, newPassword } = req.body
    const userId = (req.user as IUser).id;
    
    try{

      await this.authService.updatePassword(userId, password, newPassword)

      res.status(200).json({
        success: true,
        message: "Password successfully changed!",
      })

    } catch(err){
      next(err)
    }
  }

  public async createPassword(req: Request, res: Response, next: NextFunction){
    const { newPassword: password } = req.body;
    const userId = (req.user as IUser).id;

    try{

      await this.authService.createPassword(password, userId)

      res.status(200).json({
        success: true,
        message: "Password successfully craeted!"
      })

    } catch(err){
      next(err);
    }
  }
}
