import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from '@mui/material';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3)
}));

function AppointmentsSchedule() {
  const [appointments] = useState([
    { id: 1, patient: 'John Doe', time: '09:00 AM', date: '2024-03-20', status: 'Scheduled' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', date: '2024-03-20', status: 'Confirmed' },
  ]);

  return (
    <Root>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Appointments Schedule
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledTableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="appointments table">
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patient}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                      >
                        Start Session
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>
      </Grid>
    </Root>
  );
}

export default AppointmentsSchedule; 