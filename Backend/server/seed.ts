import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Schema Definitions ---
const SubtopicSchema = new mongoose.Schema({ id: { type: String, required: true }, title: { type: String, required: true }, content: { type: String, required: true } });
const TopicSchema = new mongoose.Schema({ title: { type: String, required: true }, subtopics: [SubtopicSchema] });
const ModuleSchema = new mongoose.Schema({ title: { type: String, required: true }, topics: [TopicSchema] });
const CourseSchema = new mongoose.Schema({ courseTitle: { type: String, required: true }, slug: { type: String, required: true, unique: true }, modules: [ModuleSchema]});
const Course = mongoose.model("Course", CourseSchema);

// --- NEW: Array containing all courses to be seeded ---
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
              { id: "os-intro-definition", title: "Definition and Goals", content: "An Operating System is a System software that manages all the resources of the computing devicee, including hardware and software resources. It acts as an intermediary between users and the computer hardware.Acts as an interface between the software and different parts of the computer or the computer hardware. Manages the overall resources and operations of the computer.Controls and monitors the execution of all other programs that reside in the computer, which also includes application programs and other system software of the computer.Examples of Operating Systems are Windows, Linux, macOS, Android, iOS, etc." },
              { id: "os-intro-types", title: "Types of OS", content: "There are several types of operating systems, including Batch OS, Time-Sharing OS, Distributed OS..." },
            ]
          },
          {
            title: "Structure of an OS",
            subtopics: [
              { id: "os-struct-monolithic", title: "Monolithic Kernel", content: "In a monolithic kernel, the entire operating system runs as a single large process in kernel space..." },
            ]
          }
        ]
      },
      {
        title: "Module 2: Process Management",
        topics: [
            {
                title: "CPU Scheduling",
                subtopics: [
                    { id: "os-pm-scheduling-fcfs", title: "First-Come, First-Served (FCFS)", content: "FCFS is the simplest scheduling algorithm..." },
                ]
            }
        ]
      }
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
                        { id: "dbms-intro-definition", title: "Definition", content: "A Database Management System (DBMS) is software for creating and managing databases..." }
                    ]
                }
            ]
        }
    ]
  },
  {
    courseTitle: "Computer Networks",
    slug: "computer-networks",
    modules: [
        {
            title: "Module 1: The OSI Model",
            topics: [
                {
                    title: "Introduction to Layered Architecture",
                    subtopics: [
                        { id: "cn-osi-intro", title: "Why Layering?", content: "Layering simplifies network design by dividing complex tasks into smaller, manageable pieces..." }
                    ]
                }
            ]
        }
    ]
  },
  {
    courseTitle: "Data Structures & Algorithms",
    slug: "dsa",
    modules: [
        {
            title: "Module 1: Arrays & Strings",
            topics: [
                {
                    title: "Introduction to Arrays",
                    subtopics: [
                        { id: "dsa-arrays-intro", title: "What is an Array?", content: "An array is a data structure consisting of a collection of elements, each identified by at least one array index or key..." }
                    ]
                }
            ]
        }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear the entire Course collection to ensure a fresh start
    await Course.deleteMany({});
    console.log("Existing courses cleared.");

    // Insert all the courses from the array
    await Course.insertMany(coursesToSeed);
    console.log("✅ All new courses have been seeded successfully!");

  } catch (error) { 
    console.error("Error seeding database:", error);
  } finally { 
    await mongoose.connection.close(); 
  }
};

seedDatabase();