import { NextFunction, Response, Request } from "express";
import { IUser } from "../../models/user";
import { NotificationService } from "../../services/workspace/notificationService";

export class NotificationController {
  
  private notificationService = new NotificationService();

  public async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = (req.user as IUser).id;

    try {
      const notifications =
        await this.notificationService.getNotificationsByUser(userId);

      res.status(200).json({
        message: "Notifications successfully fetched",
        success: true,
        data: notifications,
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = (req.user as IUser).id;
    const { notificaitionId } = req.params;
    try {
      const response = await this.notificationService.deleteUserNotifaction(
        userId,
        notificaitionId
      );

      res.status(200).json({
        message: "Notifications successfully deleted",
        success: true,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public async markAsRead(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as IUser).id;
    const { notificaitionId } = req.params;

    try {
      const response = await this.notificationService.markNotificationAsRead(
        userId,
        notificaitionId
      );

      res.status(200).json({
        message: "Notification successfully marked as read",
        success: true,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
