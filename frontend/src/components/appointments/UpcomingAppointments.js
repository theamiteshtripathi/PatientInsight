import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  VideoCall as VideoIcon,
  Person as PersonIcon,
  NavigateNext as NextIcon,
  Schedule as ClockIcon
} from '@mui/icons-material';

function UpcomingAppointments() {
  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-03-20',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      type: 'virtual',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-03-22',
      time: '2:30 PM',
      doctor: 'Dr. Johnson',
      type: 'in-person',
      status: 'pending'
    }
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Upcoming Appointments
        </Typography>
        <Button size="small" endIcon={<NextIcon />}>
          View All
        </Button>
      </Box>

      <List>
        {upcomingAppointments.map((appointment, index) => (
          <React.Fragment key={appointment.id}>
            <ListItem>
              <ListItemIcon>
                {appointment.type === 'virtual' ? (
                  <VideoIcon color="primary" />
                ) : (
                  <PersonIcon color="primary" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={appointment.doctor}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClockIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {appointment.date} at {appointment.time}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={appointment.status}
                  size="small"
                  color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {index < upcomingAppointments.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      {upcomingAppointments.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="text.secondary">
            No upcoming appointments
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Schedule Now
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default UpcomingAppointments; 