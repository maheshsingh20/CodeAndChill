import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// Define the necessary models directly in this file
const ProblemSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  // Add other problem fields if needed for the query
});
const Problem = mongoose.model("Problem", ProblemSchema);

const ProblemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  problemsCount: { type: Number, required: true },
  problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }] 
});
const ProblemSet = mongoose.model("ProblemSet", ProblemSetSchema);


const seedProblemSets = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for problem set seeding...");

    // 1. Find the problems you want to add to the set
    const twoSumProblem = await Problem.findOne({ slug: 'two-sum' });
    const reverseStringProblem = await Problem.findOne({ slug: 'reverse-string' });

    if (!twoSumProblem || !reverseStringProblem) {
      console.error("Could not find required problems. Please run the problem seeder first.");
      await mongoose.connection.close();
      return;
    }

    // 2. Define the Problem Set data
    const sdaSheetData = {
      title: "SDA Problem Set",
      slug: "sda-sheet",
      description: "A curated list of essential DSA problems to master data structures and algorithms.",
      author: "Striver",
      problemsCount: 2,
      problems: [twoSumProblem._id, reverseStringProblem._id] // Link the actual problem IDs
    };

    // 3. Create the Problem Set in the database
    await ProblemSet.deleteOne({ slug: "sda-sheet" });
    await ProblemSet.create(sdaSheetData);
    console.log("✅ 'SDA Problem Set' seeded successfully!");

  } catch (error) {
    console.error("Error seeding problem sets:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedProblemSets();