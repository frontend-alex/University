import { createError } from "../../middleware/errorHandler";
import { INotification, Notification } from "../../models/notification";

export class NotificationRepository {
  public async getNotificationByUserId(userId: string) {
    try {
      return await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async deleteNotification(userId: string, notificationId: string) {
    try {
      return await Notification.deleteOne({ _id: notificationId, userId });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async markNotificationAsRead(userId: string, notificationId: string) {
    try {
      return await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
      );
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
  public async createNotification(
    userId: string,
    type: INotification["type"],
    data: INotification["data"]
  ) {
    try {
      return await Notification.create({
        userId,
        type,
        data,
      });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}
