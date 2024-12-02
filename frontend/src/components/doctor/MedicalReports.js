import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  styled
} from '@mui/material';

const StyledContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3)
}));

function MedicalReports() {
  const [reports] = useState([
    { id: 1, patientName: 'John Doe', type: 'Blood Test', date: '2024-03-15', status: 'Completed' },
    { id: 2, patientName: 'Jane Smith', type: 'X-Ray', date: '2024-03-14', status: 'Pending' },
  ]);

  return (
    <StyledContainer container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" gutterBottom>
            Recent Medical Reports
          </Typography>
          <StyledTableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="medical reports table">
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.patientName}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      </Grid>
    </StyledContainer>
  );
}

export default MedicalReports;
