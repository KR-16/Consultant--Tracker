import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { applicationAPI } from '../api';

const ResumeUpload = ({ applicationId, onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeInfo, setResumeInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PDF or Word document');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await applicationAPI.uploadResume(applicationId, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSuccess('Resume uploaded successfully!');
      setResumeInfo({
        filename: response.data.filename,
        file_path: response.data.file_path,
        uploaded_at: new Date().toISOString(),
      });
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      setError(error.response?.data?.detail || 'Error uploading resume');
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await applicationAPI.downloadResume(applicationId);
      // The API should return a blob for download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resumeInfo?.filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Error downloading resume');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await applicationAPI.deleteResume(applicationId);
        setResumeInfo(null);
        setSuccess('Resume deleted successfully');
      } catch (error) {
        setError('Error deleting resume');
      }
    }
  };

  const getFileIcon = (filename) => {
    if (filename?.toLowerCase().endsWith('.pdf')) {
      return '📄';
    } else if (filename?.toLowerCase().match(/\.(doc|docx)$/)) {
      return '📝';
    }
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resume Upload
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading resume...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {resumeInfo ? (
        <Box>
          <Chip
            icon={<CheckCircleIcon />}
            label={`Resume uploaded: ${resumeInfo.filename}`}
            color="success"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              size="small"
            >
              Download
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              size="small"
            >
              Delete
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />
          
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ mb: 2 }}
          >
            Upload Resume
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </Typography>
        </Box>
      )}

      {/* Resume Info Dialog */}
      <Dialog open={showInfo} onClose={() => setShowInfo(false)}>
        <DialogTitle>Resume Information</DialogTitle>
        <DialogContent>
          {resumeInfo && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Filename"
                  secondary={resumeInfo.filename}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="File Size"
                  secondary={formatFileSize(resumeInfo.size || 0)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Uploaded"
                  secondary={new Date(resumeInfo.uploaded_at).toLocaleString()}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeUpload;
