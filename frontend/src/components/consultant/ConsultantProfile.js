import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    FormControlLabel,
    Switch,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const ConsultantProfile = () => {
    const [profile, setProfile] = useState({
        experience_years: 0,
        tech_stack: [],
        available: true,
        location: '',
        visa_status: '',
        notes: '',
        email: '',
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [techInput, setTechInput] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/consultants/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (e) => {
        setProfile(prev => ({ ...prev, available: e.target.checked }));
    };

    const handleTechAdd = (e) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!profile.tech_stack.includes(techInput.trim())) {
                setProfile(prev => ({
                    ...prev,
                    tech_stack: [...prev.tech_stack, techInput.trim()]
                }));
            }
            setTechInput('');
        }
    };

    const handleTechDelete = (techToDelete) => {
        setProfile(prev => ({
            ...prev,
            tech_stack: prev.tech_stack.filter(tech => tech !== techToDelete)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/consultants/me', {
                experience_years: Number(profile.experience_years),
                tech_stack: profile.tech_stack,
                available: profile.available,
                location: profile.location,
                visa_status: profile.visa_status,
                notes: profile.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 3 }}>
            <Typography variant="h5" gutterBottom>My Profile</Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={profile.name || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={profile.email || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={profile.phone || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Experience (Years)"
                            name="experience_years"
                            type="number"
                            value={profile.experience_years}
                            onChange={handleChange}
                            inputProps={{ min: 0, step: 0.5 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={profile.location || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Visa Status"
                            name="visa_status"
                            value={profile.visa_status || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>Tech Stack (Press Enter to add)</Typography>
                        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {profile.tech_stack.map((tech) => (
                                <Chip
                                    key={tech}
                                    label={tech}
                                    onDelete={() => handleTechDelete(tech)}
                                />
                            ))}
                        </Box>
                        <TextField
                            fullWidth
                            placeholder="Add skill..."
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechAdd}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={profile.available}
                                    onChange={handleSwitchChange}
                                    color="primary"
                                />
                            }
                            label="Available for new projects"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            multiline
                            rows={4}
                            value={profile.notes || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default ConsultantProfile;
