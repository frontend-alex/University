import { Types, UpdateQuery } from "mongoose";
import { CreateWorkspaceDTO } from "../../types/Types";
import { createError } from "../../middleware/errorHandler";
import Workspace, {
  IWorkspace,
  IWorkspaceMember,
} from "../../models/workspace";
import { User } from "../../models/user";
import { WorkspaceUserRoles } from "../../types/Enums";

export class WorkspaceRepository {
  public async createWorkspace(data: CreateWorkspaceDTO): Promise<IWorkspace> {
    try {
      const newWorkspace = new Workspace(data);
      return await newWorkspace.save();
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getWorkspaceById(id: string) {
    try {
      return await Workspace.findById(id).populate("members.user");
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async getWorkspacesByUser(userId: string) {
    try {
      return await Workspace.find({ "members.user": userId })
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async addMember(workspaceId: string, member: IWorkspaceMember) {
    return await Workspace.findByIdAndUpdate(
      workspaceId,
      { $addToSet: { members: member } },
      { new: true }
    );
  }

  public async deleteWorkspace(workspaceId: Types.ObjectId | string) {
    try {
      await User.updateMany(
        { workspaces: workspaceId },
        { $pull: { workspaces: workspaceId } }
      );

      await Workspace.findByIdAndDelete(workspaceId);
    } catch (error) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async removeMember(workspaceId: string, userId: string) {
    try {
      const workspace = await Workspace.findByIdAndUpdate(
        workspaceId,
        { $pull: { members: { user: userId } } },
        { new: true }
      );

      if (!workspace) {
        throw createError("WORKSPACE_NOT_FOUND");
      }

      await User.updateOne(
        { _id: userId },
        { $pull: { workspaces: workspaceId } }
      );

      return workspace;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async updateMemberRole(
    workspaceId: string,
    userId: string,
    newRole: WorkspaceUserRoles
  ): Promise<IWorkspace | null> {
    try {
      const workspace = await Workspace.findOneAndUpdate(
        { _id: workspaceId, "members.user": userId },
        { $set: { "members.$.role": newRole } },
        { new: true }
      );

      if (!workspace) {
        throw createError("WORKSPACE_NOT_FOUND");
      }

      return workspace;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async leaveWorkspace(workspaceId: string, userId: string) {
    try {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        throw createError("WORKSPACE_NOT_FOUND");
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === userId
      );

      if (!member) {
        throw createError("USER_NOT_IN_WORKSPACE");
      }

      if (member.role === WorkspaceUserRoles.Owner) {
        const ownerCount = workspace.members.filter(
          (m) => m.role === WorkspaceUserRoles.Owner
        ).length;

        if (ownerCount <= 1) {
          throw createError("LAST_OWNER_CANNOT_LEAVE");
        }
      }

      const updatedWorkspace = await Workspace.findByIdAndUpdate(
        workspaceId,
        { $pull: { members: { user: userId } } },
        { new: true }
      );

      await User.updateOne(
        { _id: userId },
        { $pull: { workspaces: workspaceId } }
      );

      return updatedWorkspace;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async update(
    filter: Partial<Record<keyof IWorkspace, any>>,
    data: UpdateQuery<IWorkspace>
  ): Promise<IWorkspace | null> {
    try {
      return await Workspace.findOneAndUpdate(filter, data, { new: true });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
}

export const workspaceRepository = new WorkspaceRepository();
