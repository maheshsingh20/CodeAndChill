import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// ===== SCHEMA =====
const quizListSchema = new mongoose.Schema({
  quizList: {
    type: [String],
    required: true,
  },
  quizSubject: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: [Boolean],
    required: true,
  },
});

const QuizList = mongoose.model("QuizList", quizListSchema);

// ===== SEED DATA =====
const listToSeed = [
  {
    quizSubject: "JavaScript",
    quizList: [
      "Variables & Data Types",
      "Functions & Scope",
      "ES6+ Features",
      "Asynchronous Programming",
    ],
    status: [false, false, false, false], // initially not attempted
  },
  {
    quizSubject: "Python",
    quizList: [
      "Python Basics",
      "Data Structures",
      "Object-Oriented Programming",
      "Popular Libraries (NumPy, Pandas)",
    ],
    status: [false, false, false, false],
  },
  {
    quizSubject: "Data Structures & Algorithms",
    quizList: [
      "Arrays & Strings",
      "Linked Lists",
      "Sorting & Searching",
      "Dynamic Programming",
    ],
    status: [false, false, false, false],
  },
  {
    quizSubject: "Computer Networks",
    quizList: [
      "Network Layers",
      "TCP/IP & Protocols",
      "Routing & Switching",
      "Network Security Basics",
    ],
    status: [false, false, false, false],
  },
];
// ===== SEED FUNCTION =====
async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected ✅");

    await QuizList.deleteMany({});
    console.log("Old data cleared");

    await QuizList.insertMany(listToSeed);
    console.log("Seeding complete 🚀");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.disconnect();
  }
}

seedData();
