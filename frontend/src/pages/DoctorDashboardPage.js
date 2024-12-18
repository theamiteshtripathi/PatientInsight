import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  styled,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  PeopleAlt,
  EventNote,
  Description,
  TrendingUp
} from '@mui/icons-material';
import PatientsList from '../components/doctor/PatientsList';
import MedicalReports from '../components/doctor/MedicalReports';
import DoctorSidebar from '../components/doctor/DoctorSidebar';

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: 16,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
}));

const StatsBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 2,
});

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FilterToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: '#fff',
  '& .MuiToggleButton-root': {
    padding: theme.spacing(1, 2),
    border: 'none',
    borderRadius: theme.spacing(2),
    margin: theme.spacing(0, 0.5),
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      }
    }
  }
}));

function DoctorDashboardPage() {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_appointments: 0,
    pending_reports: 0
  });
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DoctorSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
            Welcome back, Dr. Smith
          </Typography>
          
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} md={4}>
              <DashboardCard elevation={3}>
                <StatsBox>
                  <Box>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Total Patients
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {stats.total_patients}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUp fontSize="small" /> +5% this month
                    </Typography>
                  </Box>
                  <IconWrapper>
                    <PeopleAlt sx={{ fontSize: 40, color: 'primary.main' }} />
                  </IconWrapper>
                </StatsBox>
              </DashboardCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <DashboardCard elevation={3}>
                <StatsBox>
                  <Box>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Today's Appointments
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {stats.total_appointments}
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                      Next appointment in 30 mins
                    </Typography>
                  </Box>
                  <IconWrapper>
                    <EventNote sx={{ fontSize: 40, color: 'primary.main' }} />
                  </IconWrapper>
                </StatsBox>
              </DashboardCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <DashboardCard elevation={3}>
                <StatsBox>
                  <Box>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Pending Reports
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {stats.pending_reports}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Requires attention
                    </Typography>
                  </Box>
                  <IconWrapper>
                    <Description sx={{ fontSize: 40, color: 'primary.main' }} />
                  </IconWrapper>
                </StatsBox>
              </DashboardCard>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
                }}
              >
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    Patients List
                  </Typography>
                  <FilterToggleGroup
                    value={timeFilter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="report timeframe"
                    size="small"
                  >
                    <ToggleButton value="all">
                      All
                    </ToggleButton>
                    <ToggleButton value="24h">
                      Last 24h
                    </ToggleButton>
                    <ToggleButton value="week">
                      Last Week
                    </ToggleButton>
                    <ToggleButton value="month">
                      Last Month
                    </ToggleButton>
                  </FilterToggleGroup>
                </Box>
                <PatientsList timeFilter={timeFilter} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
                }}
              >
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
                }}
              >
                <MedicalReports />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default DoctorDashboardPage;