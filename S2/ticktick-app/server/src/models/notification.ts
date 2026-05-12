import { Schema, model, Types } from "mongoose";

interface BaseNotification {
  _id?: string;
  userId: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WorkspaceInviteNotification extends BaseNotification {
  type: "workspace_invite";
  data: {
    workspaceId: string;
    workspaceTitle: string;
    invitedBy: string;
    invitedByProfilePicture: string;
  };
}

export interface TaskAssignedNotification extends BaseNotification {
  type: "task_assigned";
  data: {
    workspaceId: string;
    workspaceTitle: string;
    taskId: string;
    taskTitle: string;
    assignedBy: string;
    assignedByProfilePicture: string;
  };
}

export type INotification = WorkspaceInviteNotification | TaskAssignedNotification;

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["workspace_invite", "task_assigned"],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export const Notification = model("Notification", NotificationSchema);
