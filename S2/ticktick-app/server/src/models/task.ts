import mongoose, { Schema, Document } from "mongoose";
import {
  TaskTypes,
  TaskPriority,
  TaskStatus,
  TaskColors,
} from "../types/Enums";

export interface ITask extends Document {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskTypes;
  completed: boolean;
  list: mongoose.Types.ObjectId;
  color: TaskColors;
  time: string | Date;
  description?: string;
  assignedTo?: mongoose.Types.ObjectId[];
  startTime?: string;
  endTime?: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "Add description" },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.None,
    },
    time: {
      type: String,
      required: true,
      default: new Date(),
    },
    color: {
      type: String,
      enum: Object.values(TaskColors),
      default: TaskColors.Stone,
    },
    type: {
      type: String,
      enum: Object.values(TaskTypes),
      default: TaskTypes.Task,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Todo,
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    completed: { type: Boolean, default: false },
    list: { type: Schema.Types.ObjectId, ref: "List", required: false },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
