import { Types } from "mongoose";
import { MessageRepository } from "../../repositories/chat/messageRepository";
import { getIO } from "../../websockets/socketServer";
import { ChatRepository } from "../../repositories/chat/chatRepository";

export class MessageService {
  private messageRepository = new MessageRepository();
  private chatRepository = new ChatRepository();

  async getMessages(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new Error("Invalid conversation ID");
    }
    return this.messageRepository.findMessagesByConversationId(conversationId);
  }

  async postMessage(
    conversationId: string,
    senderId: string,
    content: string,
    toUserId: string
  ) {
    const socket = getIO();

    if (!content) {
      throw new Error("Message content cannot be empty");
    }

    const message = await this.chatRepository.createMessage(
      conversationId,
      senderId,
      content,
      toUserId,
    );

    return message;
  }

  async markAsRead(conversationId: string, userId: string) {
    const result = await this.chatRepository.markAsRead(
      conversationId,
      userId
    );

    return result;
  }

  async deleteMessage(
    messageId: string,
    userId: string,
    conversationId: string
  ) {
    const deleted = await this.chatRepository.deleteMessage(
      messageId,
      userId
    );
    if (!deleted) throw new Error("Message not found or not authorized");

    return deleted;
  }
}
