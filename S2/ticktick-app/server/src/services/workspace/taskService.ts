import { createError } from "../../middleware/errorHandler";
import { ITask } from "../../models/task";
import { IUser } from "../../models/user";
import { Utils } from "../../utils/utils";
import { getIO } from "../../websockets/socketServer";
import { TaskRepository } from "../../repositories/workspace/taskRepository";
import { NotificationRepository } from "../../repositories/workspace/notificationRepository";
import { UserRepository } from "../../repositories/user/userRepository";

export class TaskService {
  private taskRepository = new TaskRepository();
  private userRepository = new UserRepository();
  private notificationRepository = new NotificationRepository();

  public async createTask(taskData: ITask) {
    if (!taskData) throw createError("DB_CONNECTION_FAILED");

    try {
      const task = await this.taskRepository.createTask(taskData);
      return task;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async updateTask(
    taskId: string,
    taskData: Partial<ITask>,
    currentUser: IUser | undefined
  ) {
    if (!taskId || !taskData) return createError("DB_CONNECTION_FAILED");

    if (!currentUser) return createError("USER_NOT_FOUND");

    const user = await this.userRepository.findById(currentUser.id)

    if(!user) return createError("USER_NOT_FOUND");

    try {
      const io = getIO();

      const existingTask = await this.taskRepository.getTaskById(taskId);
      if (!existingTask) throw createError("TASK_NOT_FOUND");

      const oldAssignees = Utils.normalizeArray(existingTask.assignedTo);
      const newAssignees = Utils.normalizeArray(taskData.assignedTo);

      const newlyAssigned = newAssignees.filter(
        (id) => !oldAssignees.includes(id)
      );

      const updatedTask = await this.taskRepository.updateTask(
        taskId,
        taskData
      );

      for (const userId of newlyAssigned) {
        const notification =
          await this.notificationRepository.createNotification(
            userId,
            "task_assigned",
            {
              taskId: updatedTask?.id,
              taskTitle: updatedTask?.title ?? "Untitled Task",
              assignedBy: user.username,
              assignedByProfilePicture: user.imageUrl,
              workspaceId: "",
              workspaceTitle: "",
            }
          );

        console.log(currentUser)
        console.log(notification);

        io.to(userId).emit("taskAssigned", notification);
      }

      return updatedTask;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async deleteTask(taskId: string) {
    if (!taskId) throw createError("DB_CONNECTION_FAILED");

    try {
      const deletedTask = await this.taskRepository.deletePermanenlyTask(
        taskId
      );
      return deletedTask;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async softDeleteTask(taskId: string) {
    if (!taskId) throw createError("TASK_NOT_FOUND");
    try {
      const task = await this.taskRepository.getTaskById(taskId);
      if (!task) throw createError("TASK_NOT_FOUND");

      const deletedTask = await this.taskRepository.saveDeletedTask(task);
      await this.taskRepository.deleteTask(taskId);

      return deletedTask;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getSoftDeletedTasks(userId: string) {
    if (!userId) throw createError("USER_NOT_FOUND");
    try {
      const tasks = await this.taskRepository.getSoftDeletedTasks(userId);
      return tasks;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async restoreTask(taskId: string) {
    if (!taskId) throw createError("TASK_NOT_FOUND");
    try {
      const task = await this.taskRepository.restoreTask(taskId);
      return task;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getUserTasks(userId: string) {
    if (!userId) return createError("USER_NOT_FOUND");

    try {
      const { assignedTasks, listTasks } =
        await this.taskRepository.getUserTasks(userId);

      return { assignedTasks, listTasks };
    } catch (err) {
      throw createError("TASK_NOT_FOUND");
    }
  }

  public async getTaskById(taskId: string) {
    if (!taskId) throw createError("DB_CONNECTION_FAILED");

    try {
      const task = await this.taskRepository.getTaskById(taskId);
      return task;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getTasksByList(listId: string) {
    if (!listId) throw createError("DB_CONNECTION_FAILED");

    try {
      const tasks = await this.taskRepository.getTasksByList(listId);
      return tasks;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}
