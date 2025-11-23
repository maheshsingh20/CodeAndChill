import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  learningPathId: mongoose.Types.ObjectId;
  achievementType: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

const AchievementSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  achievementType: {
    type: String,
    required: true,
    enum: [
      'quick-start',
      '7-day-streak',
      'knowledge-seeker',
      'milestone-master',
      'path-completer',
      'top-performer',
      'speed-learner',
      'perfect-score'
    ]
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

AchievementSchema.index({ userId: 1, learningPathId: 1 });
AchievementSchema.index({ userId: 1, achievementType: 1 }, { unique: true });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
