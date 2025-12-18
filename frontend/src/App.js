import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Features
import Dashboard from './pages/dashboard/Dashboard';
import Availability from './pages/Availability';
import UserManagement from './pages/admin/UserManagement';
import Candidates from './pages/candidates/Candidates'; 
import Submissions from './pages/submissions/Submissions'; 
import CandidateJobs from './pages/candidates/CandidateJobs';
import CandidateTracker from './pages/candidates/CandidateTracker';
import CandidateResume from './pages/candidates/CandidateResume';
import CandidateJobDetails from './pages/candidates/CandidateJobDetails';

const Reports = () => <div className="p-8"><h1 className="text-2xl font-bold">Reports</h1></div>;

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* APP SHELL (Layout) */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                
                {/* 1. Dashboard (Open to ALL roles) */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* 2. Candidate Specific Pages */}
                <Route path="/candidate/jobs/:id" element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <Layout>
                <CandidateJobDetails />
                </Layout>
                </ProtectedRoute>
                } />
                <Route path="/candidate/tracker" element={<CandidateTracker />} />
                <Route path="/candidate/resume" element={<CandidateResume />} />

                {/* 3. Manager & Admin Pages */}
                <Route path="/candidates" element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                    <Candidates />
                  </ProtectedRoute>
                } />
                
                <Route path="/submissions" element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                    <Submissions />
                  </ProtectedRoute>
                } />
                
                <Route path="/availability" element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                    <Availability />
                  </ProtectedRoute>
                } />
                
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TALENT_MANAGER']}>
                    <Reports />
                  </ProtectedRoute>
                } />

                {/* 4. Admin Only Pages */}
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />

            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;