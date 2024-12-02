import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  ViewList as ListView
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import AppointmentsList from '../components/appointments/AppointmentsList';
import UpcomingAppointments from '../components/appointments/UpcomingAppointments';
import AIRecommendations from '../components/appointments/AIRecommendations';
import NewAppointmentDialog from '../components/appointments/NewAppointmentDialog';

function AppointmentsPage() {
  const [viewMode, setViewMode] = useState('list');
  const [openNewAppointment, setOpenNewAppointment] = useState(false);

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5">
                  Appointments
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewAppointment(true)}
                    sx={{ mr: 2 }}
                  >
                    New Appointment
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('calendar')}
                    startIcon={<CalendarIcon />}
                    sx={{ mr: 1 }}
                  >
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('list')}
                    startIcon={<ListView />}
                  >
                    List
                  </Button>
                </Box>
              </Box>

              {/* View Content */}
              {viewMode === 'calendar' ? (
                <AppointmentCalendar />
              ) : (
                <AppointmentsList />
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <UpcomingAppointments />
            <AIRecommendations />
          </Grid>
        </Grid>

        {/* New Appointment Dialog */}
        <NewAppointmentDialog
          open={openNewAppointment}
          onClose={() => setOpenNewAppointment(false)}
        />
      </Container>
    </MainLayout>
  );
}

export default AppointmentsPage; 