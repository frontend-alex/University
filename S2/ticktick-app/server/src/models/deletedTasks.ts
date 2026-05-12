import mongoose, { Schema, Document } from "mongoose";
import { TaskPriority, TaskStatus } from "../types/Enums";

export interface IDeletedTask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  completed: boolean;
  list: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId; 
  deletedAt: Date;
  assignedTo: mongoose.Types.ObjectId;
}

const deletedTaskSchema = new Schema<IDeletedTask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "Add description" },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.None,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Todo,
    },
    completed: { type: Boolean, default: false },
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      index: { expires: "30d" },
    },
  },
  { timestamps: true }
);

const DeletedTask = mongoose.model<IDeletedTask>("DeletedTask", deletedTaskSchema);
export default DeletedTask;
