import mongoose, { Document, Schema } from 'mongoose';

export interface IContestLeaderboard extends Document {
  contestId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  totalScore: number;
  totalPenalty: number; // penalty time in minutes
  problemsSolved: number;
  lastSubmissionTime: Date;
  rank: number;
  problemScores: {
    problemId: mongoose.Types.ObjectId;
    score: number;
    attempts: number;
    solvedAt?: Date;
    penalty: number;
  }[];
  isActive: boolean;
}

const ContestLeaderboardSchema: Schema = new Schema({
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
  username: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  totalPenalty: {
    type: Number,
    default: 0
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  lastSubmissionTime: {
    type: Date,
    default: Date.now
  },
  rank: {
    type: Number,
    default: 0
  },
  problemScores: [{
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    solvedAt: {
      type: Date
    },
    penalty: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique contest-user combination
ContestLeaderboardSchema.index({ contestId: 1, userId: 1 }, { unique: true });

// Index for leaderboard ranking
ContestLeaderboardSchema.index({ 
  contestId: 1, 
  totalScore: -1, 
  totalPenalty: 1, 
  lastSubmissionTime: 1 
});

export default mongoose.model<IContestLeaderboard>('ContestLeaderboard', ContestLeaderboardSchema);