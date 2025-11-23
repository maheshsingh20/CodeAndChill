import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningStreak extends Document {
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  activityDates: Date[];
}

const LearningStreakSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date
  },
  activityDates: [{
    type: Date
  }]
}, {
  timestamps: true
});

LearningStreakSchema.index({ userId: 1 });

export default mongoose.model<ILearningStreak>('LearningStreak', LearningStreakSchema);
