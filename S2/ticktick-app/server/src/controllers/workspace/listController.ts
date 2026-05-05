import { Request, Response, NextFunction } from "express";
import { ListService } from "../../services/workspace/listService";

export class ListController {
  private listService = new ListService();

  public async getListsByWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { workspaceId } = req.params;

    try {
      const lists = await this.listService.getListWorkspace(workspaceId);

      res.status(200).json({
        success: true,
        message: "Lists successfully retrieved",
        data: lists,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getListById(req: Request, res: Response, next: NextFunction) {
    const { listId } = req.params;
    try {
      const list = await this.listService.getListById(listId);

      res.status(200).json({
        success: true,
        message: "Lists successfully retrieved",
        data: list,
      });
    } catch (err) {
      next(err);
    }
  }

  public async createList(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, workspaceId, listType, priority } = req.body;

      const list = await this.listService.createListForWorkspace({
        title,
        workspace: workspaceId,
        listType,
        priority
      });

      res.status(201).json({
        success: true,
        message: "List created successfully",
        data: list,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateList(req: Request, res: Response, next: NextFunction){
    try{
      const listData = req.body

      const newList = await this.listService.updateList(listData, listData.listId)

      res.status(200).json({
        status: true,
        message: "Successfully updated the list",
        data: newList
      })

    } catch(err){
      next(err);
    }
  }

  public async deleteList(req: Request, res: Response, next: NextFunction){
    try{
      const { listId } = req.params

      const deletedList = await this.listService.deleteList(listId)

      res.status(200).json({
        status: true,
        message: "Successfully deleted the list",
        data: deletedList
      })

    } catch(err){
      next(err);
    }
  }
}
