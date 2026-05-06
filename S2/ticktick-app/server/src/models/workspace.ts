import mongoose, { Schema, Document, Types, ObjectId } from "mongoose";
import { WorkspaceType, WorkspaceUserRoles } from "../types/Enums";

export interface IWorkspaceMember {
  user: Types.ObjectId;
  role: WorkspaceUserRoles;
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  _id: ObjectId
  title: string;
  type: WorkspaceType;
  members: IWorkspaceMember[];
  imageUrl: string;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(WorkspaceType),
      default: WorkspaceType.Personal,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: Object.values(WorkspaceUserRoles),
          default: WorkspaceUserRoles.Member,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      }
    ]
  },
  { timestamps: true }
);

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
export default Workspace;
