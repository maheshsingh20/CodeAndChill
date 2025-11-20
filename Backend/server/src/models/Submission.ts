import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  testResults: {
    testCaseId: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    executionTime: number;
    memoryUsed: number;
  }[];
  executionTime: number;
  memoryUsed: number;
  score: number;
  submittedAt: Date;
  judgedAt?: Date;
}

const SubmissionSchema: Schema = new Schema({
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
  testResults: [{
    testCaseId: {
      type: String,
      required: true
    },
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    actualOutput: {
      type: String,
      required: true
    },
    passed: {
      type: Boolean,
      required: true
    },
    executionTime: {
      type: Number,
      required: true
    },
    memoryUsed: {
      type: Number,
      required: true
    }
  }],
  executionTime: {
    type: Number,
    default: 0
  },
  memoryUsed: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  judgedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
SubmissionSchema.index({ userId: 1, submittedAt: -1 });
SubmissionSchema.index({ problemId: 1, status: 1 });
SubmissionSchema.index({ userId: 1, problemId: 1, submittedAt: -1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);