import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
// --- FIX 1: Import the centralized API helper ---
import api, { jobAPI } from '../../api';

const JobManager = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        experience_required: 0,
        tech_required: '',
        location: '',
        visa_required: '',
        status: 'OPEN'
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            // --- FIX 2: Use jobAPI (Token is handled automatically) ---
            const response = await jobAPI.getAll();
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (job = null) => {
        if (job) {
            setEditingJob(job);
            setFormData({
                title: job.title,
                description: job.description,
                experience_required: job.experience_required,
                tech_required: job.tech_required ? job.tech_required.join(', ') : '',
                location: job.location || '',
                visa_required: job.visa_required || '',
                status: job.status
            });
        } else {
            setEditingJob(null);
            setFormData({
                title: '',
                description: '',
                experience_required: 0,
                tech_required: '',
                location: '',
                visa_required: '',
                status: 'OPEN'
            });
        }
        setMessage({ type: '', text: '' });
        setDialogOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Prepare payload
            const payload = {
                ...formData,
                experience_required: Number(formData.experience_required),
                tech_required: formData.tech_required.split(',').map(t => t.trim()).filter(t => t)
            };

            // --- FIX 3: Use api helpers instead of axios ---
            if (editingJob) {
                // Update existing job
                await api.put(`/jobs/${editingJob.id}`, payload);
            } else {
                // Create new job (Uses jobAPI.create to ensure trailing slash)
                await jobAPI.create(payload);
            }

            setMessage({ type: 'success', text: `Job ${editingJob ? 'updated' : 'created'} successfully` });
            fetchJobs();
            setTimeout(() => setDialogOpen(false), 1000);
        } catch (error) {
            console.error('Error saving job:', error);
            setMessage({ type: 'error', text: 'Failed to save job' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Job Descriptions</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Create New JD
                </Button>
            </Box>

            <Grid container spacing={3}>
                {jobs.map((job) => (
                    <Grid item xs={12} md={6} key={job.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6">{job.title}</Typography>
                                    <Chip
                                        label={job.status}
                                        color={job.status === 'OPEN' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                                <Typography color="text.secondary" gutterBottom>
                                    {job.location} • {job.experience_required}+ Years
                                </Typography>
                                <Box mb={2}>
                                    {job.tech_required && job.tech_required.map((tech) => (
                                        <Chip key={tech} label={tech} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {job.description.substring(0, 100)}...
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpenDialog(job)}>Edit</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingJob ? 'Edit Job Description' : 'Create New Job Description'}</DialogTitle>
                <DialogContent>
                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 2, mt: 1 }}>
                            {message.text}
                        </Alert>
                    )}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    label="Status"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="OPEN">OPEN</MenuItem>
                                    <MenuItem value="CLOSED">CLOSED</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Experience Required (Years)"
                                name="experience_required"
                                type="number"
                                value={formData.experience_required}
                                onChange={handleChange}
                                inputProps={{ min: 0, step: 0.5 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tech Stack (comma separated)"
                                name="tech_required"
                                value={formData.tech_required}
                                onChange={handleChange}
                                placeholder="React, Python, AWS"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Visa Requirements"
                                name="visa_required"
                                value={formData.visa_required}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Job'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JobManager;