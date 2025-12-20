import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// --- Pages ---

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';

// Hiring Manager Pages
import ManagerDashboard from './pages/dashboard/Dashboard'; 
import MyCandidates from './pages/hiring/MyCandidates';
import Submissions from './pages/submissions/Submissions'; 
import PostJob from './pages/hiring/PostJob';
import Pipeline from './pages/hiring/Pipeline'; 

// Candidate Pages
import CandidateDashboard from './pages/candidates/CandidateDashboard';
import JobBoard from './pages/candidates/JobBoard';       
import MyApplications from './pages/candidates/MyApplications'; 
import Profile from './pages/candidates/Profile';        
import CandidateJobDetails from './pages/candidates/CandidateJobDetails';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- PROTECTED ROUTES  --- */}
            <Route element={<Layout />}>

              {/* 1. ADMIN ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* 2. HIRING MANAGER ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['hiring_manager', 'admin']} />}>
                <Route path="/hiring/dashboard" element={<ManagerDashboard />} />
                <Route path="/hiring/my-candidates" element={<MyCandidates />} />
                <Route path="/submissions" element={<Submissions />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/jobs/new" element={<PostJob />} />
                <Route path="/jobs" element={<Navigate to="/pipeline" replace />} />
              </Route>

              {/* 3. CANDIDATE ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                <Route path="/candidate/jobs" element={<JobBoard />} />
                <Route path="/candidate/jobs/:id" element={<CandidateJobDetails />} />
                <Route path="/candidate/applications" element={<MyApplications />} />
                <Route path="/candidate/profile" element={<Profile />} />
                
                {/* Future Feature Placeholder */}
                <Route path="/candidate/ai-resume" element={<div className="p-8">AI Resume Builder</div>} />
              </Route>

              {/* Generic Dashboard Redirect safety net */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />

            </Route>

            {/* --- 404 PAGE --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;