import mongoose from "mongoose";
import { Conversation, IConversation } from "../../models/conversation";
import { createError } from "../../middleware/errorHandler";
import { Message } from "../../models/message";

export class ChatRepository {
  async findOrCreateConversation(
    workspaceId: string,
    userId1: string,
    userId2: string
  ): Promise<IConversation> {
    const workspaceObjId = new mongoose.Types.ObjectId(workspaceId);
    const user1ObjId = new mongoose.Types.ObjectId(userId1);
    const user2ObjId = new mongoose.Types.ObjectId(userId2);

    const sortedParticipants = [userId1, userId2]
      .sort((a, b) => a.localeCompare(b))
      .join("_");
    const conversationKey = `${workspaceId}_${sortedParticipants}`;

    try {
      const existing = await Conversation.findOne({ conversationKey });
      if (existing) return existing;

      const newConversation = new Conversation({
        workspaceId: workspaceObjId,
        participants: [
          { userId: user1ObjId, unreadCount: 0, lastSeen: null },
          { userId: user2ObjId, unreadCount: 0, lastSeen: null },
        ],
      });

      await newConversation.validate();
      await newConversation.save();

      return newConversation;
    } catch (error: any) {
      if (error.code === 11000) {
        const existing = await Conversation.findOne({ conversationKey });
        if (existing) return existing;
      }
      throw createError("CONVERSATION_CREATION_FAILED");
    }
  }

  async getUserConversations(
    workspaceId: string,
    userId: string
  ): Promise<IConversation[]> {
    try {
      return await Conversation.find({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
        "participants.userId": new mongoose.Types.ObjectId(userId),
      })
        .populate({
          path: "participants.userId",
          select: "_id username imageUrl online",
        })
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "_id username imageUrl",
          },
        })
        .sort({ updatedAt: -1 });
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }

  async createMessage(
    conversationId: string,
    senderId: string,
    content: string,
    toUserId: string
  ) {
    try {
      const message = await Message.create({
        conversationId: new mongoose.Types.ObjectId(conversationId),
        sender: new mongoose.Types.ObjectId(senderId),
        toUserId: new mongoose.Types.ObjectId(toUserId),
        content,
        readBy: [new mongoose.Types.ObjectId(senderId)],
      });

      await Conversation.updateOne(
        { _id: new mongoose.Types.ObjectId(conversationId) },
        {
          $set: { lastMessage: message._id },
          $inc: {
            "participants.$[elem].unreadCount": 1,
          },
        },
        {
          arrayFilters: [
            {
              "elem.userId": { $ne: new mongoose.Types.ObjectId(senderId) },
            },
          ],
        }
      );

      return message;
    } catch (err) {
      throw createError("DB_QUERY_FAILED");
    }
  }
  async deleteMessage(messageId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deleted = await Message.findOneAndDelete(
        {
          _id: new mongoose.Types.ObjectId(messageId),
          sender: new mongoose.Types.ObjectId(userId),
        },
        { session }
      );

      if (!deleted) {
        throw createError("DB_QUERY_FAILED");
      }

      const conversation = await Conversation.findOne({
        lastMessage: deleted._id,
      });

      if (conversation) {
        const latestMessage = await Message.findOne({
          conversationId: conversation._id,
        })
          .sort({ createdAt: -1 })
          .session(session);

        await Conversation.updateOne(
          { _id: conversation._id },
          { $set: { lastMessage: latestMessage?._id || null } },
          { session }
        );
      }

      await session.commitTransaction();
      return deleted;
    } catch (err) {
      await session.abortTransaction();
      throw createError("DB_QUERY_FAILED");
    } finally {
      session.endSession();
    }
  }

  async markAsRead(conversationId: string, userId: string) {
    try {
      const result = await Conversation.updateOne(
        {
          _id: new mongoose.Types.ObjectId(conversationId),
          "participants.userId": new mongoose.Types.ObjectId(userId),
        },
        {
          $set: {
            "participants.$.unreadCount": 0,
            "participants.$.lastSeen": new Date(),
          },
        }
      );

      await Message.updateMany(
        {
          conversationId: new mongoose.Types.ObjectId(conversationId),
          readBy: { $ne: new mongoose.Types.ObjectId(userId) },
        },
        { $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
      );
    } catch (err) {
      console.error("markAsRead error:", err);
      throw createError("DB_QUERY_FAILED");
    }
  }
}
