import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { consultantAPI, submissionAPI } from '../api';

const Availability = ({ searchQuery }) => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    tech_stack: [],
    experience_min: null,
    experience_max: null,
    visa_status: '',
    location: '',
    rating: '',
    available_only: true,
  });

  const visaStatusOptions = ['H1B', 'GREEN_CARD', 'CITIZEN', 'OTHER'];
  const ratingOptions = ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'];
  const techStackOptions = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL'
  ];

  useEffect(() => {
    fetchConsultants();
  }, [filters]);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (searchQuery) {
        params.name = searchQuery;
      }
      const response = await consultantAPI.getAll(params);
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (consultantId, currentStatus) => {
    try {
      await consultantAPI.update(consultantId, { available: !currentStatus });
      fetchConsultants();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleAddSubmission = (consultantId) => {
    // This would typically open a dialog or navigate to submissions page
    console.log('Add submission for consultant:', consultantId);
  };

  const handleViewProfile = (consultantId) => {
    // This would typically navigate to per-consultant view
    console.log('View profile for consultant:', consultantId);
  };

  const filteredConsultants = consultants.filter(consultant => {
    if (filters.available_only && !consultant.available) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Consultant Availability</Typography>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tech Stack</InputLabel>
                <Select
                  multiple
                  value={filters.tech_stack}
                  onChange={(e) => setFilters({ ...filters, tech_stack: e.target.value })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {techStackOptions.map((tech) => (
                    <MenuItem key={tech} value={tech}>{tech}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Min Experience"
                type="number"
                value={filters.experience_min || ''}
                onChange={(e) => setFilters({ ...filters, experience_min: e.target.value ? parseInt(e.target.value) : null })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Max Experience"
                type="number"
                value={filters.experience_max || ''}
                onChange={(e) => setFilters({ ...filters, experience_max: e.target.value ? parseInt(e.target.value) : null })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Visa Status</InputLabel>
                <Select
                  value={filters.visa_status}
                  onChange={(e) => setFilters({ ...filters, visa_status: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  {visaStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Rating</InputLabel>
                <Select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  {ratingOptions.map((rating) => (
                    <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.available_only}
                  onChange={(e) => setFilters({ ...filters, available_only: e.target.checked })}
                />
              }
              label="Show only available consultants"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          {filteredConsultants.length} consultant(s) found
        </Typography>
      </Box>

      {/* Consultants Grid */}
      <Grid container spacing={3}>
        {filteredConsultants.map((consultant) => (
          <Grid item xs={12} sm={6} md={4} key={consultant.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: consultant.available ? '2px solid #4caf50' : '1px solid #e0e0e0',
                opacity: consultant.available ? 1 : 0.7
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {consultant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {consultant.experience_years} years experience
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={consultant.available ? 'Available' : 'Unavailable'} 
                    color={consultant.available ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{consultant.email}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{consultant.phone}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{consultant.location}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{consultant.visa_status}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{consultant.rating}</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tech Stack
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {consultant.tech_stack.slice(0, 3).map((tech, index) => (
                      <Chip key={index} label={tech} size="small" />
                    ))}
                    {consultant.tech_stack.length > 3 && (
                      <Chip label={`+${consultant.tech_stack.length - 3} more`} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={consultant.available}
                        onChange={() => handleToggleAvailability(consultant.id, consultant.available)}
                        size="small"
                      />
                    }
                    label="Available"
                  />
                  
                  <Box>
                    <Tooltip title="View Profile">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewProfile(consultant.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Add Submission">
                      <IconButton 
                        size="small" 
                        onClick={() => handleAddSubmission(consultant.id)}
                        disabled={!consultant.available}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredConsultants.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No consultants found matching the current filters.
        </Alert>
      )}
    </Box>
  );
};

export default Availability;
