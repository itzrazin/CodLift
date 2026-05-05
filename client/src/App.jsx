import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { LessonPage } from './components/LessonPage';
import { Arena } from './components/Arena';
import { ProfilePage } from './components/ProfilePage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { AdminDashboard } from './components/AdminDashboard';
import { OAuthCallback } from './components/OAuthCallback';
import { OnboardingPage } from './components/OnboardingPage';
import { BlogPage } from './components/BlogPage';
import { BlogPost } from './components/BlogPost';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { About } from './components/About';
import { Footer } from './components/Footer';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-cyan">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/learn/:level/:slug/:exerciseId?" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
            <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
