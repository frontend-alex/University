import mjml from "mjml";
import bcrypt from "bcryptjs";

import { Request } from "express";
import { config } from "../../config/config";
import { eventBus } from "../../events/EventBus";
import { USER_EVENTS } from "../../events/user/user.events";
import { createError } from "../../middleware/errorHandler";
import { AuthRepository } from "../../repositories/admin/authRepository";
import { UserRepository } from "../../repositories/user/userRepository";
import { JwtUtils } from "../../utils/jwt/jwtUtils";
import { EmailUtils } from "../../utils/email/emailUtils";
import { IUser, SubscriptionTier } from "../../models/user";

export class AuthService {
  private authRepository = new AuthRepository();
  private userRepository = new UserRepository();

  public async googleManager(req: Request, user: IUser){
    try{

      if(!user){
        throw createError('USER_NOT_FOUND');
      }

      const token = JwtUtils.generateToken(
        user._id.toString(),
        user.username,
        user.role,
        user.subscription?.tier || SubscriptionTier.Free
      );
      const refreshToken = JwtUtils.generateRefreshToken(user._id.toString());

      eventBus.emit(USER_EVENTS.LOGGED_IN, { user, req });

      return { user, token, refreshToken };

    } catch(err){
      throw createError("GOOGLE_AUTH_FAILED")
    }
  }

  public async registerUser(req: Request, email: string, username: string, password: string) {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
  
      if (existingUser) {
        if (!existingUser.emailVerified) {
          throw createError("EMAIL_EXISTS", { otpRedirect: true });
        }
  
        throw createError("EMAIL_EXISTS");
      }
  
      const existingUsername = await this.userRepository.findByUsername(username);
      if (existingUsername) {
        throw createError("USERNAME_EXISTS");
      }
  
      const newUser = await this.authRepository.createUser(
        email,
        username,
        password
      );

      eventBus.emit(USER_EVENTS.REGISTERED, { user: newUser, req });
  
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  
  public async loginUser(req: Request, email: string, password: string, rememberMe: boolean) {
    try {
      const user = (await this.userRepository.findByEmail(email)) as IUser;
      if (!user) {
        throw createError("USER_NOT_FOUND");
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        throw createError("INVALID_CREDENTIALS");
      }

      if (!user.emailVerified) {
        throw createError("EMAIL_NOT_VERIFIED");
      }

      const token = JwtUtils.generateToken(
        user._id.toString(),
        user.username,
        user.role,
        user.subscription?.tier || SubscriptionTier.Free,
        rememberMe,
      );
      const refreshToken = JwtUtils.generateRefreshToken(user._id.toString());

      eventBus.emit(USER_EVENTS.LOGGED_IN, { user, req });

      return { user, token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken(req: Request, refreshToken: string) {
    if (!refreshToken) throw createError("JWT_TOKEN_MISSING");

    const decodedToken = JwtUtils.verifyRefreshToken(refreshToken);
    if (!decodedToken) throw createError("JWT_REFRESH_TOKEN_INVALID");

    if (typeof decodedToken === "string")
      throw createError("JWT_MALFORMED_TOKEN");

    const user = await this.userRepository.findById(decodedToken.id);
    if (!user) throw createError("USER_NOT_FOUND");

    const newAccessToken = JwtUtils.refreshAccessToken(refreshToken);
    if (!newAccessToken) throw createError("JWT_TOKEN_REFRESH_FAILED");


    return newAccessToken;
  }

  public async requestPasswordReset(req: Request ,email: string) {
    try {
      const user = (await this.userRepository.findByEmail(email)) as IUser;
      if (!user) throw createError("USER_NOT_FOUND");

      const resetToken = JwtUtils.generateToken(
        user._id.toString(),
        user.username,
        user.role,
        user.subscription?.tier || SubscriptionTier.Free
      );
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

      await this.authRepository.setResetToken(
        email,
        resetToken,
        resetTokenExpires
      );

      const resetLink = `${config.URL}/reset-password?resetToken=${resetToken}`;

      const mjmlTemplate = await EmailUtils.getEmailTemplate(
        "resetPasswordTempalte"
      );
      const compiledHtml = mjml(
        mjmlTemplate.replace("{{link}}", resetLink)
      ).html;

      const response = await EmailUtils.sendEmail(
        email,
        "Password change",
        compiledHtml
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  public async createPassword(password: string, userId: string){

    const user = await this.userRepository.findById(userId);

    if(!user){
      throw createError("USER_NOT_FOUND");
    }

    if(!password || password.length < 6){
      throw createError('PASSWORD_MISSING')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.authRepository.createPassword(user.email, hashedPassword)

    return result

  }

  public async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = JwtUtils.verifyToken(token);

      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        throw createError("JWT_EXPIRED_TOKEN");
      }

      const user = await this.userRepository.findById(decoded.id);
      if (!user) throw createError("USER_NOT_FOUND");

      if (
        user.resetToken !== token ||
        !user.resetTokenExpires ||
        user.resetTokenExpires < Date.now()
      )
        throw createError("JWT_EXPIRED_TOKEN");

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const response = await this.authRepository.updatePassword(
        user.email,
        hashedPassword
      );

      await this.authRepository.clearResetToken(user.email);

      return response;
    } catch (err) {
      throw err;
    }
  }

  public async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw createError("USER_NOT_FOUND");
  
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw createError("INVALID_CURRENT_PASSWORD");

    if(currentPassword === newPassword) throw createError("SAME_PASSWORD");
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    const result = await this.authRepository.updatePassword(user.email, hashedPassword);
  
    return result;
  }
}
