import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: string[]; // Array of lesson IDs
  completedTopics: string[]; // Array of topic IDs
  currentLesson?: string;
  currentTopic?: string;
  progressPercentage: number;
  timeSpent: number; // in minutes
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: Array<{
    lessonId: string;
    topicId: string;
    content: string;
    createdAt: Date;
  }>;
  bookmarks: Array<{
    lessonId: string;
    topicId: string;
    title: string;
    createdAt: Date;
  }>;
}

const CourseProgressSchema = new Schema<ICourseProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'GeneralCourse',
    required: true
  },
  completedLessons: [{
    type: String,
    required: true
  }],
  completedTopics: [{
    type: String,
    required: true
  }],
  currentLesson: {
    type: String
  },
  currentTopic: {
    type: String
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
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  notes: [{
    lessonId: { type: String, required: true },
    topicId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  bookmarks: [{
    lessonId: { type: String, required: true },
    topicId: { type: String, required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one progress record per user-course pair
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Indexes for efficient queries
CourseProgressSchema.index({ userId: 1, status: 1 });
CourseProgressSchema.index({ userId: 1, lastAccessedAt: -1 });

export default mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);