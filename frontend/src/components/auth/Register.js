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
} from '@mui/material';
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
  const [passwordByteLength, setPasswordByteLength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  
    if (name === 'password') {
      const bytes = new TextEncoder().encode(value);
      setPasswordByteLength(bytes.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const passwordBytes = new TextEncoder().encode(formData.password);
    if (passwordBytes.length > 72) {
      setError(
        `Password is too long (${passwordBytes.length} bytes). Maximum 72 bytes allowed.`
      );
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/login');
    } else {
      const errData = result.error;
      let msg = "Registration failed";

      if (errData) {
        if (typeof errData === 'string') {
           msg = errData;
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
           if (Array.isArray(errData.detail)) {
             const firstDetail = errData.detail[0];
             if (firstDetail.loc && firstDetail.loc.includes('email')) {
                 msg = "Invalid email address";
             } else {
                 msg = firstDetail.msg;
             }
           } else {
             msg = errData.detail;
           }
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
            Create Account
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
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
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
              error={passwordByteLength > 72}
              helperText={
                passwordByteLength > 72
                  ? `Password too long (${passwordByteLength} bytes). Maximum 72 bytes allowed.`
                  : passwordByteLength > 0
                  ? `${passwordByteLength}/72 bytes`
                  : "6-72 bytes (bcrypt limitation)"
              }
              inputProps={{
                maxLength: 72 
              }}
            />
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
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
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