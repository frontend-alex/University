import { IUser } from "../../../models/user";
import { UserService } from "../../../services/user/userService";
import { NextFunction, Request, Response } from "express";

export class UserController {
  private userService = new UserService();

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserId((req.user as IUser).id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getUserByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { username } = req.params;
    try {
      const user = await this.userService.getUserByUsername(username);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  public async changeUsername(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    const userId = (req.user as IUser).id;

    try {
      await this.userService.changeUsername(username, userId);

      res.status(200).json({
        success: true,
        message: "Username successfully changed!",
      });
    } catch (err) {
      next(err);
    }
  }

  public async changeEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const userId = (req.user as IUser).id;

    try {
      await this.userService.changeEmail(email, userId);

      res.status(200).json({
        success: true,
        message: "Email successfully changed!",
      });
    } catch (err) {
      next(err);
    }
  }
}
