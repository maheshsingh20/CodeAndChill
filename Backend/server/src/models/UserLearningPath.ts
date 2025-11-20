import mongoose, { Document, Schema } from 'mongoose';

export interface IUserLearningPath extends Document {
  userId: mongoose.Types.ObjectId;
  pathId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  currentCourseId?: mongoose.Types.ObjectId;
  progress: {
    courseId: mongoose.Types.ObjectId;
    completedAt?: Date;
    progress: number; // 0-100
    timeSpent: number; // in minutes
  }[];
  milestoneProgress: {
    milestoneId: string;
    completedAt?: Date;
    isCompleted: boolean;
  }[];
  totalTimeSpent: number; // in minutes
  overallProgress: number; // 0-100
  rating?: number; // 1-5
  review?: string;
  isActive: boolean;
  lastAccessedAt: Date;
}

const UserLearningPathSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  currentCourseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  progress: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    completedAt: {
      type: Date
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    timeSpent: {
      type: Number,
      default: 0
    }
  }],
  milestoneProgress: [{
    milestoneId: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique user-path combination
UserLearningPathSchema.index({ userId: 1, pathId: 1 }, { unique: true });

// Indexes for efficient queries
UserLearningPathSchema.index({ userId: 1, isActive: 1 });
UserLearningPathSchema.index({ pathId: 1, overallProgress: -1 });
UserLearningPathSchema.index({ userId: 1, lastAccessedAt: -1 });

export default mongoose.model<IUserLearningPath>('UserLearningPath', UserLearningPathSchema);