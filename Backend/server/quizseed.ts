import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Schema Definitions ---
const SubjectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  quizzes: [{ type: Schema.Types.ObjectId, ref: "Quiz" }], // ✅ added this
});

const OptionSchema = new Schema({
  text: String,
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new Schema({
  questionText: String,
  options: [OptionSchema],
  explanation: String,
});

const QuizSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  questions: [QuestionSchema],
});

const Subject = mongoose.model("Subject", SubjectSchema);
const Quiz = mongoose.model("Quiz", QuizSchema);

// --- The Complete Data ---
const subjectsToSeed = [
  {
    name: "JavaScript",
    slug: "javascript",
    description: "Test your knowledge of core JS concepts.",
  },
  {
    name: "Python",
    slug: "python",
    description: "Challenge yourself with questions on Python syntax.",
  },
  {
    name: "Operating System",
    slug: "operatingsystem",
    description: "Test your hold on operating system concepts.",
  },
  {
    name: "C++",
    slug: "cpp",
    description: "Evaluate your C++ programming knowledge.",
  },
  {
    name: "Databases",
    slug: "databases",
    description: "Test your SQL and database management system skills.",
  },
  {
    name: "Computer Networks",
    slug: "computernetworks",
    description: "Challenge yourself with questions on networking basics.",
  },
];

const quizzesToSeed = [
  {
    subjectSlug: "javascript",
    title: "JS Variables & Scope",
    slug: "js-variables-scope",
    questions: [
      {
        questionText: "Which keyword creates a block-scoped variable?",
        options: [
          { text: "var" },
          { text: "let", isCorrect: true },
          { text: "const", isCorrect: true },
          { text: "both let and const" },
        ],
        explanation: "`let` and `const` are block-scoped.",
      },
      {
        questionText: "What is the output of `typeof null`?",
        options: [
          { text: "null" },
          { text: "undefined" },
          { text: "object", isCorrect: true },
          { text: "boolean" },
        ],
        explanation:
          "Due to a long-standing bug, `typeof null` returns 'object'.",
      },
    ],
  },
  {
    subjectSlug: "python",
    title: "Python Data Types",
    slug: "python-data-types",
    questions: [
      {
        questionText: "Which of the following is an immutable data type?",
        options: [
          { text: "List" },
          { text: "Dictionary" },
          { text: "Tuple", isCorrect: true },
          { text: "Set" },
        ],
        explanation: "Tuples are immutable.",
      },
      {
        questionText: "Which is a Python framework?",
        options: [
          { text: "React" },
          { text: "Django", isCorrect: true },
          { text: "Spring Boot" },
          { text: "Laravel" },
        ],
        explanation: "Django is a popular Python web development framework.",
      },
    ],
  },
  {
    subjectSlug: "operatingsystem",
    title: "Types of Operating Systems",
    slug: "os-types",
    questions: [
      {
        questionText: "Which OS is based on time-sharing?",
        options: [
          { text: "Batch OS" },
          { text: "Real-time OS" },
          { text: "Time-sharing OS", isCorrect: true },
          { text: "Network OS" },
        ],
        explanation:
          "Time-sharing OS allows multiple users to share system resources simultaneously.",
      },
    ],
  },
  {
    subjectSlug: "cpp",
    title: "C++ Basics",
    slug: "cpp-basics",
    questions: [
      {
        questionText:
          "Which of the following is used to define a constant in C++?",
        options: [
          { text: "let" },
          { text: "#define", isCorrect: true },
          { text: "const", isCorrect: true },
          { text: "static" },
        ],
        explanation:
          "Both `#define` (preprocessor) and `const` keyword define constants.",
      },
      {
        questionText:
          "Which operator is used to allocate memory dynamically in C++?",
        options: [
          { text: "malloc" },
          { text: "calloc" },
          { text: "new", isCorrect: true },
          { text: "alloc" },
        ],
        explanation: "`new` operator allocates memory dynamically in C++.",
      },
    ],
  },
  {
    subjectSlug: "databases",
    title: "SQL Fundamentals",
    slug: "sql-fundamentals",
    questions: [
      {
        questionText:
          "Which SQL command is used to remove a table from a database?",
        options: [
          { text: "DELETE" },
          { text: "DROP", isCorrect: true },
          { text: "REMOVE" },
          { text: "TRUNCATE" },
        ],
        explanation: "`DROP` removes the table structure and data completely.",
      },
      {
        questionText: "Which of the following is a primary key property?",
        options: [
          { text: "Can have null values" },
          { text: "Must be unique", isCorrect: true },
          { text: "Can be duplicated" },
          { text: "None of the above" },
        ],
        explanation: "A primary key must be unique and cannot be null.",
      },
    ],
  },
  {
    subjectSlug: "computernetworks",
    title: "Networking Basics",
    slug: "networking-basics",
    questions: [
      {
        questionText: "Which device is used to connect different networks?",
        options: [
          { text: "Switch" },
          { text: "Hub" },
          { text: "Router", isCorrect: true },
          { text: "Repeater" },
        ],
        explanation: "Routers are used to connect different networks.",
      },
      {
        questionText: "What is the default port for HTTP?",
        options: [
          { text: "25" },
          { text: "21" },
          { text: "80", isCorrect: true },
          { text: "443" },
        ],
        explanation: "Port 80 is the default for HTTP, while 443 is for HTTPS.",
      },
    ],
  },
];


const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for full quiz seeding...");
    await Subject.deleteMany({});
    await Quiz.deleteMany({});
    console.log("Cleared existing subjects and quizzes.");

    const createdSubjects = await Subject.insertMany(subjectsToSeed);
    const subjectMap = new Map(createdSubjects.map((s) => [s.slug, s._id]));

    // Insert quizzes and also update subject's quizzes array
    for (const quiz of quizzesToSeed) {
      const subjectId = subjectMap.get(quiz.subjectSlug);
      const createdQuiz = await Quiz.create({ ...quiz, subject: subjectId });

      await Subject.findByIdAndUpdate(subjectId, {
        $push: { quizzes: createdQuiz._id },
      });
    }

    console.log("✅ All subjects and quizzes seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();