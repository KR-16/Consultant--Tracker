import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import ConsultantProfile from './ConsultantProfile';
import ConsultantJobs from './ConsultantJobs';
import ConsultantApplications from './ConsultantApplications';

const ConsultantDashboard = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Consultant Dashboard</Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Open Jobs" />
                    <Tab label="My Applications" />
                    <Tab label="My Profile" />
                </Tabs>
            </Box>

            <Box role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && <ConsultantJobs />}
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && <ConsultantApplications />}
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && <ConsultantProfile />}
            </Box>
        </Container>
    );
};

export default ConsultantDashboard;

