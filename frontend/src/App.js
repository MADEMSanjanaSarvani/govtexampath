import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Exams from './pages/Exams';
import ExamDetailPage from './pages/ExamDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Bookmarks from './pages/Bookmarks';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageExams from './pages/admin/ManageExams';
import ManageUsers from './pages/admin/ManageUsers';
import SendNotification from './pages/admin/SendNotification';
import NotFound from './pages/NotFound';

function App() {
  return (
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
              <Routes>
                {/* Public routes with layout */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/exams" element={<Layout><Exams /></Layout>} />
                <Route path="/exams/:id" element={<Layout><ExamDetailPage /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
                <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />

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
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
