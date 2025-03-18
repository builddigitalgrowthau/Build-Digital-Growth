import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import SignupFlow from './components/auth/SignupFlow';
import Dashboard from './components/dashboard/Dashboard';
import ProjectManagement from './components/projects/ProjectManagement';
import NewProject from './components/projects/NewProject';
import NotFound from './components/common/NotFound';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupFlow />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
          <Route path="/projects/:projectId" element={<PrivateRoute><ProjectManagement /></PrivateRoute>} />
          <Route path="/projects/new" element={<PrivateRoute><NewProject /></PrivateRoute>} />

          {/* Redirect root to dashboard or login based on auth status */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
