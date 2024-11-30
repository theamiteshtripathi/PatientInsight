import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  VideoCall as VideoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

function NewAppointmentDialog({ open, onClose }) {
  const [appointmentData, setAppointmentData] = useState({
    date: dayjs(),
    time: dayjs(),
    type: 'in-person',
    specialty: '',
    doctor: '',
    reason: '',
    symptoms: '',
    notes: ''
  });

  const specialties = [
    'Cardiology',
    'Dermatology',
    'General Practice',
    'Neurology',
    'Orthopedics',
    'Pediatrics'
  ];

  const doctors = [
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Johnson', specialty: 'Dermatology' },
    { id: 3, name: 'Dr. Williams', specialty: 'General Practice' }
  ];

  const handleChange = (field) => (event) => {
    setAppointmentData({
      ...appointmentData,
      [field]: event.target.value
    });
  };

  const handleSubmit = () => {
    // Handle appointment submission
    console.log('Appointment Data:', appointmentData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Schedule New Appointment</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Appointment Type */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Appointment Type
              </Typography>
              <RadioGroup
                row
                value={appointmentData.type}
                onChange={handleChange('type')}
              >
                <FormControlLabel
                  value="in-person"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      In-Person
                    </Box>
                  }
                />
                <FormControlLabel
                  value="virtual"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VideoIcon sx={{ mr: 1 }} />
                      Virtual
                    </Box>
                  }
                />
              </RadioGroup>
            </Grid>

            {/* Date and Time */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={appointmentData.date}
                  onChange={(newValue) => {
                    setAppointmentData({
                      ...appointmentData,
                      date: newValue
                    });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Time"
                  value={appointmentData.time}
                  onChange={(newValue) => {
                    setAppointmentData({
                      ...appointmentData,
                      time: newValue
                    });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Specialty and Doctor */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={appointmentData.specialty}
                  onChange={handleChange('specialty')}
                  label="Specialty"
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={appointmentData.doctor}
                  onChange={handleChange('doctor')}
                  label="Doctor"
                >
                  {doctors
                    .filter(doc => !appointmentData.specialty || doc.specialty === appointmentData.specialty)
                    .map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Reason and Symptoms */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Visit"
                value={appointmentData.reason}
                onChange={handleChange('reason')}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Symptoms (if any)"
                value={appointmentData.symptoms}
                onChange={handleChange('symptoms')}
                multiline
                rows={2}
              />
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                value={appointmentData.notes}
                onChange={handleChange('notes')}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained"
          onClick={handleSubmit}
        >
          Schedule Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewAppointmentDialog; 