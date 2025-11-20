import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProblem extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  status: 'attempted' | 'solved';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bestSubmissionId?: mongoose.Types.ObjectId;
  attempts: number;
  firstAttemptAt: Date;
  solvedAt?: Date;
  bestScore: number;
  bestExecutionTime: number;
  language: string;
}

const UserProblemSchema = new Schema<IUserProblem>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  status: {
    type: String,
    enum: ['attempted', 'solved'],
    default: 'attempted'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  bestSubmissionId: {
    type: Schema.Types.ObjectId,
    ref: 'Submission'
  },
  attempts: {
    type: Number,
    default: 0
  },
  firstAttemptAt: {
    type: Date,
    default: Date.now
  },
  solvedAt: {
    type: Date
  },
  bestScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bestExecutionTime: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one record per user-problem pair
UserProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Indexes for efficient queries
UserProblemSchema.index({ userId: 1, status: 1, difficulty: 1 });
UserProblemSchema.index({ userId: 1, solvedAt: -1 });

export default mongoose.model<IUserProblem>('UserProblem', UserProblemSchema);