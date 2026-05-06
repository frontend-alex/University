import { NextFunction, Request, Response } from "express";
import { TaskService } from "../../services/workspace/taskService";
import { IUser } from "../../models/user";
import { ITask } from "../../models/task";

export class TaskController {
  private taskService = new TaskService();

  public async createTask(req: Request, res: Response, next: NextFunction) {
    const taskData: ITask = req.body;
    try {
      const task = await this.taskService.createTask(taskData);
      res.status(201).json({
        success: true,
        message: "Task successfully created",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  // Update Task
  public async updateTask(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    const taskData = req.body;

    try {
      const updatedTask = await this.taskService.updateTask(
        taskId,
        taskData,
        req.user as IUser
      );
      res.status(200).json({
        success: true,
        message: "Task successfully updated",
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  }

  //soft Delete Task
  public async softDeleteTask(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    try {
      const task = await this.taskService.softDeleteTask(taskId);
      res.status(200).json({
        success: true,
        message: "Task successfully deleted",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  // Delete Task
  public async deleteTask(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    try {
      const task = await this.taskService.deleteTask(taskId);
      res.status(200).json({
        success: true,
        message: "Task successfully deleted permanently",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  //Get all tasks (assigned or not) by userId
  public async getTasksByUser(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as IUser).id;

    try {
      const { assignedTasks, listTasks } = await this.taskService.getUserTasks(
        userId
      );

      res.status(200).json({
        success: true,
        message: "User tasks successfully fetched",
        data: {
          assignedTasks,
          listTasks,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // Get Task by ID
  public async getTaskById(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    try {
      const task = await this.taskService.getTaskById(taskId);
      res.status(200).json({
        success: true,
        message: "Task successfully retrieved",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get Tasks by List
  public async getTasksByList(req: Request, res: Response, next: NextFunction) {
    const { listId } = req.params;
    try {
      const tasks = await this.taskService.getTasksByList(listId);
      res.status(200).json({
        success: true,
        message: "Tasks successfully retrieved",
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get Soft Deleted Tasks
  public async getSoftDeletedTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as IUser).id;

      const tasks = await this.taskService.getSoftDeletedTasks(userId);
      res.status(200).json({
        success: true,
        message: "Tasks successfully retrieved",
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  }

  public async restoreTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = await this.taskService.restoreTask(taskId);
      res.status(200).json({
        success: true,
        message: "Task successfully restored",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }
}
