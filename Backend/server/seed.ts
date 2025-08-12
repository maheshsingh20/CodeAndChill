import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

const SubtopicSchema = new mongoose.Schema({ id: { type: String, required: true }, title: { type: String, required: true }, content: { type: String, required: true } });
const TopicSchema = new mongoose.Schema({ title: { type: String, required: true }, subtopics: [SubtopicSchema] });
const ModuleSchema = new mongoose.Schema({ title: { type: String, required: true }, topics: [TopicSchema] });
const CourseSchema = new mongoose.Schema({ courseTitle: { type: String, required: true }, slug: { type: String, required: true, unique: true }, modules: [ModuleSchema]});
const Course = mongoose.model("Course", CourseSchema);

const operatingSystemsData = {
  courseTitle: "Operating Systems",
  slug: "operating-systems",
  modules: [
    {
      title: "Module 1: Introduction to OS",
      topics: [
        {
          title: "What is an Operating System?",
          subtopics: [
            { id: "intro-definition", title: "Definition and Goals", content: "An Operating System (OS) is a software that acts as an intermediary between computer hardware and the computer user. The primary goals of an OS are to make the computer system convenient to use and to utilize the computer hardware in an efficient manner." },
            { id: "intro-types", title: "Types of OS", content: "There are several types of operating systems, including Batch OS, Time-Sharing OS, Distributed OS, Network OS, and Real-Time OS. Each is designed for a specific purpose." },
          ]
        },
        {
          title: "Structure of an OS",
          subtopics: [
            { id: "struct-monolithic", title: "Monolithic Kernel", content: "In a monolithic kernel, the entire operating system runs as a single large process in kernel space. It's simple but less modular." },
            { id: "struct-microkernel", title: "Microkernel", content: "A microkernel provides only the essential services like process scheduling and memory management, while other services run in user space." },
          ]
        }
      ]
    },
    // Add more modules here to make the course content complete
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");
    await Course.deleteOne({ slug: "operating-systems" });
    const newCourse = await Course.create(operatingSystemsData);
    console.log("✅ 'Operating Systems' course seeded successfully!", newCourse._id);
  } catch (error) { console.error("Error seeding:", error);
  } finally { await mongoose.connection.close(); }
};

seedDatabase();