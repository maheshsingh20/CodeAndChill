import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Schema Definition ---
// The structure of a Quiz Subject is defined here.
const QuizSubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const QuizSubject = mongoose.model("QuizSubject", QuizSubjectSchema);

// --- Data to be Seeded ---
const subjectsToSeed = [
  {
    name: "JavaScript",
    description:
      "Test your knowledge of core JS concepts, from variables to advanced asynchronous programming.",
  },
  {
    name: "Python",
    description:
      "Challenge yourself with questions on Python syntax, data structures, and popular libraries.",
  },
  {
    name: "Data Structures & Algorithms",
    description:
      "Assess your understanding of fundamental data structures and algorithmic techniques.",
  },
  {
    name: "Computer Networks",
    description:
      "Explore the layers of the internet, protocols, and how devices communicate.",
  },
];

// --- The Seeding Script Logic ---
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for subject seeding...");

    await QuizSubject.deleteMany({});
    console.log("Old subjects cleared.");

    await QuizSubject.insertMany(subjectsToSeed);
    console.log("✅ Subjects seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDB();
