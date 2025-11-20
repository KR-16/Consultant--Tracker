import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import ConsultantList from './ConsultantList';
import JobManager from './JobManager';
import SubmissionBoard from './SubmissionBoard';

const RecruiterDashboard = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Recruiter Dashboard</Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Submissions" />
                    <Tab label="Job Descriptions" />
                    <Tab label="Consultants" />
                </Tabs>
            </Box>

            <Box role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && <SubmissionBoard />}
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && <JobManager />}
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && <ConsultantList />}
            </Box>
        </Container>
    );
};

export default RecruiterDashboard;
