import mongoose from "mongoose";

const SubtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtopics: [SubtopicSchema],
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: [TopicSchema],
});

const CourseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // NEW: A unique ID for the URL
  modules: [ModuleSchema],
});

const Course = mongoose.model("Course", CourseSchema);

export default Course;