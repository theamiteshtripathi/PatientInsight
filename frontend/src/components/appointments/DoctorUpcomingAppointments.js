import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

function DoctorUpcomingAppointments() {
  // Mock data - replace with actual data
  const upcomingAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      time: '10:00 AM',
      date: '2024-03-20',
      type: 'Follow-up'
    },
    // Add more upcoming appointments...
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upcoming Appointments
      </Typography>
      <List>
        {upcomingAppointments.map((appointment, index) => (
          <React.Fragment key={appointment.id}>
            {index > 0 && <Divider />}
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={appointment.patientName}
                secondary={`${appointment.date} at ${appointment.time} - ${appointment.type}`}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default DoctorUpcomingAppointments; 