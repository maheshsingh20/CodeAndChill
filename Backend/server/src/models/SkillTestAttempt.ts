import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillTestAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  skillTestId: mongoose.Types.ObjectId;
  skillName: string;
  answers: {
    questionId: string;
    answer: string | number;
    isCorrect: boolean;
    points: number;
    timeSpent: number; // in seconds
  }[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // total time in seconds
  startedAt: Date;
  completedAt: Date;
  skillAwarded: boolean; // whether skill was added to user profile
}

const SkillTestAttemptSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillTestId: {
    type: Schema.Types.ObjectId,
    ref: 'SkillTest',
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    answer: {
      type: Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    timeSpent: {
      type: Number,
      default: 0
    }
  }],
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  skillAwarded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
SkillTestAttemptSchema.index({ userId: 1, skillTestId: 1 });
SkillTestAttemptSchema.index({ userId: 1, passed: 1 });
SkillTestAttemptSchema.index({ skillName: 1, passed: 1 });

export default mongoose.model<ISkillTestAttempt>('SkillTestAttempt', SkillTestAttemptSchema);