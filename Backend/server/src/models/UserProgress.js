import mongoose, { Schema } from "mongoose";

const UserProgressSchema = new mongoose.Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  completedSubtopics: {
    type: [String], // Array of subtopic IDs, e.g., ["intro-definition", "intro-types"]
    default: []
  },
});

// Create a compound index to ensure a user has only one progress document per course
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

export default UserProgress;