import { createError } from "../../middleware/errorHandler";
import { ObjectId, UpdateQuery } from "mongoose";
import { IUser, User } from "../../models/user";

export class UserRepository {
  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async findById(userId: ObjectId | string): Promise<IUser | null> {
    try {
      return await User.findById(userId) .populate({
          path: "workspaces",
          populate: {
            path: "members.user",
            model: "User",
            select: "username imageUrl email", 
          },
        });
    } catch (error) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username }).select(
        "-email -role -createdAt -updatedAt -_id"
      );
    } catch (error) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async update(
    filter: Partial<Record<keyof IUser, any>>,
    data: UpdateQuery<IUser>
  ): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(filter, data, { new: true });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}
