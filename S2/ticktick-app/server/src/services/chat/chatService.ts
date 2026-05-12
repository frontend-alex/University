import { createError } from "../../middleware/errorHandler";
import { ChatRepository } from "../../repositories/chat/chatRepository";
import { WorkspaceRepository } from "../../repositories/workspace/workspaceRepository";
import mongoose from "mongoose";

export class ChatService {
  private chatRepo = new ChatRepository();
  private workspaceRepo = new WorkspaceRepository();

  async startConversation(
    workspaceId: string,
    currentUserId: string,
    otherUserId: string
  ) {
    const workspace = await this.workspaceRepo.getWorkspaceById(workspaceId);
    if (!workspace) {
      throw createError("WORKSPACE_NOT_FOUND");
    }

    const isMember1 = workspace.members.some(
      (m) => m.user._id.toString() === currentUserId
    );
    const isMember2 = workspace.members.some(
      (m) => m.user._id.toString() === otherUserId
    );

    if (!isMember1 || !isMember2) {
      throw createError("USERS_NOT_IN_SAME_WORKSPACE");
    }

    if (currentUserId === otherUserId) {
      throw createError("CANNOT_CHAT_WITH_SELF");
    }

    return this.chatRepo.findOrCreateConversation(
      workspaceId,
      currentUserId,
      otherUserId
    );
  }

  async getUserConversations(workspaceId: string, userId: string) {
    return this.chatRepo.getUserConversations(workspaceId, userId);
  }

  async sendMessage(conversationId: string, senderId: string, content: string, toUserId: string) {
    if (!content.trim()) {
      throw createError("EMPTY_MESSAGE");
    }

    return this.chatRepo.createMessage(conversationId, senderId, content, toUserId);
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    return this.chatRepo.markAsRead(conversationId, userId);
  }
}
