import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Users, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import ConsultantDashboard from './components/consultant/ConsultantDashboard';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';

const Home = () => {
  const { user } = useAuth();
  if (user?.role === 'CONSULTANT') {
    return <Navigate to="/consultant/dashboard" replace />;
  }
  if (user?.role === 'RECRUITER' || user?.role === 'ADMIN') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    window.location.href = '/login';
  };

  // If not authenticated, show login/register routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Consultant Tracker</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-slate-600">
                {user?.name} <span className="text-slate-400">•</span>{' '}
                <span className="font-medium text-slate-900">{user?.role}</span>
              </div>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <div className="px-2 py-1">
                        <div className="px-3 py-2 text-xs text-slate-500">
                          Role: <span className="font-medium text-slate-900">{user?.role}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 px-2 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />

          {/* Consultant Routes */}
          <Route path="/consultant/*" element={
            <ProtectedRoute requiredRole="CONSULTANT">
              <Routes>
                <Route path="dashboard" element={<ConsultantDashboard />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Recruiter Routes */}
          <Route path="/recruiter/*" element={
            <ProtectedRoute requiredRole="RECRUITER">
              <Routes>
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
