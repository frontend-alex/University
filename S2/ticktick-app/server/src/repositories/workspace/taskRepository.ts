import { Types } from "mongoose";
import { createError } from "../../middleware/errorHandler";
import DeletedTask, { IDeletedTask } from "../../models/deletedTasks";
import Task, { ITask } from "../../models/task";
import { WorkspaceRepository } from "./workspaceRepository";
import { ListRepository } from "./listRepository";
import { IWorkspace } from "../../models/workspace";
import { IList } from "../../models/list";

const workspaceRepository = new WorkspaceRepository();
const listRepository = new ListRepository();

export class TaskRepository {
  public async createTask(data: Partial<ITask>) {
    try {
      return await Task.create(data);
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async createMany(tasks: Partial<ITask>[]) {
    try {
      return await Task.insertMany(tasks);
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getTaskById(id: string) {
    try {
      return await Task.findById(id).populate({
        path: "list",
        populate: { path: "workspace" },
      });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getUserTasks(userId: string) {
    try {
      const workspaces = await workspaceRepository.getWorkspacesByUser(userId);
      const workspaceIds = workspaces.map((w: IWorkspace) => w._id.toString());

      const lists = await listRepository.getListsByWorkspaceIds(workspaceIds);
      const listIds = lists.map((l: IList) => l._id.toString());

      const assignedTasks = await Task.find({ assignedTo: userId })
        .populate("assignedTo list")
        .lean();
      const listTasks = await Task.find({ list: { $in: listIds } })
        .populate("assignedTo list")
        .lean();

      return { assignedTasks, listTasks };
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getTasksByList(listId: string) {
    try {
      return await Task.find({ list: listId }).populate("assignedTo");
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async updateTask(id: string, data: Partial<ITask>) {
    try {
      return await Task.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async deleteTask(id: string) {
    try {
      return await Task.findByIdAndDelete(id);
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async deletePermanenlyTask(id: string) {
    try {
      return await DeletedTask.findByIdAndDelete(id);
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async saveDeletedTask(task: ITask): Promise<IDeletedTask> {
    const taskObj = task.toObject();

    const list: any = task.list;
    const workspaceId = list?.workspace?._id;

    if (!workspaceId) {
      throw createError("WORKSPACE_NOT_FOUND");
    }

    const deleted = new DeletedTask({
      ...taskObj,
      deletedAt: new Date(),
      workspace: workspaceId,
    });

    const savedDeletedTask = await deleted.save();
    return savedDeletedTask;
  }

  public async getSoftDeletedTasks(userId: string) {
    try {
      return await DeletedTask.aggregate([
        {
          $lookup: {
            from: "workspaces",
            localField: "workspace",
            foreignField: "_id",
            as: "workspace",
          },
        },
        { $unwind: "$workspace" },
        {
          $match: {
            "workspace.members.user": new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedTo",
            foreignField: "_id",
            as: "assignedTo",
          },
        },
      ]);
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async restoreTask(taskId: string): Promise<ITask> {
    try {
      const deletedTask = await DeletedTask.findById(taskId);
      if (!deletedTask) {
        throw createError("TASK_NOT_FOUND");
      }

      const restoredTask = await Task.create({
        ...deletedTask.toObject(),
        _id: deletedTask._id,
        deletedAt: undefined,
      });

      await DeletedTask.findByIdAndDelete(taskId);

      return restoredTask;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}

export const taskRepository = new TaskRepository();
