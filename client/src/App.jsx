import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Footer } from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load page components
const LandingPage    = lazy(() => import('./pages/LandingPage'));
const LoginPage      = lazy(() => import('./pages/LoginPage'));
const SignupPage     = lazy(() => import('./pages/SignupPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const LessonPage     = lazy(() => import('./pages/LessonPage'));
const Arena          = lazy(() => import('./pages/Arena'));
const ProfilePage    = lazy(() => import('./pages/ProfilePage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const BlogPage       = lazy(() => import('./pages/BlogPage'));
const BlogPost       = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy  = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const About          = lazy(() => import('./pages/About'));
const FAQ            = lazy(() => import('./pages/FAQ'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading spinner
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
    </div>
  </div>
);

// Pages that should NOT show the global footer (they have their own layout)
const NO_FOOTER_PAGES = ['/dashboard', '/learn', '/arena', '/profile', '/leaderboard', '/onboarding', '/admin', '/login', '/signup', '/oauth'];

// ProtectedRoute: redirects unauthenticated users to /login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// GuestRoute: redirects already-logged-in users away from login/signup
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Layout wrapper that conditionally renders footer
const AppLayout = ({ children }) => {
  const path = window.location.pathname;
  const showFooter = !NO_FOOTER_PAGES.some(p => path.startsWith(p));
  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
};

function AppRoutes() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Auth pages (redirect if already logged in) */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* Onboarding (requires auth) */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

          {/* Protected app pages */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/learn/:level/:slug/:exerciseId?" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
