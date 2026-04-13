import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Eagerly load Home (first page users see)
import Home from './pages/Home';

// Lazy load all other pages for code splitting
const Exams = lazy(() => import('./pages/Exams'));
const ExamDetailPage = lazy(() => import('./pages/ExamDetailPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageExams = lazy(() => import('./pages/admin/ManageExams'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const SendNotification = lazy(() => import('./pages/admin/SendNotification'));
const AIGuide = lazy(() => import('./pages/AIGuide'));
const EligibilityChecker = lazy(() => import('./pages/EligibilityChecker'));
const MindMaps = lazy(() => import('./pages/MindMaps'));
const Resources = lazy(() => import('./pages/Resources'));
const CurrentAffairs = lazy(() => import('./pages/CurrentAffairs'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <HelmetProvider>
    <ErrorBoundary>
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes with layout */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/exams" element={<Layout><Exams /></Layout>} />
                <Route path="/exams/:id" element={<Layout><ExamDetailPage /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
                <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />
                <Route path="/ai-guide" element={<Layout><AIGuide /></Layout>} />
                <Route path="/eligibility-checker" element={<Layout><EligibilityChecker /></Layout>} />
                <Route path="/mind-maps" element={<Layout><MindMaps /></Layout>} />
                <Route path="/resources" element={<Layout><Resources /></Layout>} />
                <Route path="/current-affairs" element={<Layout><CurrentAffairs /></Layout>} />

                {/* Category shortcut routes — redirect to /exams?category=X */}
                <Route path="/statepsc" element={<Navigate to="/exams?category=State PSC" replace />} />
                <Route path="/state-psc" element={<Navigate to="/exams?category=State PSC" replace />} />
                <Route path="/teaching" element={<Navigate to="/exams?category=Teaching" replace />} />
                <Route path="/police" element={<Navigate to="/exams?category=Police" replace />} />
                <Route path="/insurance" element={<Navigate to="/exams?category=Insurance" replace />} />
                <Route path="/upsc" element={<Navigate to="/exams?category=UPSC" replace />} />
                <Route path="/ssc" element={<Navigate to="/exams?category=SSC" replace />} />
                <Route path="/banking" element={<Navigate to="/exams?category=Banking" replace />} />
                <Route path="/railways" element={<Navigate to="/exams?category=Railways" replace />} />
                <Route path="/defence" element={<Navigate to="/exams?category=Defence" replace />} />
                <Route path="/gate" element={<Navigate to="/exams?category=GATE" replace />} />
                <Route path="/appsc" element={<Navigate to="/exams?category=APPSC" replace />} />
                <Route path="/tspsc" element={<Navigate to="/exams?category=TSPSC" replace />} />
                <Route path="/other-exams" element={<Navigate to="/exams" replace />} />
                <Route path="/other" element={<Navigate to="/exams" replace />} />

                {/* Protected user routes with layout */}
                <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                <Route path="/bookmarks" element={<Layout><ProtectedRoute><Bookmarks /></ProtectedRoute></Layout>} />
                <Route path="/notifications" element={<Layout><ProtectedRoute><Notifications /></ProtectedRoute></Layout>} />
                <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />

                {/* Admin routes (AdminLayout includes its own navbar) */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/exams" element={<ProtectedRoute adminOnly><ManageExams /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
                <Route path="/admin/notifications" element={<ProtectedRoute adminOnly><SendNotification /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
              </Suspense>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
    </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
