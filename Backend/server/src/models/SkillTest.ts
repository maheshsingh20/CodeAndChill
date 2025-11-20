import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillTest extends Document {
  skillName: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  passingScore: number; // percentage required to pass
  questions: {
    id: string;
    question: string;
    type: 'multiple_choice' | 'code' | 'true_false';
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
    codeTemplate?: string; // for coding questions
    testCases?: {
      input: string;
      expectedOutput: string;
    }[];
  }[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillTestSchema: Schema = new Schema({
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 5,
    max: 180
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 70
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'code', 'true_false'],
      required: true
    },
    options: [{
      type: String
    }],
    correctAnswer: {
      type: Schema.Types.Mixed,
      required: true
    },
    explanation: {
      type: String
    },
    points: {
      type: Number,
      required: true,
      min: 1
    },
    codeTemplate: {
      type: String
    },
    testCases: [{
      input: String,
      expectedOutput: String
    }]
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
SkillTestSchema.index({ skillName: 1, difficulty: 1 });
SkillTestSchema.index({ isActive: 1 });
SkillTestSchema.index({ tags: 1 });

export default mongoose.model<ISkillTest>('SkillTest', SkillTestSchema);