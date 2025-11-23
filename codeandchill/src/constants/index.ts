// API Configuration
// In production (Docker), use /api which nginx proxies to backend
// In development, use full URL to backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  
  // User
  USER: {
    PROFILE: "/user/profile",
    PROFILE_DASHBOARD: "/user/profile-dashboard",
    CHANGE_PASSWORD: "/user/change-password",
  },
  
  // Courses
  COURSES: "/courses",
  GENERAL_COURSES: "/general-courses",
  
  // Problems
  PROBLEMS: "/problems",
  PROBLEM_SETS: "/problem-sets",
  
  // Quizzes
  QUIZZES: {
    BASE: "/quizzes",
    SUBJECTS: "/quizzes/subjects",
    BY_SUBJECT: "/quizzes/by-subject",
    PLAY: "/quizzes/play",
    SUBMIT: "/quizzes",
    RESULTS: "/quizzes/results",
  },
  
  // Stories
  STORIES: "/stories",
  
  // Enrollment
  ENROLLMENT: {
    STATUS: "/enrollment/status",
    CREATE_ORDER: "/enrollment/payment/create-order",
    VERIFY_PAYMENT: "/enrollment/payment/verify",
  },
  
  // Free enrollment
  ENROLL_FREE: "/enroll/free",
  
  // AI
  AI_CHAT: "/gemini-chat",
} as const;

// Route paths
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:slug",
  COURSE_PLAYER: "/learn/:courseId",
  GENERAL_COURSES: "/engineering-courses",
  GENERAL_COURSE_DETAIL: "/engineering-courses/:courseId",
  PATHS: "/paths",
  PATH_DETAIL: "/paths/:pathId",
  CONTESTS: "/contests",
  CONTEST_DETAIL: "/contests/:contestId",
  PROBLEMS: "/problems",
  PROBLEM_SET_DETAIL: "/problems/:setId",
  SOLVE_PROBLEM: "/solve/:problemId",
  QUIZZES: "/quizzes",
  QUIZ_LIST: "/quizzes/subjects/:subjectSlug",
  QUIZ_PLAYER: "/quizzes/play/:quizSlug",
  QUIZ_RESULTS: "/quizzes/results/:attemptId",
  SUCCESS_STORIES: "/success-stories",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  AI_ASSISTANT: "/ai",
  BLOG: "/blogpage",
  BLOG_DETAIL: "/blogdesc",
  PLAYGROUND: "/playground",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  IS_AUTHENTICATED: "isAuthenticated",
  THEME: "vite-ui-theme",
  USER_PREFERENCES: "userPreferences",
} as const;

// Theme options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;

// Problem topics
export const PROBLEM_TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Sorting",
  "Searching",
  "Stack",
  "Queue",
  "Hash Tables",
  "Binary Search",
  "Recursion",
  "Backtracking",
  "Greedy",
  "Math",
  "Bit Manipulation",
] as const;

// Quiz subjects
export const QUIZ_SUBJECTS = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "Database",
  "Operating Systems",
  "Computer Networks",
  "Data Structures",
  "Algorithms",
] as const;