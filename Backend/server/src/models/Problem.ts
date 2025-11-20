import mongoose, { Schema, Document } from "mongoose";

export interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IProblem extends Document {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
  examples: IExample[];
  constraints: string[];
  testCases: ITestCase[];
}

export interface IProblemSet extends Document {
  title: string;
  slug: string;
  description: string;
  author: string;
  problems: mongoose.Types.ObjectId[];
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const ExampleSchema = new Schema<IExample>({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
});

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  examples: [ExampleSchema],
  constraints: { type: [String], default: [] },
  testCases: [TestCaseSchema],
});

const ProblemSetSchema = new Schema<IProblemSet>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  problems: [{ type: Schema.Types.ObjectId, ref: "Problem" }],
});

export const Problem = mongoose.model<IProblem>("Problem", ProblemSchema);
export const ProblemSet = mongoose.model<IProblemSet>("ProblemSet", ProblemSetSchema);