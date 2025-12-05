import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
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
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Consultant Tracker - Authentication
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name} ({user?.role})
            </Typography>
            <Button
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </Button>
          </Box>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                Role: {user?.role}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
    </Box>
  );
}

export default App;
