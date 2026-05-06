import { Types } from "mongoose";
import { TaskPriority } from "./Enums";

export interface CreateWorkspaceDTO {
  title: string;
  imageUrl: string;
  members: {
    user: Types.ObjectId;
    role: "owner" | "admin" | "member";
    joinedAt: Date;
  }[];
}

export interface CreateListDTO {
  title: string;
  workspace: Types.ObjectId;
  listType: string;
  priority: TaskPriority;
}
