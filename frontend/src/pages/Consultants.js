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
import { consultantAPI } from '../api';

const Consultants = ({ searchQuery }) => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    experience_years: 0,
    tech_stack: [],
    available: true,
    location: '',
    visa_status: 'OTHER',
    rating: 'AVERAGE',
    email: '',
    phone: '',
    notes: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    tech_stack: [],
    available: null,
    location: '',
    visa_status: '',
    rating: '',
    experience_min: null,
    experience_max: null,
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
      showSnackbar('Error fetching consultants', 'error');
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

  const handleOpenDialog = (consultant = null) => {
    if (consultant) {
      setEditingConsultant(consultant);
      setFormData({
        name: consultant.name,
        experience_years: consultant.experience_years,
        tech_stack: consultant.tech_stack,
        available: consultant.available,
        location: consultant.location,
        visa_status: consultant.visa_status,
        rating: consultant.rating,
        email: consultant.email,
        phone: consultant.phone,
        notes: consultant.notes || '',
      });
    } else {
      setEditingConsultant(null);
      setFormData({
        name: '',
        experience_years: 0,
        tech_stack: [],
        available: true,
        location: '',
        visa_status: 'OTHER',
        rating: 'AVERAGE',
        email: '',
        phone: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingConsultant(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingConsultant) {
        await consultantAPI.update(editingConsultant.id, formData);
        showSnackbar('Consultant updated successfully');
      } else {
        await consultantAPI.create(formData);
        showSnackbar('Consultant created successfully');
      }
      handleCloseDialog();
      fetchConsultants();
    } catch (error) {
      showSnackbar('Error saving consultant', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultant?')) {
      try {
        await consultantAPI.delete(id);
        showSnackbar('Consultant deleted successfully');
        fetchConsultants();
      } catch (error) {
        showSnackbar('Error deleting consultant', 'error');
      }
    }
  };

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await consultantAPI.importCSV(file);
        showSnackbar(`Successfully imported ${response.data.imported_count} consultants`);
        fetchConsultants();
      } catch (error) {
        showSnackbar('Error importing CSV', 'error');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await consultantAPI.exportCSV();
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

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'experience_years', headerName: 'Experience', width: 100 },
    { 
      field: 'tech_stack', 
      headerName: 'Tech Stack', 
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.value.map((tech, index) => (
            <Chip key={index} label={tech} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
      ),
    },
    { field: 'location', headerName: 'Location', width: 120 },
    { field: 'visa_status', headerName: 'Visa Status', width: 120 },
    { field: 'rating', headerName: 'Rating', width: 100 },
    { 
      field: 'available', 
      headerName: 'Available', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Yes' : 'No'} 
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
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
          <Typography variant="h4">Consultants</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mr: 2 }}
            >
              Add Consultant
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
                <FormControl fullWidth size="small">
                  <InputLabel>Available</InputLabel>
                  <Select
                    value={filters.available === null ? '' : filters.available}
                    onChange={(e) => setFilters({ ...filters, available: e.target.value === '' ? null : e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
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

            <DataGrid
              rows={consultants}
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
            {editingConsultant ? 'Edit Consultant' : 'Add New Consultant'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (Years)"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Visa Status</InputLabel>
                  <Select
                    value={formData.visa_status}
                    onChange={(e) => setFormData({ ...formData, visa_status: e.target.value })}
                  >
                    {visaStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  >
                    {ratingOptions.map((rating) => (
                      <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tech Stack</InputLabel>
                  <Select
                    multiple
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingConsultant ? 'Update' : 'Create'}
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

export default Consultants;
