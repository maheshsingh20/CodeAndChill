import { JSX, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Import NoirSystem
import { initNoirAccentSystem } from "./utils/noir-accent";

// import { FloatingParticles } from "./components/ui/FloatingParticles";
// Import Background Components (commented out - animations disabled to prevent auto-refresh)
// import { AnimatedBackground, StaticDottedBackground } from "./components/ui/AnimatedBackground";
// import { AdminBackground } from "./components/ui/AdminBackground";
// import { usePerformanceMode } from "./hooks/usePerformanceMode";
import { SmoothScroll } from "./components/ui/SmoothScroll";
import { PageTransition } from "./components/ui/PageTransition";

// Import background styles
import "./styles/animated-background.css";

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
  ProblemSolverPage,
  ProblemSetsPage,
  ProblemSetDetailPage,
  SolveProblemPage,
  SettingsPage,
  QuizzesPage,
  QuizListPage,
  QuizPlayerPage,
  QuizResultPage,
  QuizPage,
  DashboardPage,
  ForumPage,
  SkillTestsPage,
  SkillTestTakingPage,
  CertificatesPage,
  CareersPage,
  JobDetailPage,
  MyApplicationsPage,
  AboutPage,
  ChatPage,
} from "./pages";

// Import new learning path pages
import { LearningPathCategoriesPage } from "./pages/LearningPathCategoriesPage";
import { LearningPathSearchPage } from "./pages/LearningPathSearchPage";
import { LearningPathLeaderboardPage } from "./pages/LearningPathLeaderboardPage";
import { LearningPathStudioPage } from "./pages/LearningPathStudioPage";
import { LearningPathAnalyticsPage } from "./pages/LearningPathAnalyticsPage";

import { RealContestDetailPage } from "./pages/RealContestDetailPage";

import { EnhancedCourseDetailPage } from "./pages/EnhancedCourseDetailPage";

import { performAppCleanup } from "@/utils/cleanup";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminDataSeedPage } from "./pages/admin/AdminDataSeedPage";
import { AdminProblemsPage } from "./pages/admin/AdminProblemsPage";
import { AdminQuizzesPage } from "./pages/admin/AdminQuizzesPage";
import { AdminContestsPage } from "./pages/admin/AdminContestsPage";
import { AdminContestFormPage } from "./pages/admin/AdminContestFormPage";
import { AdminJobApplicationsPage } from "./pages/admin/AdminJobApplicationsPage";

import { ShadcnShowcasePage } from "./pages/ShadcnShowcasePage";
import { CardShowcase } from "./components/showcase/CardShowcase";
import { RealTimeTest } from "./components/test/RealTimeTest";
import { AnimationShowcase } from "./components/demo/AnimationShowcase";

// OAuth Callback Component
import { OAuthCallback } from "./components/auth/OAuthCallback";

// Layout components
import { Navbar as PublicNavbar } from "./components/layout/Navbar";
import { Navbar as DashboardNavbar } from "./components/dashboard/Navbar";
import { Footer } from "./components/dashboard/Footer";

// Context providers
import { UserProvider } from "./contexts/UserContext";

// Hooks

// Constants
import { STORAGE_KEYS } from "./constants";

import { CardSamples } from "./components/showcase/CardSamples";

// Import Activity Tracker
import { ActivityTracker } from "./components/activity/ActivityTracker";

// Import Platform Assistant Widget
import { PlatformAssistantWidget } from "./components/platform-assistant/PlatformAssistantWidget";

