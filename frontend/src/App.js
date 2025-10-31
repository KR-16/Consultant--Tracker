import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import Consultants from './pages/Consultants';
import Submissions from './pages/Submissions';
import PerConsultant from './pages/PerConsultant';
import Availability from './pages/Availability';
import Reports from './pages/Reports';

function App() {
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

  const handleExport = () => {
    // Export functionality will be implemented in individual pages
    handleMenuClose();
  };

  const handleImport = () => {
    // Import functionality will be implemented in individual pages
    handleMenuClose();
  };

  const tabRoutes = [
    { path: '/', component: Consultants, label: 'Consultants' },
    { path: '/submissions', component: Submissions, label: 'Submissions' },
    { path: '/per-consultant', component: PerConsultant, label: 'Per-Consultant' },
    { path: '/availability', component: Availability, label: 'Availability' },
    { path: '/reports', component: Reports, label: 'Reports' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Consultant Tracker
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search consultants..."
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
          </Menu>
        </Toolbar>
        
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
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
