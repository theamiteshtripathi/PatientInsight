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
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  }
}));

function PatientsList() {
  const classes = useStyles();
  const [patients] = useState([
    { id: 1, name: 'John Doe', age: 45, condition: 'Diabetes', lastVisit: '2024-03-15' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Hypertension', lastVisit: '2024-03-14' },
  ]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
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
                  className={classes.actionButton}
                >
                  View Details
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary"
                >
                  Schedule
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PatientsList;
