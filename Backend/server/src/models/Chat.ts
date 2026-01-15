import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  participantDetails: {
    userId: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    lastSeen?: Date;
  }[];
  messages: IMessage[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: Map<string, number>;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  fileUrl: { type: String },
  fileName: { type: String }
});

const ChatSchema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  participantDetails: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    lastSeen: { type: Date }
  }],
  messages: [MessageSchema],
  lastMessage: { type: String },
  lastMessageTime: { type: Date },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupAvatar: { type: String }
}, {
  timestamps: true
});

// Index for faster queries
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageTime: -1 });

export default mongoose.model<IChat>('Chat', ChatSchema);
