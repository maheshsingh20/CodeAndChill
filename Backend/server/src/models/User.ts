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
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      achievements: boolean;
    };
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
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>("User", userSchema);