import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js"; // Use .js extension

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

const operatingSystemsData = {
  courseTitle: "Operating Systems",
  slug: "operating-systems", // The unique ID for the URL
  modules: [
    {
      title: "Module 1: Introduction to OS",
      topics: [
        {
          title: "What is an Operating System?",
          subtopics: [
            { title: "Definition and Goals", content: "An Operating System (OS) is a software that acts as an intermediary between computer hardware and the computer user. The primary goals of an OS are to make the computer system convenient to use and to utilize the computer hardware in an efficient manner." },
            { title: "Types of OS", content: "There are several types of operating systems, including Batch OS, Time-Sharing OS, Distributed OS, Network OS, and Real-Time OS. Each is designed for a specific purpose." },
          ]
        },
        {
          title: "Structure of an OS",
          subtopics: [
            { title: "Monolithic Kernel", content: "In a monolithic kernel, the entire operating system runs as a single large process in kernel space. It's simple but less modular." },
            { title: "Microkernel", content: "A microkernel provides only the essential services like process scheduling and memory management, while other services run in user space." },
          ]
        }
      ]
    },
    // Add the rest of your course modules, topics, and subtopics here
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");
    await Course.deleteOne({ slug: "operating-systems" });
    const newCourse = await Course.create(operatingSystemsData);
    console.log("✅ 'Operating Systems' course seeded successfully!");
    console.log("Use this slug in your URL:", newCourse.slug);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();