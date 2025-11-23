import mongoose, { Document, Schema } from 'mongoose';

export interface IVideoProgress extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
  watchedDuration: number; // in seconds
  lastPosition: number; // in seconds
  completed: boolean;
  completedAt?: Date;
  watchHistory: {
    timestamp: Date;
    duration: number;
  }[];
}

const VideoProgressSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  watchedDuration: {
    type: Number,
    default: 0,
    min: 0
  },
  lastPosition: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  watchHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
VideoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });
VideoProgressSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<IVideoProgress>('VideoProgress', VideoProgressSchema);
