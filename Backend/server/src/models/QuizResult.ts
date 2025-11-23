import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  learningPathId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
  timeSpent: number; // in seconds
  completedAt: Date;
}

const QuizResultSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: Number,
      required: true
    },
    correctAnswer: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  timeSpent: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

QuizResultSchema.index({ userId: 1, courseId: 1, lessonId: 1 });
QuizResultSchema.index({ userId: 1, learningPathId: 1 });

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
