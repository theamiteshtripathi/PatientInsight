import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
  Paper,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  EventNote as EventNoteIcon,
  Description as SummaryIcon,
} from '@mui/icons-material';
import PatientsList from '../components/doctor/PatientsList';
import AppointmentsSchedule from '../components/doctor/AppointmentsSchedule';
import MedicalReports from '../components/doctor/MedicalReports';
import ChatInterface from '../components/patient/ChatInterface';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%'
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function DoctorDashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const { loading, error } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <StyledContainer>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Doctor Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <DashboardCard elevation={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total Patients
            </Typography>
            {/* Add your content */}
          </DashboardCard>
        </Grid>

        {/* Quick Actions */}
      </Grid>
    </StyledContainer>
  );
}

export default DoctorDashboardPage;
