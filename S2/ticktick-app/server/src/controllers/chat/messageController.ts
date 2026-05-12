import { Request, Response, NextFunction } from "express";
import { DecodedUser } from "../../middleware/jwtMiddleware";
import { MessageService } from "../../services/chat/messageService";
import { IUser } from "../../models/user";

export class MessageController {
  private messageService = new MessageService();

  public async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const messages = await this.messageService.getMessages(chatId);

      res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (err) {
      next(err);
    }
  }

  public async postMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as IUser).id;
      const { content, chatId, toUserId } = req.body;

      const message = await this.messageService.postMessage(
        chatId,
        userId,
        content,
        toUserId,
      );

      res.status(201).json({
        success: true,
        message: "Message posted successfully",
        data: message,
      });
    } catch (err) {
      next(err);
    }
  }

  public async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as DecodedUser;
      const { chatId } = req.params;

      const re = await this.messageService.markAsRead(chatId, user.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  public async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as DecodedUser;
      const { messageId, chatId } = req.params;

      const deleted = await this.messageService.deleteMessage(
        messageId,
        user.id,
        chatId
      );
      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  }
}
