import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CandidateJobs from './pages/candidates/CandidateJobs';
import CandidateTracker from './pages/candidates/CandidateTracker';
import CandidateResume from './pages/candidates/CandidateResume';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Availability from './pages/Availability';
import Candidates from './pages/candidates/Candidates'; 
import Submissions from './pages/submissions/Submissions'; 
import NotFound from './pages/NotFound';

// Placeholder for Reports (Create a real file later if needed)
const Reports = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
    <p className="text-slate-500 mt-2">Analytics module coming soon.</p>
  </div>
);

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

            {/* --- PROTECTED ROUTES (All wrapped in Layout) --- */}
            
            
            {/* Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Availability */}
            <Route 
              path="/availability" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Availability />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Candidates (Consultants) - Admin & Manager Only */}
            <Route 
              path="/candidates" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                  <Layout>
                    <Candidates />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Submissions - Admin & Manager Only */}
            <Route 
              path="/submissions" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                  <Layout>
                    <Submissions />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Reports - Admin & Manager Only */}
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* --- ADMIN ONLY ROUTES --- */}
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* --- CATCH ALL --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;