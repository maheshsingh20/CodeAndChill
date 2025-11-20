import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningPath extends Document {
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in hours
  prerequisites: string[];
  tags: string[];
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  courses: {
    courseId: mongoose.Types.ObjectId;
    order: number;
    isRequired: boolean;
    estimatedHours: number;
  }[];
  milestones: {
    title: string;
    description: string;
    courseIds: mongoose.Types.ObjectId[];
    order: number;
  }[];
  enrollmentCount: number;
  completionRate: number;
  averageRating: number;
  totalRatings: number;
}

const LearningPathSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🎯'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedDuration: {
    type: Number,
    required: true,
    min: 1
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    estimatedHours: {
      type: Number,
      default: 2
    }
  }],
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    courseIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
    order: {
      type: Number,
      required: true
    }
  }],
  enrollmentCount: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
LearningPathSchema.index({ isPublic: 1, difficulty: 1 });
LearningPathSchema.index({ tags: 1 });
LearningPathSchema.index({ createdBy: 1 });
LearningPathSchema.index({ enrollmentCount: -1 });
LearningPathSchema.index({ averageRating: -1 });

export default mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);