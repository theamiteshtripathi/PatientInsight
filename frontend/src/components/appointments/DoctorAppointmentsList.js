import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

function DoctorAppointmentsList({ searchQuery, dateFilter }) {
  // Mock data - replace with actual data from your backend
  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'Scheduled',
      age: 45,
      condition: 'Hypertension'
    },
    // Add more mock appointments...
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Name</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>
                {appointment.date} <br />
                {appointment.time}
              </TableCell>
              <TableCell>{appointment.type}</TableCell>
              <TableCell>
                <Chip 
                  label={appointment.status}
                  color={getStatusColor(appointment.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                Age: {appointment.age}<br />
                Condition: {appointment.condition}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DoctorAppointmentsList; 