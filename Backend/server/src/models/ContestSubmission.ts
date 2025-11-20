import mongoose, { Document, Schema } from 'mongoose';

export interface IContestSubmission extends Document {
  contestId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  score: number;
  executionTime: number; // in milliseconds
  memoryUsed: number; // in KB
  testCasesPassed: number;
  totalTestCases: number;
  submittedAt: Date;
  judgedAt?: Date;
  penalty: number; // penalty minutes for wrong submissions
}

const ContestSubmissionSchema: Schema = new Schema({
  contestId: {
    type: Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
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
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'typescript', 'go', 'rust']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  executionTime: {
    type: Number,
    default: 0
  },
  memoryUsed: {
    type: Number,
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  judgedAt: {
    type: Date
  },
  penalty: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
ContestSubmissionSchema.index({ contestId: 1, userId: 1, problemId: 1 });
ContestSubmissionSchema.index({ contestId: 1, status: 1 });
ContestSubmissionSchema.index({ userId: 1, submittedAt: -1 });
ContestSubmissionSchema.index({ contestId: 1, submittedAt: -1 });

export default mongoose.model<IContestSubmission>('ContestSubmission', ContestSubmissionSchema);