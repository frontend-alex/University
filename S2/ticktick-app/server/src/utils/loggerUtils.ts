import { Request } from "express";
import { logger } from "../services/loggerService";
import { IUser } from "../models/user";

export class LoggerUtils {
  static logUserEvent(event: string, user: IUser, req: Request) {
    logger.info(`${event} by ${user.email}`, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      userId: user.id,
      email: user.email,
      event
    });
  }
}
