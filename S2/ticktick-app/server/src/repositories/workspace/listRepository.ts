import List, { IList } from "../../models/list";
import { createError } from "../../middleware/errorHandler";
import { CreateListDTO } from "../../types/Types";

export class ListRepository {
  public async createList(data: CreateListDTO): Promise<IList> {
    try {
      const newList = new List(data);
      return await newList.save();
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getListById(id: string) {
    try {
      return await List.findById(id);

    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getListsByWorkspace(workspaceId: string) {
    try {
      return await List.find({ workspace: workspaceId })
        .populate({
          path: "workspace",
          populate: {
            path: "members.user",
            model: "User",
            select: "username imageUrl email", 
          },
        })
        .populate("completedTasksCount")
        .populate("totalTasksCount");
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getListsByWorkspaceIds(workspaceIds: string[]) {
  try {
    return await List.find({ workspace: { $in: workspaceIds } });
  } catch (err) {
    throw createError("DB_QUERY_FAILED");
  }
}

  public async updateList(id: string, data: Partial<IList>) {
    try {
      return await List.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async deleteList(id: string) {
    try {
      return await List.findByIdAndDelete(id);
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}

export const listRepository = new ListRepository();
