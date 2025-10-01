import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
// Date picker imports removed as they're not used
import { Download as DownloadIcon } from '@mui/icons-material';
import { reportsAPI, consultantAPI } from '../api';

const Reports = ({ searchQuery }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    consultant_id: '',
    recruiter: '',
    client_or_job: '',
    date_from: null,
    date_to: null,
  });
  const [consultants, setConsultants] = useState([]);

  // COLORS constant removed as it's not used

  useEffect(() => {
    fetchConsultants();
    fetchDashboardData();
  }, [filters]);

  const fetchConsultants = async () => {
    try {
      const response = await consultantAPI.getAll();
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (searchQuery) {
        params.client_or_job = searchQuery;
      }
      const response = await reportsAPI.getDashboard(params);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      // This would export the current filtered data
      console.log('Export CSV with filters:', filters);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'SUBMITTED': '#1976d2',
      'INTERVIEW': '#ed6c02',
      'OFFER': '#2e7d32',
      'JOINED': '#4caf50',
      'REJECTED': '#d32f2f',
      'ON_HOLD': '#9c27b0',
      'WITHDRAWN': '#757575',
    };
    return colorMap[status] || '#1976d2';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading reports...</Typography>
      </Box>
    );
  }

  return (
    <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Reports & Analytics</Typography>
        
        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Consultant</InputLabel>
                  <Select
                    value={filters.consultant_id}
                    onChange={(e) => setFilters({ ...filters, consultant_id: e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    {consultants.map((consultant) => (
                      <MenuItem key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Recruiter"
                  value={filters.recruiter}
                  onChange={(e) => setFilters({ ...filters, recruiter: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Client/Job"
                  value={filters.client_or_job}
                  onChange={(e) => setFilters({ ...filters, client_or_job: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="From Date"
                  type="date"
                  value={filters.date_from ? filters.date_from.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value ? new Date(e.target.value) : null })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="To Date"
                  type="date"
                  value={filters.date_to ? filters.date_to.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value ? new Date(e.target.value) : null })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportCSV}
                  fullWidth
                >
                  Export CSV
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {dashboardData && (
          <Grid container spacing={3}>
            {/* Submissions by Status */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Submissions by Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.status_report}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {dashboardData.status_report.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Submissions by Tech */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Submissions by Tech Stack
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.tech_report.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tech" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Pipeline Funnel */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pipeline Funnel
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.funnel_report}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Recruiter Productivity */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recruiter Productivity
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Recruiter</TableCell>
                          <TableCell align="right">Submissions</TableCell>
                          <TableCell align="right">Interviews</TableCell>
                          <TableCell align="right">Offers</TableCell>
                          <TableCell align="right">Joined</TableCell>
                          <TableCell align="right">Win Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.recruiter_report.map((recruiter) => (
                          <TableRow key={recruiter.recruiter}>
                            <TableCell>{recruiter.recruiter}</TableCell>
                            <TableCell align="right">{recruiter.total_submissions}</TableCell>
                            <TableCell align="right">{recruiter.interviews}</TableCell>
                            <TableCell align="right">{recruiter.offers}</TableCell>
                            <TableCell align="right">{recruiter.joined}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`${recruiter.win_rate}%`} 
                                color={recruiter.win_rate > 20 ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Time to Stage */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Time Between Stages
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>From Stage</TableCell>
                          <TableCell>To Stage</TableCell>
                          <TableCell align="right">Average Days</TableCell>
                          <TableCell align="right">Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.time_to_stage_report.map((stage, index) => (
                          <TableRow key={index}>
                            <TableCell>{stage.from_stage}</TableCell>
                            <TableCell>{stage.to_stage}</TableCell>
                            <TableCell align="right">{stage.avg_days}</TableCell>
                            <TableCell align="right">{stage.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
  );
};

export default Reports;
