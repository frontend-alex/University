import { Types } from "mongoose";
import { IUser } from "../../models/user";
import { Utils } from "../../utils/utils";
import { createError } from "../../middleware/errorHandler";
import { DEFAULT_LISTS_BY_TYPE } from "../../constants/data";
import {
  ListType,
  TaskPriority,
  TaskStatus,
  WorkspaceType,
  WorkspaceUserRoles,
} from "../../types/Enums";
import { getIO } from "../../websockets/socketServer";
import { Notification } from "../../models/notification";
import { IWorkspaceMember } from "../../models/workspace";
import { UserRepository } from "../../repositories/user/userRepository";
import { ListRepository } from "../../repositories/workspace/listRepository";
import { TaskRepository } from "../../repositories/workspace/taskRepository";
import { WorkspaceRepository } from "../../repositories/workspace/workspaceRepository";
import { NotificationRepository } from "../../repositories/workspace/notificationRepository";

export class WorkspaceService {
  private workspaceRepository = new WorkspaceRepository();
  private listRepository = new ListRepository();
  private userRepository = new UserRepository();
  private taskRepository = new TaskRepository();
  private notificationRepository = new NotificationRepository();

  private async revertBackToPersonal(workspaceId: string) {
    const workspace = await this.workspaceRepository.getWorkspaceById(
      workspaceId
    );

    if (!workspace) throw new Error("Workspace not found");

    const members = workspace.members;

    const isOnlyOwner =
      members.length === 1 && members[0].role === WorkspaceUserRoles.Owner;

    if (isOnlyOwner && workspace.type !== WorkspaceType.Personal) {
      workspace.type = WorkspaceType.Personal;
      await workspace.save();
      return { updated: true };
    }

    return { updated: false };
  }

  private validateInput(workspaceName: string, listTypes: ListType[]) {
    if (!workspaceName || !listTypes || !Array.isArray(listTypes)) {
      throw createError("LIST_CREATION_FAILED");
    }

    const validTypes = Object.values(ListType).map((type) =>
      type.toLowerCase()
    );

    for (const type of listTypes) {
      if (!validTypes.includes(type.toLowerCase())) {
        throw createError("LIST_CREATION_FAILED");
      }
    }
  }

  private async createWorkspacesAndLists(
    user: IUser,
    workspaceName: string,
    listTypes: ListType[]
  ) {
    const data = {
      title: workspaceName,
      imageUrl: Utils.generateAvatar(workspaceName),
      members: [
        {
          user: user.id as unknown as Types.ObjectId,
          role: WorkspaceUserRoles.Owner,
          joinedAt: new Date(),
        },
      ],
    };

    const workspace = await this.workspaceRepository.createWorkspace(data);
    const createdLists = [];

    for (const listType of listTypes) {
      const defaultLists = DEFAULT_LISTS_BY_TYPE[listType];
      const firstListName = defaultLists[0];

      const list = await this.listRepository.createList({
        title: firstListName,
        workspace: workspace._id as unknown as Types.ObjectId,
        listType,
        priority: TaskPriority.None
      });

      const titles = Utils.getDummyTasksForListType(listType);

      const dummyTasks = titles.map((title) => ({
        title,
        description: `This is a dummy task for "${title}"`,
        list: list._id as unknown as Types.ObjectId,
        priority: TaskPriority.None,
        status: TaskStatus.Todo,
        completed: false,
      }));

      await this.taskRepository.createMany(dummyTasks);

      createdLists.push(list);
    }

    await this.userRepository.update(
      { _id: user.id },
      {
        $set: { hasCompletedOnboarding: true },
        $push: { workspaces: workspace._id },
      }
    );

    return {
      workspace,
      lists: createdLists,
    };
  }

  public async inviteUsersToWorkspace(
    workspaceId: string,
    emailToInvite: string,
    sender: string
  ) {
    if (!workspaceId) throw createError("WORKSPACE_NOT_FOUND");
    if (!emailToInvite) throw createError("EMAIL_NOT_PROVIDED");

    try {
      const user = await this.userRepository.findByEmail(emailToInvite);
      if (!user) throw createError("USER_NOT_FOUND");

      const workspace = await this.workspaceRepository.getWorkspaceById(
        workspaceId
      );
      if (!workspace) throw createError("WORKSPACE_NOT_FOUND");

      const isAlreadyMember = workspace.members.some(
        (member) => member.user.toString() === user._id.toString()
      );
      if (isAlreadyMember) throw createError("USER_ALREADY_IN_WORKSPACE");

      const existingInvite = await Notification.findOne({
        userId: user._id,
        type: "workspace_invite",
        "data.workspaceId": workspaceId,
      });

      if (existingInvite) throw createError("INVITATION_ALREADY_SENT");

      const senderUser = await this.userRepository.findById(sender);

      if (!senderUser) throw createError("USER_NOT_FOUND");

      await this.notificationRepository.createNotification(user._id.toString(), "workspace_invite", {
        workspaceId,
        workspaceTitle: workspace.title,
        invitedBy: senderUser.username,
        invitedByProfilePicture: senderUser.imageUrl,
      });

      const io = getIO();

      io.to(user._id.toString()).emit("workspaceInvitation", {
        workspaceId,
        workspaceTitle: workspace.title,
        invitedBy: senderUser.username,
        invitedByProfilePicture: senderUser.imageUrl,
      });

      return {
        workspaceId,
        userId: user._id,
      };
    } catch (err) {
      throw err;
    }
  }

  public async onboardUser(
    user: IUser,
    workspaceName: string,
    listTypes: ListType[]
  ) {
    try {
      this.validateInput(workspaceName, listTypes);

      if ((user?.workspaces ?? []).length >= 1) {
        return createError("UPGRADE_PLAN");
      }

      const createdWorkspaces = await this.createWorkspacesAndLists(
        user,
        workspaceName,
        listTypes
      );

      return createdWorkspaces;
    } catch (err) {}
  }

  public async acceptWorkspaceInvite(workspaceId: string, userId: string) {
    if (!workspaceId) throw createError("WORKSPACE_NOT_FOUND");
    if (!userId) throw createError("USER_NOT_FOUND");

    try {
      const workspace = await this.workspaceRepository.getWorkspaceById(
        workspaceId
      );
      if (!workspace) throw createError("WORKSPACE_NOT_FOUND");

      const isAlreadyMember = workspace.members.some(
        (member) => member.user.toString() === userId
      );
      if (isAlreadyMember) throw createError("USER_ALREADY_IN_WORKSPACE");

      const member: IWorkspaceMember = {
        user: userId as unknown as Types.ObjectId,
        role: WorkspaceUserRoles.Member,
        joinedAt: new Date(),
      };

      await this.workspaceRepository.addMember(workspaceId, member);
    } catch (err) {}
  }

  public async getWorkspaceById(workspaceId: string) {
    if (!workspaceId) throw createError("WORKSPACE_NOT_FOUND");

    try {
      const workspace = await this.workspaceRepository.getWorkspaceById(
        workspaceId
      );
      if (!workspace) throw createError("WORKSPACE_NOT_FOUND");

      return workspace;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  public async leaveWorkspace(workspaceId: string, userId: string) {
    if (!workspaceId) return createError("WORKSPACE_NOT_FOUND");
    if (!userId) return createError("USER_NOT_FOUND");

    try {
      const workspace = await this.workspaceRepository.leaveWorkspace(
        workspaceId,
        userId
      );

      if (!workspace) throw createError("WORKSPACE_NOT_FOUND");

      await this.revertBackToPersonal(workspace.id);
    } catch (err) {
    }
  }
}
