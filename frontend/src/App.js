import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ConsultantDashboard from './pages/ConsultantDashboard';
import Consultants from './pages/Consultants';
import Submissions from './pages/Submissions';
import PerConsultant from './pages/PerConsultant';
import Availability from './pages/Availability';
import Reports from './pages/Reports';

// Main App Content Component
function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  const handleExport = () => {
    // Export functionality will be implemented in individual pages
    handleMenuClose();
  };

  const handleImport = () => {
    // Import functionality will be implemented in individual pages
    handleMenuClose();
  };

  // Role-based tab routes
  const getTabRoutes = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'ADMIN':
        return [
          { path: '/admin', component: AdminDashboard, label: 'Admin Dashboard' },
          { path: '/admin/consultants', component: Consultants, label: 'Consultants' },
          { path: '/admin/submissions', component: Submissions, label: 'Submissions' },
          { path: '/admin/reports', component: Reports, label: 'Reports' },
        ];
      case 'RECRUITER':
        return [
          { path: '/recruiter', component: RecruiterDashboard, label: 'Dashboard' },
          { path: '/recruiter/jobs', component: () => <div>Jobs Management</div>, label: 'Jobs' },
          { path: '/recruiter/applications', component: () => <div>Applications</div>, label: 'Applications' },
        ];
      case 'CONSULTANT':
        return [
          { path: '/consultant', component: ConsultantDashboard, label: 'Dashboard' },
          { path: '/consultant/jobs', component: () => <div>Available Jobs</div>, label: 'Jobs' },
          { path: '/consultant/applications', component: () => <div>My Applications</div>, label: 'Applications' },
        ];
      default:
        return [];
    }
  };

  const tabRoutes = getTabRoutes();

  if (!isAuthenticated()) {
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
            Consultant Tracker - {user?.role}
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, minWidth: 200 }}
          />
          
          <Button
            color="inherit"
            startIcon={<AccountIcon />}
            sx={{ mr: 1 }}
          >
            {user?.name}
          </Button>
          
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleExport}>
              <DownloadIcon sx={{ mr: 1 }} />
              Export Data
            </MenuItem>
            <MenuItem onClick={handleImport}>
              <UploadIcon sx={{ mr: 1 }} />
              Import Data
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
        
        {tabRoutes.length > 0 && (
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            {tabRoutes.map((route, index) => (
              <Tab key={index} label={route.label} />
            ))}
          </Tabs>
        )}
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Routes>
          {tabRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component searchQuery={searchQuery} />}
            />
          ))}
          <Route path="*" element={<Navigate to={tabRoutes[0]?.path || "/"} replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

// Main App Component with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
