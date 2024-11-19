import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  styled,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PeopleAlt,
  EventNote,
  Description,
  TrendingUp
} from '@mui/icons-material';
import PatientsList from '../components/doctor/PatientsList';
import AppointmentsSchedule from '../components/doctor/AppointmentsSchedule';
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

function DoctorDashboardPage() {
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
                      120
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
                      8
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
                      5
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
                <PatientsList />
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
                <AppointmentsSchedule />
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
