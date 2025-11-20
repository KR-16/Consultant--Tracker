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
    Menu,
    MenuItem,
    CircularProgress,
    Link
} from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

const SubmissionBoard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/submissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, submission) => {
        setAnchorEl(event.currentTarget);
        setSelectedSubmission(submission);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSubmission(null);
    };

    const handleStatusUpdate = async (status) => {
        if (!selectedSubmission) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/submissions/${selectedSubmission.id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchSubmissions();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            handleMenuClose();
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
            <Typography variant="h5" gutterBottom>Submissions</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Consultant</TableCell>
                            <TableCell>Job Title</TableCell>
                            <TableCell>Submitted On</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Resume</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submissions.map((sub) => (
                            <TableRow key={sub.id} sx={{ bgcolor: sub.recruiter_read ? 'inherit' : 'action.hover' }}>
                                <TableCell>{sub.consultant_name || 'Unknown'}</TableCell>
                                <TableCell>{sub.jd_title || 'Unknown Job'}</TableCell>
                                <TableCell>{format(new Date(sub.created_at), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={sub.status}
                                        color={getStatusColor(sub.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {/* In a real app, this would be a link to download/view the file */}
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        href="#" // Placeholder
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert(`Resume path: ${sub.resume_path}\n(File download not implemented in this demo)`);
                                        }}
                                    >
                                        View Resume
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, sub)}
                                        endIcon={<MoreIcon />}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleStatusUpdate('INTERVIEW')}>Move to Interview</MenuItem>
                <MenuItem onClick={() => handleStatusUpdate('OFFER')}>Make Offer</MenuItem>
                <MenuItem onClick={() => handleStatusUpdate('JOINED')}>Joined</MenuItem>
                <MenuItem onClick={() => handleStatusUpdate('REJECTED')}>Reject</MenuItem>
                <MenuItem onClick={() => handleStatusUpdate('ON_HOLD')}>On Hold</MenuItem>
            </Menu>
        </Box>
    );
};

export default SubmissionBoard;
