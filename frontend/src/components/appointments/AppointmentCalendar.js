import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Popover,
  Card,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  VideoCall as VideoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    {
      id: 1,
      date: dayjs(),
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      type: 'virtual',
      status: 'confirmed',
      notes: 'Follow-up consultation'
    },
    // Add more appointments...
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (event, appointment) => {
    setSelectedAppointment(appointment);
    setAnchorEl(event.currentTarget);
  };

  const getAppointmentColor = (status) => {
    const colors = {
      confirmed: 'success',
      pending: 'warning',
      urgent: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateClick}
          renderDay={(day, selected, dayProps) => {
            const hasAppointment = appointments.some(
              apt => dayjs(apt.date).isSame(day, 'day')
            );
            
            return (
              <Box
                sx={{
                  position: 'relative',
                  '&::after': hasAppointment ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main'
                  } : {}
                }}
                {...dayProps}
              >
                {day.date()}
              </Box>
            );
          }}
        />

        {/* Appointments for selected date */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Appointments for {selectedDate.format('MMMM D, YYYY')}
          </Typography>
          {appointments
            .filter(apt => dayjs(apt.date).isSame(selectedDate, 'day'))
            .map(appointment => (
              <Card 
                key={appointment.id}
                sx={{ mb: 2, cursor: 'pointer' }}
                onClick={(e) => handleAppointmentClick(e, appointment)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {appointment.time}
                    </Typography>
                    <Chip
                      icon={appointment.type === 'virtual' ? <VideoIcon /> : <PersonIcon />}
                      label={appointment.type}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.doctor}
                  </Typography>
                  <Chip
                    label={appointment.status}
                    size="small"
                    color={getAppointmentColor(appointment.status)}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            ))}
        </Box>

        {/* Appointment Details Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {selectedAppointment && (
            <Box sx={{ p: 2, maxWidth: 300 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              <Typography variant="body2" paragraph>
                Time: {selectedAppointment.time}
              </Typography>
              <Typography variant="body2" paragraph>
                Doctor: {selectedAppointment.doctor}
              </Typography>
              <Typography variant="body2" paragraph>
                Notes: {selectedAppointment.notes}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  Reschedule
                </Button>
              </Box>
            </Box>
          )}
        </Popover>
      </Box>
    </LocalizationProvider>
  );
}

export default AppointmentCalendar; 