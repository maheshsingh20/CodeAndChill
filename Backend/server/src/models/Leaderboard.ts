import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  totalScore: number;
  problemsSolved: number;
  coursesCompleted: number;
  averageQuizScore: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number; // in minutes
  rank: number;
  lastUpdated: Date;
  achievements: string[];
  skillLevels: {
    skill: string;
    level: number;
    experience: number;
  }[];
}

const LeaderboardSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  coursesCompleted: {
    type: Number,
    default: 0
  },
  averageQuizScore: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  achievements: [{
    type: String
  }],
  skillLevels: [{
    skill: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    experience: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Indexes for leaderboard queries
LeaderboardSchema.index({ totalScore: -1 });
LeaderboardSchema.index({ problemsSolved: -1 });
LeaderboardSchema.index({ rank: 1 });
LeaderboardSchema.index({ currentStreak: -1 });

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);