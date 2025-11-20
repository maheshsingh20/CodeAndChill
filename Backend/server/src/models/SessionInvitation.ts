import mongoose, { Document, Schema } from 'mongoose';

export interface ISessionInvitation extends Document {
  sessionId: mongoose.Types.ObjectId;
  fromUserId: mongoose.Types.ObjectId;
  fromUsername: string;
  toUserId: mongoose.Types.ObjectId;
  toUsername: string;
  toEmail?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  expiresAt: Date;
  respondedAt?: Date;
}

const SessionInvitationSchema: Schema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'CollaborativeSession',
    required: true
  },
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromUsername: {
    type: String,
    required: true
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUsername: {
    type: String,
    required: true
  },
  toEmail: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
SessionInvitationSchema.index({ toUserId: 1, status: 1 });
SessionInvitationSchema.index({ fromUserId: 1, status: 1 });
SessionInvitationSchema.index({ sessionId: 1 });
SessionInvitationSchema.index({ expiresAt: 1 });

export default mongoose.model<ISessionInvitation>('SessionInvitation', SessionInvitationSchema);