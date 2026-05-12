import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { ListType, TaskPriority } from "../types/Enums";

export interface IList extends Document {
  _id: ObjectId
  title: string;
  workspace: mongoose.Types.ObjectId;
  listType: ListType;
  completedTasksCount?: number;
  totalTasksCount?: number;
  priority: TaskPriority;
}

interface IListModel extends Model<IList> {
  getTaskStats(listId: string): Promise<{
    completed: number;
    total: number;
    progress: number;
  }>;
}

const listSchema = new Schema<IList, IListModel>(
  {
    title: { type: String, required: true },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.None,
    },
    listType: {
      type: String,
      enum: Object.values(ListType),
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

listSchema.virtual("completedTasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "list",
  match: { completed: true },
  count: true,
});

listSchema.virtual("totalTasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "list",
  count: true,
});

listSchema.statics.getTaskStats = async function (listId: string) {
  const [completed, total] = await Promise.all([
    mongoose.model("Task").countDocuments({ list: listId, completed: true }),
    mongoose.model("Task").countDocuments({ list: listId }),
  ]);

  return {
    completed,
    total,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

const List = mongoose.model<IList, IListModel>("List", listSchema);
export default List;
