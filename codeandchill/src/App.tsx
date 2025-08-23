import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Import all pages (no .tsx extensions needed)
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CoursePlayerPage } from "./pages/CoursePlayerPage";
import { LearningPathsPage } from "./pages/LearningPathsPage";
import { PathDetailPage } from "./pages/PathDetailPage";
import { ContestsPage } from "./pages/ContestsPage";
import { ContestDetailPage } from "./pages/ContestDetailPage";
import { SuccessStoriesPage } from "./pages/SuccessStoriesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AiAssistantPage } from "./pages/AiAssistantPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { EngineeringCoursesPage } from "./page2/EngineeringCoursesPage";
import { EngineeringCourseDetailPage } from "./page2/EngineeringCourseDetailPage";
import { PlaygroundPage } from "./page2/PlaygroundPage";
import { ProblemSetsPage } from "./pages/ProblemSetsPage.tsx";
import { ProblemSetDetailPage } from "./pages/ProblemSetDetailPage.tsx";
import { SolveProblemPage } from "./pages/SolveProblemPage.tsx";
import { SettingsPage } from "./page2/Settings.tsx";

// Layout components
import { Navbar as PublicNavbar } from "./components/layout/Navbar";
import { Navbar as DashboardNavbar } from "./components/dashboard/Navbar";
import { Footer } from "./components/dashboard/Footer";
import { QuizzesPage } from "./pages/QuizzesPage";
import { QuizListPage } from "./pages/QuizListPage";
import { QuizPlayerPage } from "./pages/QuizPlayerPage";
import { QuizResultPage } from "./pages/QuizResultPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  // Wrapper for protected routes
  const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    return isAuthenticated ? element : <Navigate to="/auth" />;
  };

  return (
    <Router>
      <div
        className={`min-h-screen flex flex-col ${
          isAuthenticated ? "bg-muted/30" : "bg-background"
        }`}
      >
        {/* Navbar */}
        {isAuthenticated ? (
          <DashboardNavbar logout={logout} />
        ) : (
          <PublicNavbar />
        )}

        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LandingPage />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/auth"
              element={
                !isAuthenticated ? (
                  <AuthPage login={login} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<HomePage />} />}
            />
            <Route
              path="/courses"
              element={<PrivateRoute element={<CoursesPage />} />}
            />
            <Route
              path="/courses/:courseId"
              element={<PrivateRoute element={<CourseDetailPage />} />}
            />
            <Route
              path="/learn/:courseId"
              element={<PrivateRoute element={<CoursePlayerPage />} />}
            />
            <Route
              path="/paths"
              element={<PrivateRoute element={<LearningPathsPage />} />}
            />
            <Route
              path="/paths/:pathId"
              element={<PrivateRoute element={<PathDetailPage />} />}
            />
            <Route
              path="/contests"
              element={<PrivateRoute element={<ContestsPage />} />}
            />
            <Route
              path="/contests/:contestId"
              element={<PrivateRoute element={<ContestDetailPage />} />}
            />
            <Route
              path="/success-stories"
              element={<PrivateRoute element={<SuccessStoriesPage />} />}
            />{" "}
            <Route
              path="/profile"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
            <Route
              path="/ai"
              element={<PrivateRoute element={<AiAssistantPage />} />}
            />
            <Route
              path="/blogpage"
              element={<PrivateRoute element={<BlogPage />} />}
            />
            <Route
              path="/blogdesc"
              element={<PrivateRoute element={<BlogDetailPage />} />}
            />
            <Route
              path="/engineering-courses"
              element={<PrivateRoute element={<EngineeringCoursesPage />} />}
            />
            <Route
              path="engineering-courses/:courseId"
              element={
                <PrivateRoute element={<EngineeringCourseDetailPage />} />
              }
            />
            <Route
              path="/playground"
              element={<PrivateRoute element={<PlaygroundPage />} />}
            />
            <Route
              path="/problems"
              element={
                isAuthenticated ? <ProblemSetsPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/problems/:setId"
              element={
                isAuthenticated ? (
                  <ProblemSetDetailPage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/solve/:problemId"
              element={
                isAuthenticated ? <SolveProblemPage /> : <Navigate to="/auth" />
              }
            />
            {/* Special Routes */}
            {/* Catch-all Redirect */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />}
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? <SettingsPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/quizzes"
              element={
                isAuthenticated ? <QuizzesPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/quizzes/subjects/:subjectSlug"
              element={
                isAuthenticated ? <QuizListPage /> : <Navigate to="path" />
              }
            />
            <Route
              path="/quizzes/play/:quizSlug"
              element={
                isAuthenticated ? <QuizPlayerPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/quizzes/results/:attemptId"
              element={
                isAuthenticated ? <QuizResultPage /> : <Navigate to="/auth" />
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;
