import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: string; // Changed from ObjectId to string to support engineering course identifiers
  completedLessons: string[];
  currentLesson: string;
  progressPercentage: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
  quizScores: {
    quizId: string;
    score: number;
    maxScore: number;
    completedAt: Date;
  }[];
  notes: {
    lessonId: string;
    timestamp: number;
    content: string;
    createdAt: Date;
  }[];
  certificates: {
    certificateId: string;
    issuedAt: Date;
    certificateUrl: string;
  }[];
}

const UserProgressSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String, // Changed from ObjectId to String to support engineering course identifiers
    required: true
  },
  completedLessons: [{
    type: String,
    required: true
  }],
  currentLesson: {
    type: String,
    default: ''
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  quizScores: [{
    quizId: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    lessonId: {
      type: String,
      required: true
    },
    timestamp: {
      type: Number,
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
  }],
  certificates: [{
    certificateId: {
      type: String,
      required: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    certificateUrl: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, lastAccessed: -1 });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);