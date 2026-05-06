import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWorkspaceInvitation extends Document {
  workspace: Types.ObjectId;
  invitedUser: Types.ObjectId;
  invitedBy: Types.ObjectId;
  status: "pending" | "accepted" | "canceled";
  createdAt: Date;
  respondedAt?: Date;
}

const workspaceInvitationSchema = new Schema<IWorkspaceInvitation>({
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  invitedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  respondedAt: Date,
});

const WorkspaceInvitation = mongoose.model<IWorkspaceInvitation>(
  "WorkspaceInvitation",
  workspaceInvitationSchema
);

export default WorkspaceInvitation;
