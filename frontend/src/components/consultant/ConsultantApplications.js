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
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const ConsultantApplications = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/submissions/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'default';
            case 'INTERVIEW': return 'info';
            case 'OFFER': return 'success';
            case 'JOINED': return 'success';
            case 'REJECTED': return 'error';
            case 'WITHDRAWN': return 'warning';
            default: return 'default';
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>My Applications</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Job Title</TableCell>
                            <TableCell>Submitted On</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Comments</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submissions.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell>{sub.jd_title || 'Unknown Job'}</TableCell>
                                <TableCell>{format(new Date(sub.created_at), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={sub.status}
                                        color={getStatusColor(sub.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{sub.comments || '-'}</TableCell>
                            </TableRow>
                        ))}
                        {submissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ConsultantApplications;
