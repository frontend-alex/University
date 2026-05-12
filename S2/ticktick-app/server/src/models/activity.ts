import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  workspace: mongoose.Types.ObjectId;
  user: {
    id: mongoose.Types.ObjectId;
    username: string;
  };
  action: string;
  entityType: "task" | "list" | "workspace" | "other";
  entityId?: mongoose.Types.ObjectId | string;
  entityTitle?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  user: {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
  },
  action: { type: String, required: true },
  entityType: {
    type: String,
    enum: ["task", "list", "workspace", "other"],
    required: true,
  },
  read: { type: Boolean, default: false },
  entityId: Schema.Types.Mixed,
  entityTitle: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
