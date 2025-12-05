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
// --- FIX 1: Import the helper, NOT axios ---
import { consultantAPI } from '../../api';

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
            // --- FIX 2: Use consultantAPI.getAll() ---
            // This handles the Token and the URL automatically
            const response = await consultantAPI.getAll();
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
                        {consultants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No consultants found. Consultants will appear here once they create their profiles.
                                </TableCell>
                            </TableRow>
                        ) : (
                            consultants.map((consultant) => (
                                <TableRow key={consultant.id}>
                                    <TableCell>{consultant.name || 'N/A'}</TableCell>
                                    <TableCell>{consultant.experience_years || 0} Years</TableCell>
                                    <TableCell>
                                        {/* Safety check in case tech_stack is null */}
                                        {consultant.tech_stack && consultant.tech_stack.length > 0 ? (
                                            <>
                                                {consultant.tech_stack.slice(0, 3).map(tech => (
                                                    <Chip key={tech} label={tech} size="small" sx={{ mr: 0.5 }} />
                                                ))}
                                                {consultant.tech_stack.length > 3 && `+${consultant.tech_stack.length - 3}`}
                                            </>
                                        ) : (
                                            '-'
                                        )}
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
                                        <Button size="small" variant="outlined" onClick={() => handleViewDetails(consultant)}>
                                            View Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Consultant Profile: {selectedConsultant?.name || 'N/A'}</DialogTitle>
                <DialogContent dividers>
                    {selectedConsultant && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                <Typography variant="body1">{selectedConsultant.email || '-'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1">{selectedConsultant.phone || '-'}</Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Professional Details</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                                <Typography variant="body1">{selectedConsultant.experience_years || 0} Years</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
                                <Chip
                                    label={selectedConsultant.available ? 'Available' : 'Unavailable'}
                                    color={selectedConsultant.available ? 'success' : 'default'}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                                <Typography variant="body1">{selectedConsultant.location || '-'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">Visa Status</Typography>
                                <Typography variant="body1">{selectedConsultant.visa_status || '-'}</Typography>
                            </Grid>
                            {selectedConsultant.rating && (
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Rating</Typography>
                                    <Typography variant="body1">{selectedConsultant.rating}/5.0</Typography>
                                </Grid>
                            )}
                            
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Technical Skills</Typography>
                                <Box sx={{ mt: 1 }}>
                                    {selectedConsultant.tech_stack && selectedConsultant.tech_stack.length > 0 ? (
                                        selectedConsultant.tech_stack.map(tech => (
                                            <Chip key={tech} label={tech} sx={{ mr: 0.5, mb: 0.5 }} />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No skills listed</Typography>
                                    )}
                                </Box>
                            </Grid>
                            
                            {selectedConsultant.notes && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Notes</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        {selectedConsultant.notes}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)} variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ConsultantList;