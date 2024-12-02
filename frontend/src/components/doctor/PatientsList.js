import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

function PatientsList() {
  const [patients] = useState([
    { id: 1, name: 'John Doe', age: 45, condition: 'Diabetes', lastVisit: '2024-03-15' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Hypertension', lastVisit: '2024-03-14' },
  ]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Patients List
      </Typography>
      
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="patients table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                  >
                    View Summary
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </div>
  );
}

export default PatientsList;
