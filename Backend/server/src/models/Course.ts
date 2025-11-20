import mongoose, { Schema, Document } from "mongoose";

export interface ISubtopic {
  id: string;
  title: string;
  content: string;
  duration?: number; // in minutes
  videoUrl?: string;
  codeExamples?: {
    language: string;
    code: string;
    description: string;
  }[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'documentation' | 'exercise';
  }[];
}

export interface ITopic {
  title: string;
  subtopics: ISubtopic[];
}

export interface IModule {
  title: string;
  topics: ITopic[];
}

export interface ICourse extends Document {
  courseTitle: string;
  slug: string;
  modules: IModule[];
}

const SubtopicSchema = new Schema<ISubtopic>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: Number },
  videoUrl: { type: String },
  codeExamples: [{
    language: { type: String },
    code: { type: String },
    description: { type: String }
  }],
  quiz: [{
    question: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: Number }
  }],
  resources: [{
    title: { type: String },
    url: { type: String },
    type: { type: String, enum: ['article', 'video', 'documentation', 'exercise'] }
  }]
});

const TopicSchema = new Schema<ITopic>({
  title: { type: String, required: true },
  subtopics: [SubtopicSchema],
});

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  topics: [TopicSchema],
});

const CourseSchema = new Schema<ICourse>({
  courseTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
});

export const Course = mongoose.model<ICourse>("Course", CourseSchema);