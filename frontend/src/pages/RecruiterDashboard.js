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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { jobAPI, applicationAPI } from '../api';
import ResumeManagement from '../components/ResumeManagement';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    tech_stack: [],
    experience_years: 0,
    salary_range: '',
    employment_type: 'FULL_TIME',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      showSnackbar('Error fetching jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getAll();
      setApplications(response.data);
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

  const handleOpenJobDialog = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        tech_stack: job.tech_stack,
        experience_years: job.experience_years,
        salary_range: job.salary_range || '',
        employment_type: job.employment_type,
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: [],
        tech_stack: [],
        experience_years: 0,
        salary_range: '',
        employment_type: 'FULL_TIME',
      });
    }
    setOpenJobDialog(true);
  };

  const handleCloseJobDialog = () => {
    setOpenJobDialog(false);
    setEditingJob(null);
  };

  const handleJobSubmit = async () => {
    try {
      if (editingJob) {
        await jobAPI.update(editingJob.id, jobFormData);
        showSnackbar('Job updated successfully');
      } else {
        await jobAPI.create(jobFormData);
        showSnackbar('Job created successfully');
      }
      handleCloseJobDialog();
      fetchJobs();
    } catch (error) {
      showSnackbar('Error saving job', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(jobId);
        showSnackbar('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        showSnackbar('Error deleting job', 'error');
      }
    }
  };

  const handleCloseJob = async (jobId) => {
    try {
      await jobAPI.closeJob(jobId);
      showSnackbar('Job closed successfully');
      fetchJobs();
    } catch (error) {
      showSnackbar('Error closing job', 'error');
    }
  };

  const handleFillJob = async (jobId) => {
    try {
      await jobAPI.fillJob(jobId);
      showSnackbar('Job marked as filled');
      fetchJobs();
    } catch (error) {
      showSnackbar('Error updating job status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'CLOSED':
        return 'default';
      case 'FILLED':
        return 'info';
      default:
        return 'default';
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

  const stats = {
    totalJobs: jobs.length,
    openJobs: jobs.filter(j => j.status === 'OPEN').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length,
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Recruiter Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenJobDialog()}
        >
          Post New Job
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.totalJobs}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Jobs Posted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.openJobs}</Typography>
              <Typography variant="body2" color="text.secondary">
                Open Positions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.totalApplications}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Applications
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
      </Grid>

      {/* Jobs Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Job Postings
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {applications.filter(a => a.job_id === job.id).length}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenJobDialog(job)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {job.status === 'OPEN' && (
                        <IconButton
                          size="small"
                          onClick={() => handleCloseJob(job.id)}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                      {job.status === 'OPEN' && (
                        <IconButton
                          size="small"
                          onClick={() => handleFillJob(job.id)}
                        >
                          <CheckCircleIcon />
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

      {/* Recent Applications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Applications
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Resume</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.slice(0, 10).map((application) => {
                  const job = jobs.find(j => j.id === application.job_id);
                  return (
                    <TableRow key={application.id}>
                      <TableCell>{job?.title || 'Unknown Job'}</TableCell>
                      <TableCell>Consultant {application.consultant_id}</TableCell>
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
                        {application.resume_path ? (
                          <Chip
                            label="Uploaded"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Pending"
                            color="default"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Resume Management */}
      <Card>
        <CardContent>
          <ResumeManagement />
        </CardContent>
      </Card>

      {/* Job Dialog */}
      <Dialog open={openJobDialog} onClose={handleCloseJobDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingJob ? 'Edit Job' : 'Post New Job'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={jobFormData.title}
                onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={jobFormData.company}
                onChange={(e) => setJobFormData({ ...jobFormData, company: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={jobFormData.location}
                onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (Years)"
                type="number"
                value={jobFormData.experience_years}
                onChange={(e) => setJobFormData({ ...jobFormData, experience_years: parseInt(e.target.value) || 0 })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary Range"
                value={jobFormData.salary_range}
                onChange={(e) => setJobFormData({ ...jobFormData, salary_range: e.target.value })}
                placeholder="e.g., $80,000 - $120,000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={jobFormData.employment_type}
                  onChange={(e) => setJobFormData({ ...jobFormData, employment_type: e.target.value })}
                  label="Employment Type"
                >
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                multiline
                rows={4}
                value={jobFormData.description}
                onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJobDialog}>Cancel</Button>
          <Button onClick={handleJobSubmit} variant="contained">
            {editingJob ? 'Update' : 'Post Job'}
          </Button>
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

export default RecruiterDashboard;
