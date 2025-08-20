import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Define the Problem structure directly in this file ---
const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const ExampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  examples: [ExampleSchema],
  constraints: { type: [String], default: [] },
  testCases: [TestCaseSchema],
});

const Problem = mongoose.model("Problem", ProblemSchema);


// --- The data for the problems you want to add ---
const problemsToSeed = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    ],
    constraints: ["Only one valid answer exists."],
    testCases: [
        { input: "2 7 11 15\n9", expectedOutput: "0 1\n" },
        { input: "3 2 4\n6", expectedOutput: "1 2\n" },
    ]
  },
  {
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    topic: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.",
    examples: [{ input: `s = ["h","e","l","l","o"]`, output: `["o","l","l","e","h"]` }],
    constraints: ["1 <= s.length <= 10^5"],
    testCases: [{ input: "hello", expectedOutput: "olleh" }]
  },
  // Add more problem objects here...
];

const seedProblems = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for problem seeding...");
    await Problem.deleteMany({});
    console.log("Existing problems cleared.");
    await Problem.insertMany(problemsToSeed);
    console.log("✅ Problems seeded successfully!");
  } catch (error) {
    console.error("Error seeding problems:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedProblems();