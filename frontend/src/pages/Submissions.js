import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
// Date picker imports removed as they're not used
import { submissionAPI, consultantAPI } from '../api';

const Submissions = ({ searchQuery }) => {
  const [submissions, setSubmissions] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [formData, setFormData] = useState({
    consultant_id: '',
    client_or_job: '',
    recruiter: '',
    submitted_on: new Date(),
    status: 'SUBMITTED',
    comments: '',
    attachment_path: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    consultant_id: '',
    recruiter: '',
    status: '',
    client_or_job: '',
    date_from: null,
    date_to: null,
  });

  const statusOptions = [
    'SUBMITTED', 'INTERVIEW', 'OFFER', 'JOINED', 'REJECTED', 'ON_HOLD', 'WITHDRAWN'
  ];

  useEffect(() => {
    fetchSubmissions();
    fetchConsultants();
  }, [filters]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (searchQuery) {
        params.client_or_job = searchQuery;
      }
      const response = await submissionAPI.getAll(params);
      setSubmissions(response.data);
    } catch (error) {
      showSnackbar('Error fetching submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultants = async () => {
    try {
      const response = await consultantAPI.getAll();
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (submission = null) => {
    if (submission) {
      setEditingSubmission(submission);
      setFormData({
        consultant_id: submission.consultant_id,
        client_or_job: submission.client_or_job,
        recruiter: submission.recruiter,
        submitted_on: new Date(submission.submitted_on),
        status: submission.status,
        comments: submission.comments || '',
        attachment_path: submission.attachment_path || '',
      });
    } else {
      setEditingSubmission(null);
      setFormData({
        consultant_id: '',
        client_or_job: '',
        recruiter: '',
        submitted_on: new Date(),
        status: 'SUBMITTED',
        comments: '',
        attachment_path: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubmission(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingSubmission) {
        await submissionAPI.update(editingSubmission.id, formData);
        showSnackbar('Submission updated successfully');
      } else {
        await submissionAPI.create(formData);
        showSnackbar('Submission created successfully');
      }
      handleCloseDialog();
      fetchSubmissions();
    } catch (error) {
      showSnackbar('Error saving submission', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await submissionAPI.delete(id);
        showSnackbar('Submission deleted successfully');
        fetchSubmissions();
      } catch (error) {
        showSnackbar('Error deleting submission', 'error');
      }
    }
  };

  // handleStatusUpdate function removed as it's not used

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await submissionAPI.importCSV(file);
        showSnackbar(`Successfully imported ${response.data.imported_count} submissions`);
        fetchSubmissions();
      } catch (error) {
        showSnackbar('Error importing CSV', 'error');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await submissionAPI.exportCSV(filters);
      const blob = new Blob([response.data.csv_content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.filename;
      a.click();
      window.URL.revokeObjectURL(url);
      showSnackbar('CSV exported successfully');
    } catch (error) {
      showSnackbar('Error exporting CSV', 'error');
    }
  };

  const getConsultantName = (consultantId) => {
    const consultant = consultants.find(c => c.id === consultantId);
    return consultant ? consultant.name : 'Unknown';
  };

  const columns = [
    { field: 'client_or_job', headerName: 'Client/Job', width: 200 },
    { 
      field: 'consultant_id', 
      headerName: 'Consultant', 
      width: 150,
      renderCell: (params) => getConsultantName(params.value),
    },
    { field: 'recruiter', headerName: 'Recruiter', width: 120 },
    { field: 'submitted_on', headerName: 'Submitted On', width: 120, type: 'date' },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'JOINED' ? 'success' :
            params.value === 'OFFER' ? 'primary' :
            params.value === 'INTERVIEW' ? 'secondary' :
            params.value === 'REJECTED' ? 'error' : 'default'
          }
          size="small"
        />
      ),
    },
    { field: 'comments', headerName: 'Comments', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpenDialog(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Submissions</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mr: 2 }}
            >
              Add Submission
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
              sx={{ mr: 2 }}
            >
              Import CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleImportCSV}
              />
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Consultant</InputLabel>
                  <Select
                    value={filters.consultant_id}
                    onChange={(e) => setFilters({ ...filters, consultant_id: e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    {consultants.map((consultant) => (
                      <MenuItem key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Recruiter"
                  value={filters.recruiter}
                  onChange={(e) => setFilters({ ...filters, recruiter: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Client/Job"
                  value={filters.client_or_job}
                  onChange={(e) => setFilters({ ...filters, client_or_job: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="From Date"
                  type="date"
                  value={filters.date_from ? filters.date_from.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value ? new Date(e.target.value) : null })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="To Date"
                  type="date"
                  value={filters.date_to ? filters.date_to.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value ? new Date(e.target.value) : null })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>

            <DataGrid
              rows={submissions}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
              slots={{ toolbar: GridToolbar }}
              disableRowSelectionOnClick
            />
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingSubmission ? 'Edit Submission' : 'Add New Submission'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Consultant</InputLabel>
                  <Select
                    value={formData.consultant_id}
                    onChange={(e) => setFormData({ ...formData, consultant_id: e.target.value })}
                    required
                  >
                    {consultants.map((consultant) => (
                      <MenuItem key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client/Job"
                  value={formData.client_or_job}
                  onChange={(e) => setFormData({ ...formData, client_or_job: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Recruiter"
                  value={formData.recruiter}
                  onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Submitted On"
                  type="date"
                  value={formData.submitted_on ? formData.submitted_on.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, submitted_on: e.target.value ? new Date(e.target.value) : new Date() })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Attachment Path"
                  value={formData.attachment_path}
                  onChange={(e) => setFormData({ ...formData, attachment_path: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  multiline
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingSubmission ? 'Update' : 'Create'}
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

export default Submissions;
