import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'CONSULTANT',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Rules for Display
  const passwordRules = [
    { label: "At least 6 characters", valid: formData.password.length >= 6 },
    { label: "At least one number", valid: /\d/.test(formData.password) },
    { label: "At least one special char (!@#$)", valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- 1. Client-Side Validation ---

    // Name Validation (Min 5 chars)
    if (formData.name.trim().length < 5) {
      setError('Full Name (Username) must be at least 5 characters long');
      return;
    }

    // Email Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password Matching
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password Strength Check (Double check before submitting)
    const isStrong = passwordRules.every(rule => rule.valid);
    if (!isStrong) {
      setError('Please meet all password requirements listed below');
      return;
    }

    // --- 2. Submit to Backend ---
    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/login');
    } else {
      // Handle Backend Errors (e.g., "User already exists")
      const errData = result.error;
      let msg = "Registration failed";

      if (errData) {
        if (typeof errData === 'string') {
           msg = errData; // Likely "Email already registered"
        }
        else if (Array.isArray(errData) && errData.length > 0) {
           const firstError = errData[0];
           if (firstError.loc && firstError.loc.includes('email')) {
               msg = "Invalid email address";
           } else {
               msg = firstError.msg;
           }
        }
        else if (errData.detail) {
             msg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
        }
      }
      
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Consultant Tracker
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name / Username"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              helperText="Minimum 5 characters"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="CONSULTANT">Consultant</MenuItem>
                <MenuItem value="RECRUITER">Recruiter</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            {/* PASSWORD REQUIREMENTS UI */}
            <Box sx={{ mt: 1, mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', ml: 1 }}>
                Password Requirements:
              </Typography>
              <List dense sx={{ py: 0 }}>
                {passwordRules.map((rule, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                       {formData.password.length > 0 ? (
                          rule.valid ? 
                            <CheckCircleOutlineIcon fontSize="small" color="success" /> : 
                            <HighlightOffIcon fontSize="small" color="error" />
                       ) : (
                          <FiberManualRecordIcon fontSize="small" color="disabled" style={{ fontSize: 10 }} />
                       )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={rule.label} 
                      primaryTypographyProps={{ 
                        variant: 'caption', 
                        color: formData.password.length > 0 ? (rule.valid ? 'success.main' : 'error.main') : 'text.secondary'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'SIGN UP'}
            </Button>
            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;