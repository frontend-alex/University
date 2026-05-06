import { IUser } from "../../models/user";
import { Response, Request, NextFunction } from "express";
import { ChatService } from "../../services/chat/chatService";

export class ChatController {
  private chatService = new ChatService();

  public async getUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as IUser).id;
      const { workspaceId } = req.query;

      const conversations = await this.chatService.getUserConversations(
        workspaceId as string,
        userId
      );

      res
        .status(200)
        .json({
          success: true,
          message: "User conversations retrieved successfully",
          data: conversations,
        });
    } catch (err) {
      next(err);
    }
  }

  public async startConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as IUser).id;
      const { toUserId, workspaceId } = req.body;

      const conversation = await this.chatService.startConversation(
        workspaceId,
        toUserId,
        userId
      );

      res
        .status(200)
        .json({
          success: true,
          message: "Conversation started successfully",
          data: conversation,
        });
    } catch (err) {
      next(err);
    }
  }
}
