import { Message } from "../../models/message";
import { createError } from "../../middleware/errorHandler";

export class MessageRepository {
  async findMessagesByConversationId(conversationId: string) {
    return Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username imageUrl email _id")
      .populate("toUserId", "username imageUrl email _id")
      .populate("readBy", "username imageUrl email _id");
  }


  async markMessagesAsRead(conversationId: string, userId: string) {
    return Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
  }
}
