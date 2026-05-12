import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConversationParticipant {
  userId: Types.ObjectId;
  lastSeen?: Date;
  unreadCount: number;
}

export interface IConversation extends Document {
  workspaceId: Types.ObjectId;
  participants: IConversationParticipant[];
  lastMessage?: Types.ObjectId;
  conversationKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        lastSeen: {
          type: Date,
          default: null,
        },
        unreadCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    // This will uniquely identify conversation pairs
    conversationKey: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ "participants.userId": 1 });

ConversationSchema.index({ workspaceId: 1 });

ConversationSchema.index({ conversationKey: 1 }, { unique: true });

ConversationSchema.pre<IConversation>("validate", function(next) {
  if (this.isNew) {
    const sortedParticipants = this.participants
      .map(p => p.userId.toString())
      .sort((a, b) => a.localeCompare(b))
      .join('_');
    
    this.conversationKey = `${this.workspaceId}_${sortedParticipants}`;
  }
  next();
});

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);