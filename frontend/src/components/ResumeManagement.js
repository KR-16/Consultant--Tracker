import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { applicationAPI } from '../api';

const ResumeManagement = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobApplications();
    }
  }, [jobId]);

  const fetchJobApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.getJobApplications(jobId);
      setApplications(response.data);
    } catch (error) {
      showSnackbar('Error fetching applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDownloadResume = async (applicationId, filename) => {
    try {
      const response = await applicationAPI.downloadResume(applicationId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSnackbar('Resume downloaded successfully');
    } catch (error) {
      showSnackbar('Error downloading resume', 'error');
    }
  };

  const handleViewResume = async (applicationId) => {
    try {
      const response = await applicationAPI.getResumeInfo(applicationId);
      setSelectedApplication(response.data);
      setOpenResumeDialog(true);
    } catch (error) {
      showSnackbar('Error fetching resume info', 'error');
    }
  };

  const getStatusColor = (status) => {
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

  const hasResume = (application) => {
    return application.resume_path && application.resume_path.trim() !== '';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resume Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  Consultant {application.consultant_id}
                </TableCell>
                <TableCell>
                  {new Date(application.applied_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {hasResume(application) ? (
                    <Chip
                      icon={<AttachFileIcon />}
                      label="Uploaded"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label="Not Uploaded"
                      color="default"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {hasResume(application) && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleViewResume(application.id)}
                        title="View Resume Info"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadResume(application.id, application.resume_path)}
                        title="Download Resume"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resume Info Dialog */}
      <Dialog open={openResumeDialog} onClose={() => setOpenResumeDialog(false)}>
        <DialogTitle>Resume Information</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Filename:</strong> {selectedApplication.filename}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>File Size:</strong> {selectedApplication.size ? `${(selectedApplication.size / 1024).toFixed(2)} KB` : 'Unknown'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Uploaded:</strong> {selectedApplication.uploaded_at ? new Date(selectedApplication.uploaded_at).toLocaleString() : 'Unknown'}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedApplication.exists ? 'Available' : 'File not found'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResumeDialog(false)}>Close</Button>
          {selectedApplication && selectedApplication.exists && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                handleDownloadResume(selectedApplication.application_id, selectedApplication.filename);
                setOpenResumeDialog(false);
              }}
            >
              Download Resume
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

export default ResumeManagement;
