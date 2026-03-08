import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant {
  userId: string;
  name: string;
  joinedAt: Date;
  isController: boolean;
}

export interface IChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export interface ICollaborativeSession extends Document {
  sessionCode: string;
  hostId: string;
  hostName: string;
  participants: IParticipant[];
  currentCode: string;
  language: string;
  controllerId: string;
  chatHistory: IChatMessage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  isController: { type: Boolean, default: false }
});

const ChatMessageSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const CollaborativeSessionSchema = new Schema({
  sessionCode: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  hostId: { type: String, required: true },
  hostName: { type: String, required: true },
  participants: [ParticipantSchema],
  currentCode: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  controllerId: { type: String, required: true },
  chatHistory: [ChatMessageSchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Auto-expire inactive sessions after 24 hours
CollaborativeSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

export const CollaborativeSession = mongoose.model<ICollaborativeSession>(
  'CollaborativeSession',
  CollaborativeSessionSchema
);
;