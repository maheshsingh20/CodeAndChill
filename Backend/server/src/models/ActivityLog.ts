import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  sessions: {
    startTime: Date;
    endTime?: Date;
    duration: number; // in seconds
    activities: {
      type: 'course_viewing' | 'problem_solving' | 'quiz_taking' | 'skill_testing' | 'forum_browsing' | 'general_browsing';
      startTime: Date;
      endTime?: Date;
      duration: number; // in seconds
      metadata?: {
        courseId?: string;
        problemId?: string;
        quizId?: string;
        skillTestId?: string;
        page?: string;
      };
    }[];
  }[];
  totalTimeSpent: number; // total seconds for the day
  lastActivity: Date;
}

const ActivityLogSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sessions: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date
    },
    duration: {
      type: Number,
      default: 0
    },
    activities: [{
      type: {
        type: String,
        enum: ['course_viewing', 'problem_solving', 'quiz_taking', 'skill_testing', 'forum_browsing', 'general_browsing'],
        required: true
      },
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date
      },
      duration: {
        type: Number,
        default: 0
      },
      metadata: {
        courseId: String,
        problemId: String,
        quizId: String,
        skillTestId: String,
        page: String
      }
    }]
  }],
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
ActivityLogSchema.index({ userId: 1, date: 1 }, { unique: true });
ActivityLogSchema.index({ userId: 1, lastActivity: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);