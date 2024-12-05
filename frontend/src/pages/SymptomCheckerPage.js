import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Chat as ChatIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import ChatInterfaceLLM from '../components/patient/ChatInterfaceLLM';

function SymptomCheckerPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Mock report data - in real app, fetch from backend
  const reports = [
    {
      id: 1,
      date: '2024-02-20',
      status: 'under_review',
      title: 'General Health Check',
      description: 'Initial health assessment report'
    },
    {
      id: 2,
      date: '2024-02-18',
      status: 'completed',
      title: 'Follow-up Consultation',
      description: 'Follow-up report for previous symptoms'
    }
  ];

  const getStatusChip = (status) => {
    const statusConfig = {
      under_review: { color: 'warning', label: 'Under Review', icon: <PendingIcon /> },
      completed: { color: 'success', label: 'Completed', icon: <CheckCircleIcon /> },
      appointment_needed: { color: 'error', label: 'Take Appointment', icon: <ScheduleIcon /> }
    };

    const config = statusConfig[status] || statusConfig.under_review;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const handleAppointmentSubmit = () => {
    if (appointmentDate) {
      setAppointments([
        ...appointments,
        {
          date: appointmentDate,
          title: 'Doctor Consultation',
          status: 'scheduled'
        }
      ]);
      setShowAppointment(false);
      setAppointmentDate(null);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Reports Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Generated Reports</Typography>
          <Grid container spacing={2}>
            {reports.map((report) => (
              <Grid item xs={12} key={report.id}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">{report.title}</Typography>
                    {getStatusChip(report.status)}
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    {report.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generated on: {new Date(report.date).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {report.status === 'completed' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ChatIcon />}
                        onClick={() => setShowChat(true)}
                      >
                        Talk to AI Agent
                      </Button>
                    )}
                    {report.status === 'appointment_needed' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CalendarIcon />}
                        onClick={() => setShowAppointment(true)}
                      >
                        Schedule Appointment
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Upcoming Appointments Section */}
        {appointments.length > 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Upcoming Appointments</Typography>
            <Grid container spacing={2}>
              {appointments.map((apt, index) => (
                <Grid item xs={12} key={index}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6">{apt.title}</Typography>
                    <Typography color="text.secondary">
                      {new Date(apt.date).toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Chat Dialog */}
        <Dialog
          open={showChat}
          onClose={() => setShowChat(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>AI Health Assistant</DialogTitle>
          <DialogContent sx={{ height: '60vh' }}>
            <ChatInterfaceLLM />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowChat(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Appointment Dialog */}
        <Dialog
          open={showAppointment}
          onClose={() => setShowAppointment(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Select Date and Time"
                value={appointmentDate}
                onChange={setAppointmentDate}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                minDate={new Date()}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAppointment(false)}>Cancel</Button>
            <Button onClick={handleAppointmentSubmit} variant="contained">
              Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
}

export default SymptomCheckerPage;