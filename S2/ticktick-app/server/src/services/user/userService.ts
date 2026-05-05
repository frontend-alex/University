import { createError } from "../../middleware/errorHandler";
import { UserRepository } from "../../repositories/user/userRepository";

export class UserService {
  private userRepository = new UserRepository();

  public async getUserId(userId: string) {
    if (!userId) throw createError("USER_NOT_FOUND");

    const user = await this.userRepository.findById(userId);

    return user;
  }

  public async getUserByUsername(username: string) {
    if (!username) throw createError("USER_NOT_FOUND");

    const user = await this.userRepository.findByUsername(username);
    if (!user) throw createError("USER_NOT_FOUND");

    return user;
  }

  public async changeUsername(username: string, userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw createError("USER_NOT_FOUND");
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw createError("USERNAME_EXISTS");
    }

    await this.userRepository.update({ _id: userId }, { username });
  }

  public async changeEmail(email: string, userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw createError("USER_NOT_FOUND");
    }

    const existingUsername = await this.userRepository.findByEmail(email);
    if (existingUsername) {
      throw createError("EMAIL_EXISTS");
    }


    await this.userRepository.update({ _id: userId }, { email, emailVerified: false });
  }
}
