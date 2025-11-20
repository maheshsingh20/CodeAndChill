import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  questionText: string;
  options: IOption[];
  explanation?: string;
}

export interface ISubject extends Document {
  name: string;
  slug: string;
  description: string;
}

export interface IQuiz extends Document {
  title: string;
  slug: string;
  subject: Types.ObjectId;
  questions: IQuestion[];
}

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: any;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: [OptionSchema],
  explanation: String,
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  questions: [QuestionSchema],
});

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: { type: Object, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);
export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
export const QuizAttempt = mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);