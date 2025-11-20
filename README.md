# 🚀 Code & Chill - Advanced E-Learning Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)

**A comprehensive full-stack e-learning platform for computer science education, coding challenges, and skill development**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Architecture](#-architecture)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Code & Chill** is a modern, full-stack e-learning platform designed to provide comprehensive computer science education through interactive courses, coding challenges, quizzes, and AI-powered assistance. Built with scalability, performance, and user experience in mind.

### Key Highlights

- 🎓 **Dual Course System**: Free CS fundamentals + Premium paid courses
- 💻 **Interactive Code Editor**: Monaco-based editor with Judge0 integration
- 🤖 **AI Assistant**: Google Gemini-powered chat for learning support
- 🏆 **Gamification**: Leaderboards, achievements, and progress tracking
- 📊 **Analytics Dashboard**: Comprehensive user statistics and insights
- 💳 **Payment Integration**: Razorpay for course enrollment
- 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- 📧 **Feedback System**: Email-based feedback with Gmail SMTP
- 🔍 **Global Search**: Real-time search across courses, problems, and content
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## ✨ Features

### 🎓 Learning Management

#### Free CS Courses
- **Core Computer Science Topics**: Data Structures, Algorithms, Operating Systems, DBMS, Networks
- **Interactive Content**: Rich markdown content with code examples
- **Progress Tracking**: Lesson completion and time tracking
- **Course Notes**: Add personal notes with timestamps
- **Quizzes**: Subject-based quizzes with instant feedback

#### Premium Courses
- **Comprehensive Curriculum**: Full-stack development, DevOps, AI/ML
- **Video Content**: Embedded video lessons
- **Downloadable Resources**: PDFs, code samples, and materials
- **Certificate of Completion**: Upon course completion
- **Lifetime Access**: One-time payment model

### 💻 Coding Challenges

#### Problem Solving Platform
- **300+ Coding Problems**: Categorized by difficulty (Easy, Medium, Hard)
- **Problem Sets**: Curated collections (Arrays, Strings, DP, etc.)
- **Real-time Code Execution**: Judge0 API integration
- **Multiple Languages**: C++, Java, Python, JavaScript support
- **Submission History**: Track all attempts and solutions
- **Test Cases**: Public and hidden test cases
- **Editorial Solutions**: Learn optimal approaches

#### Code Editor Features
- **Monaco Editor**: VS Code-like editing experience
- **Syntax Highlighting**: Language-specific highlighting
- **Auto-completion**: Intelligent code suggestions
- **Theme Support**: Light and dark modes
- **Split View**: Problem description + editor side-by-side

### 🧠 Skill Assessment

#### Quiz System
- **Subject-based Quizzes**: OS, DBMS, Networks, DSA, etc.
- **Timed Assessments**: Challenge yourself with time limits
- **Instant Results**: Immediate feedback with explanations
- **Score Tracking**: Monitor your performance over time
- **Attempt History**: Review past quiz attempts

#### Skill Tests
- **Technology-specific Tests**: React, Node.js, Python, etc.
- **Difficulty Levels**: Beginner to Advanced
- **Certification**: Earn skill badges
- **Detailed Analytics**: Strength and weakness analysis

### 🎯 Learning Paths

- **Structured Curriculum**: Step-by-step learning journeys
- **Multiple Paths**: Frontend, Backend, Full-stack, DevOps, AI/ML
- **Progress Tracking**: Monitor completion across courses
- **Recommended Order**: Optimized learning sequence
- **Flexible Enrollment**: Start and pause anytime

### 🤖 AI-Powered Features

#### Gemini AI Assistant
- **24/7 Learning Support**: Get instant help with concepts
- **Code Explanation**: Understand complex code snippets
- **Debugging Help**: Identify and fix errors
- **Concept Clarification**: Deep dive into topics
- **Practice Problems**: Generate custom practice questions

### 🏆 Gamification & Social

#### Achievements System
- **Milestone Badges**: Unlock achievements for progress
- **Streak Tracking**: Maintain daily learning streaks
- **Points System**: Earn points for activities
- **Levels**: Progress through learner levels

#### Leaderboards
- **Global Rankings**: Compete with learners worldwide
- **Category-wise**: Top performers in problems, quizzes, courses
- **Real-time Updates**: Live leaderboard updates
- **User Profiles**: View other learners' achievements

#### Success Stories
- **Community Showcase**: Share your success journey
- **Company Placements**: Highlight job achievements
- **Skill Development**: Showcase skills learned
- **LinkedIn Integration**: Connect with professionals

### 📊 Analytics & Insights

#### User Dashboard
- **Learning Statistics**: Total time, courses completed, problems solved
- **Progress Visualization**: Charts and graphs with Recharts
- **Activity Heatmap**: Daily activity tracking
- **Skill Matrix**: Visual representation of skills
- **Recent Activity**: Timeline of recent actions

#### Performance Metrics
- **Problem Solving Stats**: Acceptance rate, submission count
- **Quiz Performance**: Average scores, time taken
- **Course Progress**: Completion percentage, time invested
- **Strength Analysis**: Identify strong and weak areas

### 🔍 Search & Discovery

- **Global Search**: Search across all content types
- **Fuzzy Matching**: Find content even with typos
- **Category Filters**: Filter by courses, problems, quizzes
- **Real-time Results**: Instant search as you type
- **Keyboard Shortcuts**: Quick access with Cmd/Ctrl+K

### 💳 Payment & Enrollment

#### Payment Processing
- **Razorpay Integration**: Secure payment gateway
- **Multiple Payment Methods**: Cards, UPI, Wallets, Net Banking
- **Order Verification**: Signature verification for security
- **Instant Enrollment**: Immediate course access post-payment
- **Payment History**: Track all transactions

#### Enrollment Management
- **Free Course Enrollment**: One-click enrollment
- **Paid Course Access**: Gated content with payment
- **Enrollment Status**: Check access to courses
- **Lifetime Access**: No recurring fees

### 📧 Communication

#### Feedback System
- **Email Integration**: Gmail SMTP for feedback
- **User Feedback**: Submit suggestions and issues
- **Category-based**: Bug reports, feature requests, general feedback
- **Email Notifications**: Confirmation emails

---

## 🛠 Tech Stack

### Frontend

#### Core
- **React 19.1.1**: Latest React with concurrent features
- **TypeScript 5.8**: Type-safe development
- **Vite 7.1**: Lightning-fast build tool
- **React Router DOM 7.8**: Client-side routing

#### UI & Styling
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Radix UI**: Accessible component primitives
- **Framer Motion 12.23**: Animation library
- **Lucide React**: Beautiful icon set

#### Code & Content
- **Monaco Editor**: VS Code editor in browser
- **React Markdown**: Markdown rendering
- **React Syntax Highlighter**: Code syntax highlighting
- **Remark GFM**: GitHub Flavored Markdown

#### Data Visualization
- **Recharts 2.15**: Composable charting library

#### State & Communication
- **React Context API**: Global state management
- **Socket.io Client 4.8**: Real-time communication
- **Axios**: HTTP client (via services)

### Backend

#### Core
- **Node.js 18+**: JavaScript runtime
- **Express 4.19**: Web application framework
- **TypeScript 5.9**: Type-safe backend
- **ts-node**: TypeScript execution

#### Database
- **MongoDB**: NoSQL database
- **Mongoose 8.4**: ODM for MongoDB

#### Authentication & Security
- **JWT (jsonwebtoken 9.0)**: Token-based authentication
- **bcryptjs 2.4**: Password hashing
- **CORS 2.8**: Cross-origin resource sharing

#### External Services
- **Google Generative AI 0.24**: Gemini AI integration
- **Judge0 API**: Code execution engine
- **Razorpay 2.9**: Payment gateway
- **Nodemailer 7.0**: Email service
- **Gmail SMTP**: Email delivery

#### Utilities
- **Axios 1.13**: HTTP client
- **dotenv 16.4**: Environment variables
- **UUID 13.0**: Unique identifier generation
- **Socket.io 4.8**: WebSocket server

---

## 📁 Project Structure

```
Code-and-Chill/
├── codeandchill/                    # Frontend Application
│   ├── public/                      # Static assets
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── components/              # React components
│   │   │   ├── ai/                  # AI chat components
│   │   │   ├── blog/                # Blog components
│   │   │   ├── contests/            # Contest components
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── engineering/         # Course components
│   │   │   ├── feedback/            # Feedback modal
│   │   │   ├── layout/              # Layout components (Navbar, Footer)
│   │   │   ├── paths/               # Learning path components
│   │   │   ├── problems/            # Problem components
│   │   │   ├── search/              # Search components
│   │   │   ├── solve/               # Code editor components
│   │   │   ├── success/             # Success story components
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── constants/               # App constants
│   │   ├── contexts/                # React contexts
│   │   │   ├── ThemeContext.tsx    # Theme management
│   │   │   └── UserContext.tsx     # User authentication
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility libraries
│   │   ├── pages/                   # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── CoursesPage.tsx
│   │   │   ├── EnhancedCourseDetailPage.tsx
│   │   │   ├── GeneralCourseDetailPage.tsx
│   │   │   ├── ProblemsPage.tsx
│   │   │   ├── ProblemDetailPage.tsx
│   │   │   ├── QuizzesPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── services/                # API services
│   │   │   ├── api.ts              # Base API configuration
│   │   │   ├── authService.ts      # Authentication
│   │   │   ├── courseService.ts    # Course operations
│   │   │   ├── problemService.ts   # Problem operations
│   │   │   ├── searchService.ts    # Search functionality
│   │   │   └── judgeService.ts     # Code execution
│   │   ├── styles/                  # Global styles
│   │   ├── types/                   # TypeScript types
│   │   ├── utils/                   # Utility functions
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global CSS
│   ├── .env                         # Environment variables
│   ├── components.json              # shadcn/ui config
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── Backend/
│   └── server/                      # Backend Application
│       ├── src/
│       │   ├── config/              # Configuration
│       │   │   ├── database.ts     # MongoDB connection
│       │   │   └── index.ts        # Config exports
│       │   ├── middleware/          # Express middleware
│       │   │   ├── auth.ts         # JWT authentication
│       │   │   └── index.ts        # Middleware exports
│       │   ├── models/              # Mongoose models
│       │   │   ├── User.ts         # User model
│       │   │   ├── Course.ts       # CS Course model
│       │   │   ├── GeneralCourse.ts # Paid course model
│       │   │   ├── Problem.ts      # Coding problem model
│       │   │   ├── ProblemSet.ts   # Problem set model
│       │   │   ├── Quiz.ts         # Quiz model
│       │   │   ├── Subject.ts      # Subject model
│       │   │   ├── QuizAttempt.ts  # Quiz attempt model
│       │   │   ├── SkillTest.ts    # Skill test model
│       │   │   ├── SuccessStory.ts # Success story model
│       │   │   ├── Enrollment.ts   # Course enrollment
│       │   │   ├── UserProgress.ts # Learning progress
│       │   │   ├── UserProblem.ts  # Problem submissions
│       │   │   ├── LearningPath.ts # Learning path model
│       │   │   └── index.ts        # Model exports
│       │   ├── routes/              # API routes
│       │   │   ├── auth.ts         # Authentication
│       │   │   ├── user.ts         # User profile
│       │   │   ├── courses.ts      # CS courses
│       │   │   ├── generalCourses.ts # Paid courses
│       │   │   ├── problems.ts     # Problems
│       │   │   ├── problemSets.ts  # Problem sets
│       │   │   ├── quizzes.ts      # Quizzes
│       │   │   ├── skillTests.ts   # Skill tests
│       │   │   ├── stories.ts      # Success stories
│       │   │   ├── enrollment.ts   # Enrollment & payment
│       │   │   ├── enroll.ts       # Free enrollment
│       │   │   ├── progress.ts     # Progress tracking
│       │   │   ├── submissions.ts  # Code submissions
│       │   │   ├── learningPaths.ts # Learning paths
│       │   │   ├── leaderboard.ts  # Leaderboards
│       │   │   ├── search.ts       # Global search
│       │   │   ├── feedback.ts     # Feedback system
│       │   │   ├── ai.ts           # AI chat
│       │   │   └── index.ts        # Route exports
│       │   ├── services/            # Business logic
│       │   │   ├── emailService.ts # Email sending
│       │   │   └── judgeService.ts # Code execution
│       │   ├── app.ts               # Express app setup
│       │   └── server.ts            # Server entry point
│       ├── .env                     # Environment variables
│       ├── package.json
│       ├── tsconfig.json
│       └── seed-new.ts              # Database seeder
│
├── .git/                            # Git repository
├── .gitignore
├── .hintrc
├── project_structure.txt
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Clone Repository

```bash
git clone https://github.com/maheshsingh20/codeandchill.git
cd codeandchill
```

### Backend Setup

```bash
# Navigat directory
cd Backend/server

# Install dependencies
npm install

# Create .env file (see Configuration section)
# Copy .env.example to .env and fill in valueshe database with initial data
npm run seed

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd codeandchill

# Install dependencies
npm install

# Create .env file (see Configuration section)
# Copy .env.example to .env and fill in values

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in `Backend/server/` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/codeandchill

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Gmail SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Judge0 API (RapidAPI)
RAPIDAPI_KEY=your_rapidapi_key_here
```

### Frontend Environment Variables

Create a `.env` file in `codeandchill/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001

# Judge0 API (RapidAPI)
VITE_RAPID_API_KEY=your_rapidapi_key_here
VITE_RAPID_API_HOST=judge0-ce.p.rapidapi.com
```

### Getting API Keys

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `GEMINI_API_KEY`

#### Razorpay
1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret

#### Gmail App Password
1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password in `GMAIL_APP_PASSWORD`

#### Judge0 (RapidAPI)
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Copy your API key from the dashboard

---

## 🏃 Running the Application

### Development Mode

#### Start Backend
```bash
cd Backend/server
npm run dev
```
Server runs on: `http://localhost:3001`

#### Start Frontend
```bash
cd codeandchill
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd codeandchill
npm run build
```
Output: `codeandchill/dist/`

#### Preview Production Build
```bash
npm run preview
```

### Database Seeding

Seed the database with initial data (courses, problems, quizzes):

```bash
cd Backend/server
npm run seed
```

**Note**: Run this only once or when you want to reset the database.

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

#### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |

**Request Body (Signup)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### User Management (`/api/user`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| POST | `/change-password` | Change password | Yes |
| GET | `/profile-dashboard` | Get dashboard data | Yes |
| PUT | `/preferences` | Update preferences | Yes |
| POST | `/update-stats` | Update statistics | Yes |
| GET | `/achievements` | Get achievements | Yes |
| GET | `/solved-problems` | Get solved problems | Yes |

#### Courses (`/api/courses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all CS courses | No |
| GET | `/:slug` | Get course by slug | No |

#### General Courses (`/api/general-courses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all paid courses | No |
| GET | `/:slug` | Get course by slug | No |

#### Problems (`/api/problems`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all problems | No |
| GET | `/:slug` | Get problem by slug | No |

#### Problem Sets (`/api/problem-sets`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all problem sets | No |
| GET | `/:slug` | Get problem set by slug | No |

#### Submissions (`/api/submissions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit solution | Yes |
| GET | `/:submissionId` | Get submission details | Yes |
| GET | `/problem/:problemId` | Get user's submissions for problem | Yes |
| GET | `/` | Get all user submissions | Yes |
| GET | `/stats/summary` | Get submission statistics | Yes |
| GET | `/problem/:problemId/status` | Get problem status | Yes |
| GET | `/solved/by-difficulty` | Get solved by difficulty | Yes |

**Submit Solution Request**:
```json
{
  "problemId": "problem_id_here",
  "code": "console.log('Hello World');",
  "language": "javascript"
}
```

#### Quizzes (`/api/quizzes`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/subjects` | List all subjects | No |
| GET | `/by-subject/:slug` | Get quizzes by subject | Yes |
| GET | `/play/:slug` | Get quiz for playing | No |
| POST | `/:quizId/submit` | Submit quiz answers | Yes |
| GET | `/results/:attemptId` | Get quiz results | Yes |

**Submit Quiz Request**:
```json
{
  "answers": {
    "question_id_1": 2,
    "question_id_2": 0
  }
}
```

#### Skill Tests (`/api/skill-tests`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all skill tests | No |
| GET | `/skills` | Get available skills | No |
| GET | `/:testId` | Get skill test by ID | Yes |
| POST | `/:testId/submit` | Submit skill test | Yes |
| GET | `/attempts/history` | Get attempt history | Yes |
| GET | `/attempts/:attemptId` | Get attempt details | Yes |
| GET | `/earned/skills` | Get earned skills | Yes |

#### Learning Paths (`/api/learning-paths`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all learning paths | No |
| GET | `/:pathId` | Get learning path by ID | No |
| POST | `/:pathId/enroll` | Enroll in learning path | Yes |
| GET | `/:pathId/progress` | Get progress | Yes |
| POST | `/:pathId/progress/:courseId` | Update course progress | Yes |
| GET | `/user/enrolled` | Get enrolled paths | Yes |
| POST | `/:pathId/rate` | Rate learning path | Yes |

#### Enrollment (`/api/enrollment`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/status/:slug` | Check enrollment status | Yes |
| POST | `/payment/create-order` | Create payment order | Yes |
| POST | `/payment/verify` | Verify payment | Yes |

**Create Order Request**:
```json
{
  "courseSlug": "full-stack-development",
  "amount": 4999
}
```

#### Free Enrollment (`/api/enroll`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/free` | Enroll in free course | Yes |

#### Progress (`/api/progress`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/course/:courseId` | Get course progress | Yes |
| POST | `/lesson` | Update lesson progress | Yes |
| POST | `/notes` | Add/update notes | Yes |
| GET | `/stats` | Get overall statistics | Yes |
| POST | `/quiz` | Submit quiz score | Yes |

#### Leaderboard (`/api/leaderboard`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/global` | Get global leaderboard | No |
| GET | `/rank` | Get user rank | Yes |
| GET | `/top/:category` | Get top by category | No |
| GET | `/stats` | Get leaderboard stats | No |

#### Success Stories (`/api/stories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all stories | No |
| POST | `/` | Submit new story | Yes |

#### Search (`/api/search`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?q=query` | Global search | Yes |

#### Feedback (`/api/feedback`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit feedback | Yes |

**Feedback Request**:
```json
{
  "category": "bug",
  "message": "Found an issue with...",
  "email": "user@example.com"
}
```

#### AI Chat (`/api/gemini-chat`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Send message to AI | Yes |

**AI Chat Request**:
```json
{
  "message": "Explain binary search algorithm"
}
```

---

## 🗄️ Database Models

### User Model
```typescript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: