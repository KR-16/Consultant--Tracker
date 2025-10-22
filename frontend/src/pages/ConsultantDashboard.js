import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as ApplyIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { jobAPI, applicationAPI } from '../api';
import ResumeUpload from '../components/ResumeUpload';

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [applicationFormData, setApplicationFormData] = useState({
    cover_letter: '',
  });
  const [currentApplication, setCurrentApplication] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOpenJobs();
    fetchMyApplications();
  }, []);

  const fetchOpenJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getOpenJobs();
      setJobs(response.data);
    } catch (error) {
      showSnackbar('Error fetching jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setMyApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchOpenJobs();
      return;
    }

    setLoading(true);
    try {
      const response = await jobAPI.searchJobs(searchQuery);
      setJobs(response.data);
    } catch (error) {
      showSnackbar('Error searching jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationFormData({ cover_letter: '' });
    setOpenApplicationDialog(true);
  };

  const handleCloseApplicationDialog = () => {
    setOpenApplicationDialog(false);
    setSelectedJob(null);
    setCurrentApplication(null);
    setApplicationFormData({ cover_letter: '' });
  };

  const handleSubmitApplication = async () => {
    try {
      const response = await applicationAPI.create({
        job_id: selectedJob.id,
        cover_letter: applicationFormData.cover_letter,
      });
      
      setCurrentApplication(response.data);
      showSnackbar('Application submitted successfully! You can now upload your resume.');
      
      // Don't close dialog yet, show resume upload
    } catch (error) {
      showSnackbar('Error submitting application', 'error');
    }
  };

  const handleResumeUploadSuccess = () => {
    showSnackbar('Resume uploaded successfully!');
    handleCloseApplicationDialog();
    fetchMyApplications();
  };

  const handleResumeUploadError = (error) => {
    showSnackbar('Error uploading resume', 'error');
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationAPI.withdraw(applicationId);
        showSnackbar('Application withdrawn successfully');
        fetchMyApplications();
      } catch (error) {
        showSnackbar('Error withdrawing application', 'error');
      }
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'info';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'INTERVIEW_SCHEDULED':
        return 'primary';
      case 'INTERVIEWED':
        return 'secondary';
      case 'OFFERED':
        return 'success';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'WITHDRAWN':
        return 'default';
      default:
        return 'default';
    }
  };

  const hasAppliedToJob = (jobId) => {
    return myApplications.some(app => app.job_id === jobId);
  };

  const stats = {
    totalJobs: jobs.length,
    myApplications: myApplications.length,
    pendingApplications: myApplications.filter(a => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length,
    interviews: myApplications.filter(a => a.status === 'INTERVIEW_SCHEDULED' || a.status === 'INTERVIEWED').length,
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Consultant Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.totalJobs}</Typography>
              <Typography variant="body2" color="text.secondary">
                Available Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.myApplications}</Typography>
              <Typography variant="body2" color="text.secondary">
                My Applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.pendingApplications}</Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.interviews}</Typography>
              <Typography variant="body2" color="text.secondary">
                Interviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Jobs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Jobs
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by title, company, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Available Jobs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Available Jobs
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.experience_years} years</TableCell>
                    <TableCell>{job.salary_range || 'Not specified'}</TableCell>
                    <TableCell>
                      <Chip
                        label={hasAppliedToJob(job.id) ? 'Applied' : 'Available'}
                        color={hasAppliedToJob(job.id) ? 'info' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedJob(job)}
                      >
                        <ViewIcon />
                      </IconButton>
                      {!hasAppliedToJob(job.id) && (
                        <IconButton
                          size="small"
                          onClick={() => handleApply(job)}
                        >
                          <ApplyIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* My Applications */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Applications
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myApplications.map((application) => {
                  const job = jobs.find(j => j.id === application.job_id);
                  return (
                    <TableRow key={application.id}>
                      <TableCell>{job?.title || 'Unknown Job'}</TableCell>
                      <TableCell>{job?.company || 'Unknown Company'}</TableCell>
                      <TableCell>
                        {new Date(application.applied_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.status}
                          color={getApplicationStatusColor(application.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {(application.status === 'APPLIED' || application.status === 'UNDER_REVIEW') && (
                          <IconButton
                            size="small"
                            onClick={() => handleWithdrawApplication(application.id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Application Dialog */}
      <Dialog open={openApplicationDialog} onClose={handleCloseApplicationDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentApplication ? 'Upload Resume' : `Apply for ${selectedJob?.title}`}
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedJob.title} at {selectedJob.company}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedJob.location} • {selectedJob.experience_years} years experience
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {selectedJob.description}
              </Typography>
            </Box>
          )}
          
          {!currentApplication ? (
            <TextField
              fullWidth
              label="Cover Letter"
              multiline
              rows={6}
              value={applicationFormData.cover_letter}
              onChange={(e) => setApplicationFormData({ ...applicationFormData, cover_letter: e.target.value })}
              placeholder="Tell the recruiter why you're interested in this position..."
            />
          ) : (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Application submitted successfully! Please upload your resume to complete the application.
              </Alert>
              <ResumeUpload
                applicationId={currentApplication.id}
                onUploadSuccess={handleResumeUploadSuccess}
                onUploadError={handleResumeUploadError}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApplicationDialog}>
            {currentApplication ? 'Skip Resume Upload' : 'Cancel'}
          </Button>
          {!currentApplication && (
            <Button onClick={handleSubmitApplication} variant="contained">
              Submit Application
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsultantDashboard;
