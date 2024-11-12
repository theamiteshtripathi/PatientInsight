import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

function ReportsDashboard({ searchQuery = '', filters = {} }) {
  const [reports] = useState([
    {
      id: 1,
      title: 'AI Consultation Summary',
      date: '2024-03-15',
      type: 'AI Generated',
      status: 'Pending Review',
      symptoms: ['Headache', 'Fever'],
      aiDiagnosis: 'Possible viral infection',
      doctorNotes: null
    },
    {
      id: 2,
      title: 'Follow-up Consultation',
      date: '2024-03-10',
      type: 'Doctor Reviewed',
      status: 'Completed',
      symptoms: ['Cough', 'Fatigue'],
      aiDiagnosis: 'Upper respiratory infection',
      doctorNotes: 'Prescribed antibiotics'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review': return 'warning';
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      default: return 'default';
    }
  };

  const handleDownload = (reportId) => {
    console.log('Downloading report:', reportId);
  };

  const handleShare = (reportId) => {
    console.log('Sharing report:', reportId);
  };

  const filteredReports = reports.filter(report => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        report.title.toLowerCase().includes(query) ||
        report.symptoms.some(symptom => 
          symptom.toLowerCase().includes(query)
        ) ||
        (report.aiDiagnosis && report.aiDiagnosis.toLowerCase().includes(query)) ||
        (report.doctorNotes && report.doctorNotes.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    if (filters.status !== 'all' && report.status.toLowerCase() !== filters.status) {
      return false;
    }

    if (filters.dateRange !== 'all') {
      const reportDate = new Date(report.date);
      const now = new Date();
      const diffTime = Math.abs(now - reportDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
        case 'year':
          if (diffDays > 365) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  return (
    <Grid container spacing={3}>
      {filteredReports.length === 0 ? (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No reports found matching your criteria
            </Typography>
          </Paper>
        </Grid>
      ) : (
        filteredReports.map((report) => (
          <Grid item xs={12} key={report.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{report.title}</Typography>
                <Chip
                  label={report.status}
                  color={getStatusColor(report.status)}
                  size="small"
                />
              </Box>
              
              <Typography color="textSecondary" gutterBottom>
                Date: {report.date}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Symptoms:</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {report.symptoms.map((symptom, index) => (
                    <Chip key={index} label={symptom} size="small" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">AI Diagnosis:</Typography>
                <Typography>{report.aiDiagnosis}</Typography>
              </Box>

              {report.doctorNotes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Doctor's Notes:</Typography>
                  <Typography>{report.doctorNotes}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(report.id)}
                  sx={{ mr: 1 }}
                >
                  Download
                </Button>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={() => handleShare(report.id)}
                >
                  Share
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default ReportsDashboard;