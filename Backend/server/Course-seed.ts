import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Schema Definitions ---
const TopicSchema = new Schema({
  title: { type: String, required: true },
  contentType: {
    type: String,
    enum: ["video", "text", "table"],
    required: true,
  },
  videoUrl: { type: String },
  textContent: { type: String },
  tableData: { type: [[String]] },
});

const LessonSchema = new Schema({
  title: { type: String, required: true },
  topics: [TopicSchema],
});

const ModuleSchema = new Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema],
});

const GeneralCourseSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tutor: { name: String, image: String },
  cost: { type: Number, required: true },
  modules: [ModuleSchema],
});
const GenralCourse = mongoose.model("GenralCourse", GeneralCourseSchema);

// --- The Complete GenralCourse Data ---
const coursesToSeed = [
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-dev",
    description:
      "Master the MERN stack and build real-world applications from scratch.",
    tutor: {
      name: "Jane Doe",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    cost: 49.99,
    modules: [
      {
        title: "Module 1: Frontend with React",
        lessons: [
          {
            title: "Introduction to React",
            topics: [
              {
                title: "What is React?",
                contentType: "text",
                textContent:
                  "React is a JavaScript library for building user interfaces. It allows developers to create large web applications that can update and render efficiently.",
              },
              {
                title: "Setting up Your Environment",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
              },
            ],
          },
          {
            title: "Components & Props",
            topics: [
              {
                title: "Functional Components",
                contentType: "text",
                textContent:
                  "Functional components are simple JavaScript functions that return React elements. They are the backbone of React UI.",
              },
              {
                title: "Passing Data with Props",
                contentType: "text",
                textContent:
                  "Props are arguments passed into React components. Props allow data to be passed from parent to child components.",
              },
            ],
          },
        ],
      },
      {
        title: "Module 2: Backend with Node.js & Express",
        lessons: [
          {
            title: "Creating Your First Server",
            topics: [
              {
                title: "Node.js Basics",
                contentType: "text",
                textContent:
                  "Node.js is a runtime environment that lets you run JavaScript on the server side.",
              },
              {
                title: "Express Setup",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/L72fhGm1tfE",
              },
            ],
          },
          {
            title: "RESTful APIs",
            topics: [
              {
                title: "What is REST?",
                contentType: "text",
                textContent:
                  "REST stands for Representational State Transfer. It is an architectural style for designing networked applications.",
              },
              {
                title: "CRUD Operations",
                contentType: "table",
                tableData: [
                  ["Operation", "HTTP Method", "Example"],
                  ["Create", "POST", "/api/items"],
                  ["Read", "GET", "/api/items/:id"],
                  ["Update", "PUT", "/api/items/:id"],
                  ["Delete", "DELETE", "/api/items/:id"],
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Module 3: MongoDB & Mongoose",
        lessons: [
          {
            title: "Introduction to MongoDB",
            topics: [
              {
                title: "What is MongoDB?",
                contentType: "text",
                textContent:
                  "MongoDB is a NoSQL database that stores data in JSON-like documents with dynamic schemas.",
              },
              {
                title: "Connecting with Mongoose",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/fgTGADljAeg",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Data Structures & Algorithms",
    slug: "dsa-foundations",
    description:
      "The foundation of all software engineering. Master key data structures and algorithms.",
    tutor: {
      name: "John Smith",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    cost: 0,
    modules: [
      {
        title: "Module 1: Arrays & Strings",
        lessons: [
          {
            title: "Introduction to Arrays",
            topics: [
              {
                title: "Array Basics",
                contentType: "text",
                textContent:
                  "An array is a collection of items stored at contiguous memory locations.",
              },
              {
                title: "Time Complexity",
                contentType: "table",
                tableData: [
                  ["Operation", "Big O"],
                  ["Access", "O(1)"],
                  ["Search", "O(n)"],
                  ["Insertion", "O(n)"],
                  ["Deletion", "O(n)"],
                ],
              },
            ],
          },
          {
            title: "String Manipulation",
            topics: [
              {
                title: "Common Operations",
                contentType: "text",
                textContent:
                  "Strings are sequences of characters. Common operations include concatenation, substring, and searching.",
              },
              {
                title: "String Reversal Example",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/0ZvaDa8eT5s",
              },
            ],
          },
        ],
      },
      {
        title: "Module 2: Linked Lists",
        lessons: [
          {
            title: "Introduction to Linked Lists",
            topics: [
              {
                title: "Singly vs Doubly Linked List",
                contentType: "text",
                textContent:
                  "A singly linked list has nodes that point to the next node. A doubly linked list has nodes that point both ways.",
              },
              {
                title: "Complexity",
                contentType: "table",
                tableData: [
                  ["Operation", "Singly Linked List", "Doubly Linked List"],
                  ["Insertion at head", "O(1)", "O(1)"],
                  ["Insertion at tail", "O(n)", "O(1)"],
                  ["Deletion", "O(n)", "O(n)"],
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Module 3: Sorting & Searching",
        lessons: [
          {
            title: "Sorting Algorithms",
            topics: [
              {
                title: "Bubble Sort",
                contentType: "text",
                textContent:
                  "Bubble sort repeatedly swaps adjacent elements if they are in wrong order. Time complexity O(n^2).",
              },
              {
                title: "Quick Sort",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/Hoixgm4-P4M",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Machine Learning Basics",
    slug: "ml-basics",
    description:
      "Kickstart your journey into Machine Learning. Learn concepts, algorithms, and real-world applications.",
    tutor: {
      name: "Alice Johnson",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    cost: 79.99,
    modules: [
      {
        title: "Module 1: Introduction to ML",
        lessons: [
          {
            title: "What is Machine Learning?",
            topics: [
              {
                title: "ML Overview",
                contentType: "text",
                textContent:
                  "Machine Learning is a subset of AI that enables systems to learn and improve from data without explicit programming.",
              },
              {
                title: "ML vs Traditional Programming",
                contentType: "table",
                tableData: [
                  ["Traditional Programming", "Machine Learning"],
                  ["Rules + Data = Output", "Data + Output = Rules"],
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Module 2: Supervised Learning",
        lessons: [
          {
            title: "Linear Regression",
            topics: [
              {
                title: "Concept",
                contentType: "text",
                textContent:
                  "Linear regression finds a linear relationship between dependent and independent variables.",
              },
              {
                title: "Example Video",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/nk2CQITm_eo",
              },
            ],
          },
        ],
      },
      {
        title: "Module 3: Neural Networks",
        lessons: [
          {
            title: "Introduction to Neural Networks",
            topics: [
              {
                title: "What is a Neural Network?",
                contentType: "text",
                textContent:
                  "Neural networks are computing systems inspired by the human brain, consisting of layers of nodes (neurons).",
              },
              {
                title: "Architecture Table",
                contentType: "table",
                tableData: [
                  ["Layer", "Function"],
                  ["Input Layer", "Receives input features"],
                  ["Hidden Layer", "Transforms input through weights"],
                  ["Output Layer", "Produces prediction/classification"],
                ],
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
    await GenralCourse.deleteMany({});
    console.log("Existing courses cleared.");
    await GenralCourse.insertMany(coursesToSeed);
    console.log("✅ Courses seeded successfully!");
  } catch (error) {
    console.error("Error seeding courses:", error);
  } finally {
    await mongoose.connection.close();
  }
};
seedDatabase();
