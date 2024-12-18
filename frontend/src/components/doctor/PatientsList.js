import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Paper
} from '@mui/material';

function PatientsList({ timeFilter }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [patientReports, setPatientReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [timeFilter]);

  const fetchPatients = async () => {
    try {

      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patients');

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleViewDetails = async (patientId) => {
    try {
      const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/${patientId}/details`);
      const data = await response.json();
      setSelectedPatient(data);
      setOpenDetails(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const handleViewSummary = async (patientId) => {
    try {
      const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/${patientId}/reports`);
      const data = await response.json();
      setPatientReports(data);
      setOpenSummary(true);
    } catch (error) {
      console.error('Error fetching patient reports:', error);
    }
  };

  const handleOpenReport = (reportId) => {
    setSelectedReportId(reportId);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Medical Condition</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{`${patient.first_name} ${patient.last_name}`}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.gender || 'N/A'}</TableCell>
                <TableCell>{patient.medical_conditions || 'None'}</TableCell>
                <TableCell>{patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'Never'}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleViewDetails(patient.id)}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => handleViewSummary(patient.id)}
                  >
                    View Summary
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Patient Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Personal Information</Typography>
                <Typography>Name: {`${selectedPatient.first_name} ${selectedPatient.last_name}`}</Typography>
                <Typography>Date of Birth: {selectedPatient.date_of_birth}</Typography>
                <Typography>Gender: {selectedPatient.gender}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Patient Reports Dialog */}
      <Dialog open={openSummary} onClose={() => setOpenSummary(false)} maxWidth="md" fullWidth>
        <DialogTitle>Patient Reports</DialogTitle>
        <DialogContent>
          {patientReports.map((report) => (
            <Paper key={report.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{report.report_name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Generated on: {new Date(report.created_at).toLocaleString()}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 1 }}
                onClick={() => handleOpenReport(report.id)}
              >
                View Report
              </Button>
            </Paper>
          ))}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!selectedReportId} onClose={() => setSelectedReportId(null)} maxWidth="lg" fullWidth>
        <DialogTitle>View Report</DialogTitle>
        <DialogContent>
          {selectedReportId && (
            <iframe
              src={`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/reports/view/${selectedReportId}`}
              width="100%"
              height="600px"
              title="PDF Viewer"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PatientsList;