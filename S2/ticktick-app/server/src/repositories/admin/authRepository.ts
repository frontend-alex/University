import { IUser, User } from "../../models/user";
import { createError } from "../../middleware/errorHandler";
import { Utils } from "../../utils/utils";
import { AuthProvider } from "../../types/Enums";

export class AuthRepository {
  public async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<IUser> {
    try {
      const newUser = new User({
        email,
        username,
        password,
        imageUrl: Utils.generateAvatar(username),
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async createGoogleUser(
    email: string,
    username: string,
    imageUrl: string
  ): Promise<IUser> {
    try {
      const user = new User({
        email,
        username,
        emailVerified: true,
        provider: AuthProvider.Google,
        imageUrl,
      });
      await user.save();
      return user;
    } catch (error) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async createPassword(
    email: string,
    password: string
  ): Promise<IUser | null> {
    try {
      return User.findOneAndUpdate(
        { email },
        { password, hasPassword: true },
        { new: true }
      );
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async updatePassword(
    email: string,
    newPassword: string
  ): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { email },
        { password: newPassword },
        { new: true }
      );
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async setResetToken(
    email: string,
    resetToken: string,
    resetTokenExpires: Date
  ): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { email },
        { resetToken, resetTokenExpires },
        { new: true }
      );
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async clearResetToken(email: string): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { email },
        { $unset: { resetToken: 1, resetTokenExpires: 1 } },
        { new: true }
      );
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}
