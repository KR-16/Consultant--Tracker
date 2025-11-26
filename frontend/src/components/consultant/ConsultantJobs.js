import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';

import api, { jobAPI } from '../../api';

const ConsultantJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [comments, setComments] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [mySubmissions, setMySubmissions] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchMySubmissions();
    }, []);

    const fetchJobs = async () => {
        try {
 
            const response = await jobAPI.getAll();
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMySubmissions = async () => {
        try {
    
            const response = await api.get('/submissions/me');
            setMySubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const hasApplied = (jobId) => {
        return mySubmissions.some(sub => sub.jd_id === jobId);
    };

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setApplyDialogOpen(true);
        setMessage({ type: '', text: '' });
        setResumeFile(null);
        setComments('');
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleApplySubmit = async () => {
        if (!resumeFile) {
            setMessage({ type: 'error', text: 'Please upload a resume' });
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('jd_id', selectedJob.id);
        formData.append('resume', resumeFile);
        if (comments) formData.append('comments', comments);

        try {
            await api.post('/submissions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            fetchMySubmissions(); 
            setTimeout(() => {
                setApplyDialogOpen(false);
            }, 1500);
        } catch (error) {
            console.error('Error submitting application:', error);
            setMessage({ type: 'error', text: 'Failed to submit application' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Open Positions</Typography>
            <Grid container spacing={3}>
                {jobs.map((job) => (
                    <Grid item xs={12} md={6} lg={4} key={job.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6" component="div">
                                        {job.title}
                                    </Typography>
                                    {hasApplied(job.id) && (
                                        <Chip label="Applied" color="success" size="small" />
                                    )}
                                </Box>
                                <Typography color="text.secondary" gutterBottom>
                                    {job.location} • {job.experience_required}+ Years
                                </Typography>
                                <Box mb={2}>
                                    {job.tech_required.map((tech) => (
                                        <Chip key={tech} label={tech} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Box>
                                <Typography variant="body2" paragraph>
                                    {job.description.substring(0, 150)}...
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleApplyClick(job)}
                                >
                                    {hasApplied(job.id) ? 'Apply Again' : 'Apply Now'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                <DialogContent>
                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 2, mt: 1 }}>
                            {message.text}
                        </Alert>
                    )}
                    {hasApplied(selectedJob?.id) && (
                        <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
                            You have already applied to this position. You can submit another application if you wish to update your resume.
                        </Alert>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Resume (PDF/DOC)</Typography>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{ marginBottom: '16px' }}
                        />
                        <TextField
                            fullWidth
                            label="Comments (Optional)"
                            multiline
                            rows={3}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleApplySubmit}
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ConsultantJobs;