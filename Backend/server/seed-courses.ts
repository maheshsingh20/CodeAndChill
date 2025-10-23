import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Schema Definitions ---
const SubtopicSchema = new mongoose.Schema({
  id: { type: String, required: true },
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
  slug: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
});

const Course = mongoose.model("Course", CourseSchema);

// --- The Course Data ---
const coursesToSeed = [
  {
    courseTitle: "Operating Systems",
    slug: "operating-systems",
    modules: [
      {
        title: "Module 1: Introduction to OS",
        topics: [
          {
            title: "What is an Operating System?",
            subtopics: [
              {
                id: "os-intro-definition",
                title: "Definition and Goals",
                content:
                  "An Operating System (OS) is a software that acts as an intermediary between computer hardware and the computer user. The primary goals of an OS are to make the computer system convenient to use and to utilize the computer hardware in an efficient manner.",
              },
              {
                id: "os-intro-types",
                title: "Types of OS",
                content:
                  "There are several types of operating systems, including Batch OS, Time-Sharing OS, Distributed OS, Network OS, and Real-Time OS. Each is designed for a specific purpose.",
              },
            ],
          },
          {
            title: "Structure of an OS",
            subtopics: [
              {
                id: "os-struct-monolithic",
                title: "Monolithic Kernel",
                content:
                  "In a monolithic kernel, the entire operating system runs as a single large process in kernel space. It's simple but less modular.",
              },
              {
                id: "os-struct-microkernel",
                title: "Microkernel",
                content:
                  "A microkernel provides only the essential services like process scheduling and memory management, while other services run in user space.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    courseTitle: "Database Management Systems",
    slug: "dbms",
    modules: [
      {
        title: "Module 1: Introduction to Databases",
        topics: [
          {
            title: "What is a DBMS?",
            subtopics: [
              {
                id: "dbms-intro-definition",
                title: "Definition",
                content:
                  "A Database Management System (DBMS) is software for creating and managing databases, providing users and programmers with a systematic way to create, retrieve, update and manage data.",
              },
            ],
          },
        ],
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for course seeding...");

    // Clear the entire Course collection to ensure a fresh start
    await Course.deleteMany({});
    console.log("Existing courses cleared.");

    // Insert all the courses from the array
    await Course.insertMany(coursesToSeed);
    console.log("✅ All engineering courses have been seeded successfully!");
  } catch (error) {
    console.error("Error seeding courses:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
