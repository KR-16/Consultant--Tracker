import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { submissionAPI, consultantAPI } from '../api';

const PerConsultant = ({ searchQuery }) => {
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({
    totalSubmissions: 0,
    interviews: 0,
    offers: 0,
    winRate: 0,
    avgTimeToInterview: 0,
    avgTimeToOffer: 0,
  });

  useEffect(() => {
    fetchConsultants();
  }, []);

  useEffect(() => {
    if (selectedConsultant) {
      fetchConsultantData();
    }
  }, [selectedConsultant]);

  const fetchConsultants = async () => {
    try {
      const response = await consultantAPI.getAll();
      setConsultants(response.data);
      if (response.data.length > 0 && !selectedConsultant) {
        setSelectedConsultant(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching consultants:', error);
    }
  };

  const fetchConsultantData = async () => {
    if (!selectedConsultant) return;
    
    setLoading(true);
    try {
      const [submissionsResponse, historyResponse] = await Promise.all([
        submissionAPI.getByConsultant(selectedConsultant.id),
        // Note: We'll need to get status history for all submissions
        Promise.resolve([]) // Placeholder for now
      ]);
      
      setSubmissions(submissionsResponse.data);
      setStatusHistory(historyResponse.data || []);
      
      // Calculate KPIs
      calculateKPIs(submissionsResponse.data);
    } catch (error) {
      console.error('Error fetching consultant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = (submissionsData) => {
    const totalSubmissions = submissionsData.length;
    const interviews = submissionsData.filter(s => s.status === 'INTERVIEW' || s.status === 'OFFER' || s.status === 'JOINED').length;
    const offers = submissionsData.filter(s => s.status === 'OFFER' || s.status === 'JOINED').length;
    const joined = submissionsData.filter(s => s.status === 'JOINED').length;
    const winRate = totalSubmissions > 0 ? (joined / totalSubmissions) * 100 : 0;
    
    // Calculate average time to interview and offer
    const interviewSubmissions = submissionsData.filter(s => s.status === 'INTERVIEW' || s.status === 'OFFER' || s.status === 'JOINED');
    const offerSubmissions = submissionsData.filter(s => s.status === 'OFFER' || s.status === 'JOINED');
    
    const avgTimeToInterview = interviewSubmissions.length > 0 
      ? interviewSubmissions.reduce((sum, s) => {
          const daysDiff = Math.floor((new Date(s.submitted_on) - new Date()) / (1000 * 60 * 60 * 24));
          return sum + Math.abs(daysDiff);
        }, 0) / interviewSubmissions.length
      : 0;
    
    const avgTimeToOffer = offerSubmissions.length > 0
      ? offerSubmissions.reduce((sum, s) => {
          const daysDiff = Math.floor((new Date(s.submitted_on) - new Date()) / (1000 * 60 * 60 * 24));
          return sum + Math.abs(daysDiff);
        }, 0) / offerSubmissions.length
      : 0;

    setKpis({
      totalSubmissions,
      interviews,
      offers,
      winRate: Math.round(winRate * 100) / 100,
      avgTimeToInterview: Math.round(avgTimeToInterview),
      avgTimeToOffer: Math.round(avgTimeToOffer),
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'JOINED':
        return <CheckCircleIcon color="success" />;
      case 'OFFER':
        return <StarIcon color="primary" />;
      case 'INTERVIEW':
        return <ScheduleIcon color="secondary" />;
      case 'REJECTED':
        return <CancelIcon color="error" />;
      default:
        return <WorkIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'JOINED':
        return 'success';
      case 'OFFER':
        return 'primary';
      case 'INTERVIEW':
        return 'secondary';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Per-Consultant View</Typography>
      
      <Grid container spacing={3}>
        {/* Consultant Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel>Select Consultant</InputLabel>
                <Select
                  value={selectedConsultant?.id || ''}
                  onChange={(e) => {
                    const consultant = consultants.find(c => c.id === e.target.value);
                    setSelectedConsultant(consultant);
                  }}
                >
                  {consultants.map((consultant) => (
                    <MenuItem key={consultant.id} value={consultant.id}>
                      {consultant.name} - {consultant.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {selectedConsultant && (
          <>
            {/* Consultant Profile */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Profile
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5">{selectedConsultant.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedConsultant.experience_years} years experience
                    </Typography>
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary={selectedConsultant.email} />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary={selectedConsultant.phone} />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText primary={selectedConsultant.location} />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Visa Status" 
                        secondary={selectedConsultant.visa_status} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Rating" 
                        secondary={selectedConsultant.rating} 
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Tech Stack
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedConsultant.tech_stack.map((tech, index) => (
                      <Chip key={index} label={tech} size="small" />
                    ))}
                  </Box>

                  {selectedConsultant.notes && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Notes
                      </Typography>
                      <Typography variant="body2">
                        {selectedConsultant.notes}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* KPIs */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Key Performance Indicators
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary">
                          {kpis.totalSubmissions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Submissions
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="secondary">
                          {kpis.interviews}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Interviews
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="info">
                          {kpis.offers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Offers
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="success">
                          {kpis.winRate}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Win Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h6" color="primary">
                          {kpis.avgTimeToInterview} days
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Time to Interview
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h6" color="primary">
                          {kpis.avgTimeToOffer} days
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Time to Offer
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Submissions Timeline */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Submissions Timeline
                  </Typography>
                  
                  {submissions.length === 0 ? (
                    <Alert severity="info">No submissions found for this consultant.</Alert>
                  ) : (
                    <Timeline>
                      {submissions.map((submission, index) => (
                        <TimelineItem key={submission.id}>
                          <TimelineSeparator>
                            <TimelineDot color={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                            </TimelineDot>
                            {index < submissions.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="h6" component="span">
                              {submission.client_or_job}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Submitted on: {new Date(submission.submitted_on).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Recruiter: {submission.recruiter}
                            </Typography>
                            <Chip 
                              label={submission.status} 
                              color={getStatusColor(submission.status)}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                            {submission.comments && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {submission.comments}
                              </Typography>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default PerConsultant;
