import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

function AppointmentStats() {
  // Mock data - replace with actual data
  const stats = {
    todayTotal: 8,
    completed: 3,
    upcoming: 5
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">{stats.todayTotal}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Appointments
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
            <Box>
              <Typography variant="h6">{stats.completed}</Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1, color: 'warning.main' }} />
            <Box>
              <Typography variant="h6">{stats.upcoming}</Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AppointmentStats; 