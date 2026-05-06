import { createError } from "../../middleware/errorHandler";
import { NotificationRepository } from "../../repositories/workspace/notificationRepository";

export class NotificationService {
  private notificationRepository = new NotificationRepository();

  public async getNotificationsByUser(userId: string) {
    if (!userId) return createError("USER_NOT_FOUND");

    try {
      const notifications =
        await this.notificationRepository.getNotificationByUserId(userId);
      return notifications;
    } catch (err) {
    }
  }

  public async deleteUserNotifaction(userId: string, notificaitionId: string) {
    if (!userId) return createError("USER_NOT_FOUND");
    if (!notificaitionId) return createError("USER_NOT_FOUND");

    try {
      const res = await this.notificationRepository.deleteNotification(
        userId,
        notificaitionId
      );

      return res;
    } catch (err) {}
  }

  public async markNotificationAsRead(userId: string, notificaitionId: string) {
    if (!userId) return createError("USER_NOT_FOUND");
    if (!notificaitionId) return createError("NOTIFICATION_NOT_FOUND");

    try {

      const notifications =
        await this.notificationRepository.getNotificationByUserId(userId);
      if (!notifications) return createError("NOTIFICATION_NOT_FOUND");

      const notification =
        await this.notificationRepository.markNotificationAsRead(
          userId,
          notificaitionId
        );

      return notification;
    } catch (err) {}
  }
}
