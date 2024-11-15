import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Container,
  Grid,
  Button,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

function ReportView() {
  const [reports] = useState([
    {
      id: 1,
      title: 'Blood Test Report',
      date: '2024-03-15',
      type: 'Laboratory',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'X-Ray Report',
      date: '2024-03-20',
      type: 'Radiology',
      status: 'Pending Review'
    }
  ]);

  const handleUploadReport = () => {
    // Implement report upload logic
    console.log('Upload new report');
  };

  const handleViewReport = (reportId) => {
    // Implement view report logic
    console.log('Viewing report:', reportId);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Medical Report
      </Typography>
      
      <StyledPaper elevation={3}>
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} key={report.id}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">{report.title}</Typography>
                <Typography color="textSecondary">
                  Date: {report.date}
                </Typography>
                <Typography color="textSecondary">
                  Type: {report.type}
                </Typography>
                <Typography color="textSecondary">
                  Status: {report.status}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  onClick={() => handleViewReport(report.id)}
                  style={{ marginTop: '8px' }}
                >
                  View Report
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadReport}
      >
        Upload New Report
      </Button>
    </StyledContainer>
  );
}

export default ReportView;
