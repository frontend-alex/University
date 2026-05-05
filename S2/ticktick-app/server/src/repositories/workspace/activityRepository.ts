import activitySchema, { IActivityLog } from "../../models/activity";
import { Types } from "mongoose";

export class ActivityRepository {
  async logActivity({
    workspaceId,
    user,
    action,
    entityType,
    entityId,
    entityTitle,
  }: {
    workspaceId: Types.ObjectId | string;
    user: {
      id: Types.ObjectId | string;
      username: string;
    };
    action: string;
    entityType: "task" | "list" | "workspace" | "other";
    entityId?: Types.ObjectId | string;
    entityTitle?: string;
  }): Promise<IActivityLog> {
    const log = await activitySchema.create({
      workspace: workspaceId,
      user,
      action,
      entityType,
      entityId,
      entityTitle,
      createdAt: new Date(),
    });

    return log;
  }

  async getActivitiesByWorkspace(workspaceId: string, limit = 50): Promise<IActivityLog[]> {
    return activitySchema
      .find({ workspace: workspaceId })
      .populate("user.id")
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
