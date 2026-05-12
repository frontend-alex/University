import { IList } from "../../models/list";
import { CreateListDTO } from "../../types/Types";
import { createError } from "../../middleware/errorHandler";
import { ListRepository } from "../../repositories/workspace/listRepository";
import { WorkspaceRepository } from "../../repositories/workspace/workspaceRepository";


export class ListService {
  private listRepository = new ListRepository();
  private workspaceRepository = new WorkspaceRepository();

  public async getListById(listId: string) {
    if (!listId) throw createError("WORKSPACE_NOT_FOUND");

    try {
      const workspace = await this.listRepository.getListById(listId);
      return workspace;
    } catch (err) {
      throw createError("LIST_ALREADY_EXISTS_IN_WORKSPACE");
    }
  }

  public async getListWorkspace(workspaceId: string) {
    if (!workspaceId) throw createError("WORKSPACE_NOT_FOUND");

    try {
      const workspace = await this.listRepository.getListsByWorkspace(
        workspaceId
      );
      return workspace;
    } catch (err) {
      throw createError("LIST_ALREADY_EXISTS_IN_WORKSPACE");
    }
  }

  public async createListForWorkspace(data: CreateListDTO) {
    try {
      const { title, workspace, listType, priority } = data;

      const existingWorkspace = await this.workspaceRepository.getWorkspaceById(
        workspace.toString()
      );
      if (!existingWorkspace) {
        throw createError("WORKSPACE_NOT_FOUND");
      }

      const newList = await this.listRepository.createList({
        title,
        workspace,
        listType,
        priority
      });

      return newList;
    } catch (err) {}
  }

  public async updateList(data: IList, listId: string) {
    try {
      const list = await this.listRepository.getListById(listId);

      if (!list) throw createError("LIST_CREATION_FAILED");

      const updatedList = await this.listRepository.updateList(listId, data);

      return updatedList;
    } catch (err) {}
  }

  public async deleteList(listId: string) {
    try {
      const list = await this.listRepository.getListById(listId);

      if (!list) throw createError("LIST_CREATION_FAILED");

      const updatedList = await this.listRepository.deleteList(listId);

      return updatedList;
    } catch (err) {}
  }
}
