import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const ConsultantList = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchConsultants();
    }, []);

    const fetchConsultants = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/consultants', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConsultants(response.data);
        } catch (error) {
            console.error('Error fetching consultants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (consultant) => {
        setSelectedConsultant(consultant);
        setDetailsOpen(true);
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Consultants</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Tech Stack</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Availability</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consultants.map((consultant) => (
                            <TableRow key={consultant.id}>
                                <TableCell>{consultant.name || 'N/A'}</TableCell>
                                <TableCell>{consultant.experience_years} Years</TableCell>
                                <TableCell>
                                    {consultant.tech_stack.slice(0, 3).map(tech => (
                                        <Chip key={tech} label={tech} size="small" sx={{ mr: 0.5 }} />
                                    ))}
                                    {consultant.tech_stack.length > 3 && `+${consultant.tech_stack.length - 3}`}
                                </TableCell>
                                <TableCell>{consultant.location || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={consultant.available ? 'Available' : 'Unavailable'}
                                        color={consultant.available ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => handleViewDetails(consultant)}>
                                        View Profile
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Consultant Profile: {selectedConsultant?.name}</DialogTitle>
                <DialogContent dividers>
                    {selectedConsultant && (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">Contact Info</Typography>
                                <Typography variant="body2">Email: {selectedConsultant.email}</Typography>
                                <Typography variant="body2">Phone: {selectedConsultant.phone || '-'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">Status</Typography>
                                <Typography variant="body2">Visa: {selectedConsultant.visa_status || '-'}</Typography>
                                <Typography variant="body2">Location: {selectedConsultant.location || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">Skills</Typography>
                                <Box sx={{ mt: 1 }}>
                                    {selectedConsultant.tech_stack.map(tech => (
                                        <Chip key={tech} label={tech} sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">Notes</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedConsultant.notes || '-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ConsultantList;
