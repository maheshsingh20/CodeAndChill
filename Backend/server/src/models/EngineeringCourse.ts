import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  order: number;
  isCompleted?: boolean;
  codeExamples?: {
    language: string;
    code: string;
    description: string;
  }[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

export interface IModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
}

export interface IEngineeringCourse extends Document {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  totalLessons: number;
  estimatedHours: number;
  category: string;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  modules: IModule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin ID
}

const LessonSchema = new Schema<ILesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  videoUrl: { type: String },
  duration: { type: Number, default: 30 },
  order: { type: Number, required: true },
  codeExamples: [{
    language: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String }
  }],
  quiz: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String }
  }]
});

const ModuleSchema = new Schema<IModule>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  lessons: [LessonSchema]
});

const EngineeringCourseSchema = new Schema<IEngineeringCourse>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true 
  },
  duration: { type: String, required: true },
  totalLessons: { type: Number, required: true },
  estimatedHours: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }],
  modules: [ModuleSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, required: true }
}, {
  timestamps: true
});

// Create indexes
EngineeringCourseSchema.index({ id: 1 });
EngineeringCourseSchema.index({ category: 1 });
EngineeringCourseSchema.index({ difficulty: 1 });
EngineeringCourseSchema.index({ isActive: 1 });

export default mongoose.model<IEngineeringCourse>('EngineeringCourse', EngineeringCourseSchema);