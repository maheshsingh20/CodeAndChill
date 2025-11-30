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
  LearningPathsPage,
  LearningPathDetailPage,
  PathDetailPage,
  ContestsPage,
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
  CertificatesPage,
} from "./pages";

import { RealContestDetailPage } from "./pages/RealContestDetailPage";

import { EnhancedCourseDetailPage } from "./pages/EnhancedCourseDetailPage";

import { CollaborativePage } from "./pages/CollaborativePage";
import { performAppCleanup } from "@/utils/cleanup";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminDataSeedPage } from "./pages/admin/AdminDataSeedPage";
import { AdminProblemsPage } from "./pages/admin/AdminProblemsPage";
import { AdminQuizzesPage } from "./pages/admin/AdminQuizzesPage";
import { AdminContestsPage } from "./pages/admin/AdminContestsPage";
import { AdminContestFormPage } from "./pages/admin/AdminContestFormPage";

import { ShadcnShowcasePage } from "./pages/ShadcnShowcasePage";
import { RealTimeTest } from "./components/test/RealTimeTest";
import { CollaborativeTest } from "./components/test/CollaborativeTest";
import { SimpleCollaborativeTest } from "./components/test/SimpleCollaborativeTest";
import { DebugCollaborativeTest } from "./components/test/DebugCollaborativeTest";
import { CollaborativeSystemTest } from "./components/test/CollaborativeSystemTest";
import { AuthDiagnostic } from "./components/test/AuthDiagnostic";

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

// Import PWA components
import { PWAInstallPrompt } from "./components/pwa/PWAInstallPrompt";
import "./utils/pwa"; // Initialize PWA manager

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Validate authentication on mount
  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const isAuthFlag = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      
      // If no token or auth flag, user is not authenticated
      if (!token || isAuthFlag !== "true") {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      // Validate token with backend
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Token is valid
          setIsAuthenticated(true);
        } else if (response.status === 401 || response.status === 403) {
          // Token is invalid, clear auth data
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
          localStorage.removeItem('user');
          localStorage.removeItem('userPreferences');
          setIsAuthenticated(false);
        } else {
          // Other error, assume authenticated for now
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error validating authentication:', error);
        // On network error, assume authenticated if token exists
        setIsAuthenticated(true);
      } finally {
        setAuthChecked(true);
      }
    };

    validateAuth();
  }, []);

  // Initialize NoirSystem
  useEffect(() => {
    document.body.classList.add('noir-theme');
    initNoirAccentSystem();
    return () => document.body.classList.remove('noir-theme');
  }, []);

  const login = (token?: string) => {
    console.log('Login called with new token');
    
    // Clear any old user data first
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
    
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
    
    console.log('Login completed, user data will refresh');
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

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // Show loading screen while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <UserProvider>
        {/* <AuthDebug /> */}
        {!isAdminRoute && <ActivityTracker isAuthenticated={isAuthenticated} />}
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          {/* Consistent Dark Background with subtle animated orbs */}
          {!isAdminRoute && (
            <div className="fixed inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          )}

          {/* Navbar - Hide for admin routes */}
          {!isAdminRoute && (
            <>
              {isAuthenticated ? (
                <DashboardNavbar logout={logout} />
              ) : (
                <PublicNavbar />
              )}
            </>
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
              element={<PrivateRoute element={<RealContestDetailPage />} />}
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
              element={<PrivateRoute element={<ProblemSetsPage />} />}
            />
            <Route
              path="/problems/:setId"
              element={<PrivateRoute element={<ProblemSetDetailPage />} />}
            />
            <Route
              path="/solve/:problemId"
              element={<PrivateRoute element={<SolveProblemPage />} />}
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
              path="/certificates"
              element={<PrivateRoute element={<CertificatesPage />} />}
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
              element={<PrivateRoute element={<QuizListPage />} />}
            />
            <Route
              path="/quizzes/play/:quizSlug"
              element={<PrivateRoute element={<QuizPlayerPage />} />}
            />
            <Route
              path="/quizzes/results/:attemptId"
              element={<PrivateRoute element={<QuizResultPage />} />}
            />
            <Route
              path="/showcase"
              element={<PrivateRoute element={<ShadcnShowcasePage />} />}
            />
            <Route
              path="/test-realtime"
              element={<PrivateRoute element={<RealTimeTest />} />}
            />
            <Route
              path="/test-collaborative"
              element={<PrivateRoute element={<CollaborativeTest />} />}
            />
            <Route
              path="/test-simple-collaborative"
              element={<PrivateRoute element={<SimpleCollaborativeTest />} />}
            />
            <Route
              path="/test-debug-collaborative"
              element={<PrivateRoute element={<DebugCollaborativeTest />} />}
            />
            <Route
              path="/test-collaborative-system"
              element={<PrivateRoute element={<CollaborativeSystemTest />} />}
            />
            <Route
              path="/auth-diagnostic"
              element={<PrivateRoute element={<AuthDiagnostic />} />}
            />
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={
                !isAuthenticated ? (
                  <AdminLoginPage />
                ) : (
                  <Navigate to="/admin/dashboard" />
                )
              } 
            />
            <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
            <Route path="/admin/users" element={<PrivateRoute element={<AdminUsersPage />} />} />
            <Route path="/admin/problems" element={<PrivateRoute element={<AdminProblemsPage />} />} />
            <Route path="/admin/quizzes" element={<PrivateRoute element={<AdminQuizzesPage />} />} />
            <Route path="/admin/contests" element={<PrivateRoute element={<AdminContestsPage />} />} />
            <Route path="/admin/contests/create" element={<PrivateRoute element={<AdminContestFormPage />} />} />
            <Route path="/admin/contests/edit/:contestId" element={<PrivateRoute element={<AdminContestFormPage />} />} />
            <Route path="/admin/seed-data" element={<PrivateRoute element={<AdminDataSeedPage />} />} />
            <Route path="/admin/courses" element={<PrivateRoute element={<AdminDashboard />} />} />
          </Routes>
        </main>

          {/* Footer - Hide for admin routes */}
          {!isAdminRoute && isAuthenticated && <Footer />}
          
          {/* PWA Install Prompt */}
          {!isAdminRoute && <PWAInstallPrompt />}
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
