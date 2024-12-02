import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import DoctorLayout from '../components/layout/DoctorLayout';
import DoctorAppointmentsList from '../components/appointments/DoctorAppointmentsList';
import DoctorUpcomingAppointments from '../components/appointments/DoctorUpcomingAppointments';
import AppointmentStats from '../components/appointments/AppointmentStats';
import NewAppointmentDialog from '../components/appointments/NewAppointmentDialog';

function DoctorAppointmentsPage() {
  const [openNewAppointment, setOpenNewAppointment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  return (
    <DoctorLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header with Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <AppointmentStats />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5">
                  Appointments
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNewAppointment(true)}
                >
                  New Appointment
                </Button>
              </Box>

              {/* Search and Filter */}
              <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="date"
                  variant="outlined"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{ width: '200px' }}
                />
              </Box>

              {/* Appointments List */}
              <DoctorAppointmentsList 
                searchQuery={searchQuery}
                dateFilter={dateFilter}
              />
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <DoctorUpcomingAppointments />
          </Grid>
        </Grid>

        {/* New Appointment Dialog */}
        <NewAppointmentDialog
          open={openNewAppointment}
          onClose={() => setOpenNewAppointment(false)}
        />
      </Container>
    </DoctorLayout>
  );
}

export default DoctorAppointmentsPage; 