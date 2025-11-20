# CodeAndChill Backend

A modular Node.js + TypeScript backend for the CodeAndChill e-learning platform.

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # MongoDB connection
│   └── index.ts     # Config exports
├── middleware/      # Express middleware
│   ├── auth.ts      # JWT authentication
│   └── index.ts     # Middleware exports
├── models/          # Mongoose models
│   ├── User.ts      # User model
│   ├── Course.ts    # CS Course model
│   ├── GeneralCourse.ts # Paid course model
│   ├── Problem.ts   # Coding problems
│   ├── Quiz.ts      # Quiz system
│   ├── SuccessStory.ts # Success stories
│   ├── Enrollment.ts # Course enrollment
│   ├── UserProgress.ts # Learning progress
│   └── index.ts     # Model exports
├── routes/          # API routes
│   ├── auth.ts      # Authentication routes
│   ├── user.ts      # User profile routes
│   ├── courses.ts   # CS courses routes
│   ├── generalCourses.ts # Paid courses routes
│   ├── problems.ts  # Problem routes
│   ├── problemSets.ts # Problem set routes
│   ├── quizzes.ts   # Quiz routes
│   ├── stories.ts   # Success story routes
│   ├── enrollment.ts # Enrollment & payment routes
│   ├── enroll.ts    # Free enrollment routes
│   ├── ai.ts        # AI chat routes
│   └── index.ts     # Route exports
├── seeds/           # Database seeding
│   └── index.ts     # Consolidated seeder
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Environment variables (see `.env.example`)

### Installation
```bash
cd Backend/server
npm install
```

### Environment Variables
Create a `.env` file with:
```env
MONGO_URI=mongodb://localhost:27017/codeandchill
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Running the Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

### Database Seeding
```bash
# Comprehensive seeder (seeds all data)
npm run seed
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password
- `GET /api/user/profile-dashboard` - Dashboard data

### Courses
- `GET /api/courses` - List CS courses
- `GET /api/courses/:slug` - Get course details
- `GET /api/general-courses` - List paid courses
- `GET /api/general-courses/:slug` - Get paid course details

### Quizzes
- `GET /api/quizzes/subjects` - List subjects
- `GET /api/quizzes/by-subject/:slug` - Get quizzes by subject
- `GET /api/quizzes/play/:slug` - Get quiz for playing
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/results/:attemptId` - Get quiz results

### Problems
- `GET /api/problems` - List problems
- `GET /api/problems/:slug` - Get problem details
- `GET /api/problem-sets` - List problem sets
- `GET /api/problem-sets/:slug` - Get problem set details

### Enrollment & Payment
- `GET /api/enrollment/status/:slug` - Check enrollment status
- `POST /api/enrollment/payment/create-order` - Create payment order
- `POST /api/enrollment/payment/verify` - Verify payment
- `POST /api/enroll/free` - Enroll in free course

### AI & Stories
- `POST /api/gemini-chat` - AI chat endpoint
- `GET /api/stories` - Get success stories
- `POST /api/stories` - Submit success story

## 🔧 Key Features

- **Modular Architecture**: Clean separation of concerns
- **TypeScript**: Full type safety
- **JWT Authentication**: Secure user authentication
- **Payment Integration**: Razorpay payment processing
- **AI Integration**: Google Gemini AI chat
- **MongoDB**: Flexible document database
- **Error Handling**: Comprehensive error management
- **Input Validation**: Request validation and sanitization

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Payment signature verification
- Environment variable validation

## 📊 Database Models

- **User**: User profiles and authentication
- **Course**: Free CS fundamental courses
- **GeneralCourse**: Paid comprehensive courses
- **Quiz/Subject**: Quiz system with subjects
- **Problem/ProblemSet**: Coding challenges
- **Enrollment**: Course enrollment tracking
- **SuccessStory**: Community success stories
- **UserProgress**: Learning progress tracking

## 🧹 Clean Architecture

The backend has been completely refactored from a monolithic structure to a clean, modular architecture:

- **Before**: Single large server.ts file with 800+ lines
- **After**: Organized into logical modules with separation of concerns
- **Benefits**: Better maintainability, easier testing, cleaner code organization
- **Compatibility**: All API endpoints remain the same for seamless frontend integration