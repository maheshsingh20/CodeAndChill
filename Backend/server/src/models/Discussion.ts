import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  learningPathId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  isPinned: boolean;
  likes: mongoose.Types.ObjectId[];
  replies: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionSchema: Schema = new Schema({
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

DiscussionSchema.index({ learningPathId: 1, createdAt: -1 });
DiscussionSchema.index({ userId: 1 });
DiscussionSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