// Import PWA components
import { PWAInstallPrompt } from "./components/pwa/PWAInstallPrompt";
import "./utils/pwa"; // Initialize PWA manager

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  // const { isHighPerformance } = usePerformanceMode(); // Disabled - animations turned off

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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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

  // Wrapper for admin protected routes
  const AdminPrivateRoute = ({ element }: { element: JSX.Element }) => {
    const adminToken = localStorage.getItem("adminToken");
    return adminToken ? element : <Navigate to="/admin/login" />;
  };

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // Show loading screen while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
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
        <SmoothScroll>
          {/* <AuthDebug /> */}
          {!isAdminRoute && <ActivityTracker isAuthenticated={isAuthenticated} />}

          {/* {isAdminRoute ? (
            <AdminBackground />
          ) : isHighPerformance ? (
            <AnimatedBackground />
          ) : (
            <StaticDottedBackground />
          )} */}

          {/* Floating Particles - Only for authenticated users and not admin routes */}
          {/* {!isAdminRoute && isAuthenticated && <FloatingParticles particleCount={50} />} */}

          <div className="min-h-screen flex flex-col relative app-background">
            {/* Global background orbs */}
            <div className="background-orbs"></div>
            {/* Remove the old background elements */}

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
              <PageTransition>
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
                  <Route
                    path="/auth/callback"
                    element={<OAuthCallback login={login} />}
                  />
                  {/* Public Career Routes */}
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/careers/:jobId" element={<JobDetailPage />} />

                  {/* Public About Route */}
                  <Route path="/about" element={<AboutPage />} />
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
                    path="/learning-paths/categories"
                    element={<PrivateRoute element={<LearningPathCategoriesPage />} />}
                  />
                  <Route
                    path="/learning-paths/search"
                    element={<PrivateRoute element={<LearningPathSearchPage />} />}
                  />
                  <Route
                    path="/learning-paths/leaderboard"
                    element={<PrivateRoute element={<LearningPathLeaderboardPage />} />}
                  />
                  <Route
                    path="/learning-paths/studio"
                    element={<PrivateRoute element={<LearningPathStudioPage />} />}
                  />
                  <Route
                    path="/learning-paths/analytics"
                    element={<PrivateRoute element={<LearningPathAnalyticsPage />} />}
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
                  {/* Career Routes */}
                  <Route
                    path="/careers"
                    element={<PrivateRoute element={<CareersPage />} />}
                  />
                  <Route
                    path="/careers/:jobId"
                    element={<PrivateRoute element={<JobDetailPage />} />}
                  />
                  <Route
                    path="/careers/my-applications"
                    element={<PrivateRoute element={<MyApplicationsPage />} />}
                  />
                  <Route
                    path="/profile"
                    element={<PrivateRoute element={<ProfilePage />} />}
                  />
                  <Route
                    path="/chat"
                    element={<PrivateRoute element={<ChatPage />} />}
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
                    path="/problem-solver"
                    element={<PrivateRoute element={<ProblemSolverPage />} />}
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
                    path="/settings"
                    element={<PrivateRoute element={<SettingsPage />} />}
                  />
                  <Route
                    path="/quizzes"
                    element={<PrivateRoute element={<QuizzesPage />} />}
                  />
                  {/* Career Routes */}
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
                    path="/card-samples"
                    element={<PrivateRoute element={<CardSamples />} />}
                  />
                  <Route
                    path="/card-showcase"
                    element={<PrivateRoute element={<CardShowcase />} />}
                  />
                  <Route
                    path="/test-realtime"
                    element={<PrivateRoute element={<RealTimeTest />} />}
                  />
                  <Route
                    path="/animation-showcase"
                    element={<PrivateRoute element={<AnimationShowcase />} />}
                  />
                  {/* Admin Routes */}
                  <Route
                    path="/admin/login"
                    element={
                      !localStorage.getItem("adminToken") ? (
                        <AdminLoginPage />
                      ) : (
                        <Navigate to="/admin/dashboard" />
                      )
                    }
                  />
                  <Route path="/admin/dashboard" element={<AdminPrivateRoute element={<AdminDashboard />} />} />
                  <Route path="/admin/users" element={<AdminPrivateRoute element={<AdminUsersPage />} />} />
                  <Route path="/admin/problems" element={<AdminPrivateRoute element={<AdminProblemsPage />} />} />
                  <Route path="/admin/quizzes" element={<AdminPrivateRoute element={<AdminQuizzesPage />} />} />
                  <Route path="/admin/contests" element={<AdminPrivateRoute element={<AdminContestsPage />} />} />
                  <Route path="/admin/contests/create" element={<AdminPrivateRoute element={<AdminContestFormPage />} />} />
                  <Route path="/admin/contests/edit/:contestId" element={<AdminPrivateRoute element={<AdminContestFormPage />} />} />
                  <Route path="/admin/job-applications" element={<AdminPrivateRoute element={<AdminJobApplicationsPage />} />} />
                  <Route path="/admin/seed-data" element={<AdminPrivateRoute element={<AdminDataSeedPage />} />} />
                  <Route path="/admin/courses" element={<AdminPrivateRoute element={<AdminDashboard />} />} />
                </Routes>
              </PageTransition>
            </main>

            {/* Footer - Hide for admin routes */}
            {!isAdminRoute && isAuthenticated && <Footer />}

            {/* Platform Assistant Widget - Show on all pages except admin routes */}
            {!isAdminRoute && <PlatformAssistantWidget />}

            {/* PWA Install Prompt */}
            {!isAdminRoute && <PWAInstallPrompt />}
          </div>
        </SmoothScroll>
      </UserProvider>
    </Router>
  );
}

export default App;
