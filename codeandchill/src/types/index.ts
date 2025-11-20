// Common types used across the application

export interface User {
  _id: string;
  name: string;
  email: string;
  location?: string;
  occupation?: string;
  bio?: string;
  joinDate: string;
  skills: string[];
  attempts: string[];
}

export interface Course {
  _id: string;
  courseTitle: string;
  slug: string;
  modules: Module[];
}

export interface Module {
  title: string;
  topics: Topic[];
}

export interface Topic {
  title: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  title: string;
  content: string;
}

export interface GeneralCourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tutor: {
    name: string;
    image: string;
  };
  cost: number;
  modules: GeneralModule[];
}

export interface GeneralModule {
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  topics: GeneralTopic[];
}

export interface GeneralTopic {
  title: string;
  contentType: "video" | "text" | "table";
  videoUrl?: string;
  textContent?: string;
  tableData?: string[][];
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface ProblemSet {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  problems: string[] | Problem[];
}

export interface Subject {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Quiz {
  _id: string;
  title: string;
  slug: string;
  subject: string;
  questions: Question[];
}

export interface Question {
  questionText: string;
  options: Option[];
  explanation?: string;
}

export interface Option {
  text: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  answers: any;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStory {
  _id: string;
  name: string;
  company: string;
  image: string;
  quote: string;
  skills: string[];
  linkedinUrl: string;
  userId: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// Component prop types
export interface PageProps {
  className?: string;
}

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}