import React, { JSX, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Import NoirSystem
import { initNoirAccentSystem } from "./utils/noir-accent";

// Import all pages using barrel exports
import {
  LandingPage,
  AuthPage,
  HomePage,
  CoursesPage,
  CourseDetailPage,
  CoursePlayerPage,
  GeneralCoursesPage,
  GeneralCourseDetailPage,
  LearningPathsPage,
  LearningPathDetailPage,
  PathDetailPage,
  ContestsPage,
  ContestDetailPage,
  ContestCompetePage,
  SuccessStoriesPage,
  ProfilePage,
  AiAssistantPage,
  BlogPage,
  BlogDetailPage,
  PlaygroundPage,
  ProblemSetsPage,
  ProblemSetDetailPage,
  SolveProblemPage,
  SettingsPage,
  QuizzesPage,
  QuizListPage,
  QuizPlayerPage,
  QuizResultPage,
  ProblemSolverPage,
  QuizPage,
  DashboardPage,
  ForumPage,
  SkillTestsPage,
  SkillTestTakingPage,
} from "./pages";

import { EnhancedCourseDetailPage } from "./pages/EnhancedCourseDetailPage";

import { CollaborativePage } from "./pages/CollaborativePage";
import { performAppCleanup } from "@/utils/cleanup";
import { AuthDebug } from "./components/debug/AuthDebug";

import { ShadcnShowcasePage } from "./pages/ShadcnShowcasePage";

// Layout components
import { Navbar as PublicNavbar } from "./components/layout/Navbar";
import { Navbar as DashboardNavbar } from "./components/dashboard/Navbar";
import { Footer } from "./components/dashboard/Footer";

// Context providers
import { UserProvider } from "./contexts/UserContext";

// Hooks

// Constants
import { STORAGE_KEYS } from "./constants";

// Import Activity Tracker
import { ActivityTracker } from "./components/activity/ActivityTracker";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === "true";
  });

  // Activity tracking will be initialized inside Router context

  // Initialize NoirSystem
  useEffect(() => {
    document.body.classList.add('noir-theme');
    initNoirAccentSystem();
    return () => document.body.classList.remove('noir-theme');
  }, []);

  // Initialize NoirSystem
  useEffect(() => {
    // Add noir-theme class to body
    document.body.classList.add('noir-theme');
    
    // Initialize dynamic accent system
    initNoirAccentSystem();
    
    return () => {
      document.body.classList.remove('noir-theme');
    };
  }, []);

  const login = (token?: string) => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");
    setIsAuthenticated(true);
    
    // Trigger a storage event to refresh user data
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'authToken',
      newValue: token || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
      oldValue: null
    }));
  };

  const logout = async () => {
    try {
      await performAppCleanup();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback cleanup
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setIsAuthenticated(false);
    }
  };

  // Wrapper for protected routes
  const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    return isAuthenticated ? element : <Navigate to="/auth" />;
  };

  return (
    <Router>
      <UserProvider>
        {/* <AuthDebug /> */}
        <ActivityTracker isAuthenticated={isAuthenticated} />
        <div className="min-h-screen flex flex-col bg-background">
          {/* Shadcn Dark Background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent)/0.1),transparent_50%)]" />
          </div>

          {/* Navbar */}
          {isAuthenticated ? (
            <DashboardNavbar logout={logout} />
          ) : (
            <PublicNavbar />
          )}

          {/* Main content */}
          <main className="flex-grow relative">
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
              path="/courses/:slug"
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
              path="/learning-paths"
              element={<PrivateRoute element={<LearningPathsPage />} />}
            />
            <Route
              path="/learning-paths/:pathId"
              element={<PrivateRoute element={<LearningPathDetailPage />} />}
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
              path="/contests/:contestId/compete"
              element={<PrivateRoute element={<ContestCompetePage />} />}
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
              element={<PrivateRoute element={<GeneralCoursesPage />} />}
            />
            <Route
              path="engineering-courses/:courseId"
              element={
                <PrivateRoute element={<EnhancedCourseDetailPage />} />
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
            <Route
              path="/problem-solver"
              element={<PrivateRoute element={<ProblemSolverPage />} />}
            />
            <Route
              path="/quiz-system"
              element={<PrivateRoute element={<QuizPage />} />}
            />
            <Route
              path="/user-dashboard"
              element={<PrivateRoute element={<DashboardPage />} />}
            />
            <Route
              path="/forum"
              element={<PrivateRoute element={<ForumPage />} />}
            />
            <Route
              path="/skill-tests"
              element={<PrivateRoute element={<SkillTestsPage />} />}
            />
            <Route
              path="/skill-test/:testId"
              element={<PrivateRoute element={<SkillTestTakingPage />} />}
            />
            <Route
              path="/collaborative"
              element={<PrivateRoute element={<CollaborativePage />} />}
            />
            <Route
              path="/collaborative/:sessionToken"
              element={<PrivateRoute element={<CollaborativePage />} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<SettingsPage />} />}
            />
            <Route
              path="/quizzes"
              element={<PrivateRoute element={<QuizzesPage />} />}
            />
            {/* Special Routes */}
            {/* Catch-all Redirect */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />}
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
            <Route
              path="/showcase"
              element={
                isAuthenticated ? <ShadcnShowcasePage /> : <Navigate to="/auth" />
              }
            />
          </Routes>
        </main>

          {/* Footer */}
          {isAuthenticated && <Footer />}
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
