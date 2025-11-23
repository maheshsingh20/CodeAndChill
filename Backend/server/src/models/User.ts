import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  location: string;
  occupation: string;
  bio: string;
  joinDate: Date;
  skills: string[];
  attempts: mongoose.Types.ObjectId[];
  profilePicture?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  totalQuizzesTaken: number;
  totalCoursesCompleted: number;
  completedCourses: Array<{
    courseId: mongoose.Types.ObjectId;
    courseTitle: string;
    completedAt: Date;
    certificateId?: string;
  }>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  totalPoints?: number;
  contestsWon?: number;
  contestsParticipated?: Array<{
    contestId: mongoose.Types.ObjectId;
    contestName: string;
    rank: number;
    score: number;
    problemsSolved: number;
    participatedAt: Date;
  }>;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      achievements: boolean;
    };
  };
  presence?: {
    status: 'online' | 'offline' | 'away';
    activity: string;
    lastSeen: Date;
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "Not specified" },
  occupation: { type: String, default: "Developer" },
  bio: { type: String, default: "Learning and growing every day!" },
  joinDate: { type: Date, default: Date.now },
  skills: { type: [String], default: [] },
  attempts: [{ type: Schema.Types.ObjectId, ref: "QuizAttempt" }],
  profilePicture: { type: String, default: "" },
  phone: { type: String, default: "" },
  website: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  twitter: { type: String, default: "" },
  totalProblemsAttempted: { type: Number, default: 0 },
  totalProblemsSolved: { type: Number, default: 0 },
  totalQuizzesTaken: { type: Number, default: 0 },
  totalCoursesCompleted: { type: Number, default: 0 },
  completedCourses: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseTitle: { type: String },
    completedAt: { type: Date, default: Date.now },
    certificateId: { type: String }
  }],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  totalPoints: { type: Number, default: 0 },
  contestsWon: { type: Number, default: 0 },
  contestsParticipated: [{
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest' },
    contestName: { type: String },
    rank: { type: Number },
    score: { type: Number },
    problemsSolved: { type: Number },
    participatedAt: { type: Date, default: Date.now }
  }],
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    }
  },
  presence: {
    status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    activity: { type: String, default: '' },
    lastSeen: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>("User", userSchema);