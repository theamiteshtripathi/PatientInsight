import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Dialog,
  IconButton
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  LocalHospital as MedicalIcon,
  Chat as ChatIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import ConsultationDetail from './ConsultationDetail';

function ConsultationTimeline({ searchQuery, filters }) {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [consultations] = useState([
    {
      id: 1,
      date: '2024-03-15',
      type: 'AI',
      status: 'Pending Review',
      severity: 'moderate',
      symptoms: ['Headache', 'Fever'],
      aiDiagnosis: 'Possible viral infection',
      icon: <ChatIcon />,
      color: 'primary'
    },
    {
      id: 2,
      date: '2024-03-16',
      type: 'Doctor',
      status: 'Completed',
      severity: 'moderate',
      symptoms: ['Headache', 'Fever'],
      diagnosis: 'Viral infection confirmed',
      icon: <MedicalIcon />,
      color: 'success'
    },
    // Add more consultation examples...
  ]);

  const getTimelineDotColor = (status, severity) => {
    if (severity === 'severe') return 'error';
    switch (status) {
      case 'Pending Review': return 'warning';
      case 'Completed': return 'success';
      case 'Follow-up Required': return 'info';
      default: return 'grey';
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return consultation.symptoms.some(s => s.toLowerCase().includes(query)) ||
             consultation.aiDiagnosis?.toLowerCase().includes(query) ||
             consultation.diagnosis?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Consultation Timeline
      </Typography>

      <Timeline position="alternate">
        {filteredConsultations.map((consultation) => (
          <TimelineItem key={consultation.id}>
            <TimelineOppositeContent color="text.secondary">
              {consultation.date}
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot color={getTimelineDotColor(consultation.status, consultation.severity)}>
                {consultation.icon}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            
            <TimelineContent>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setSelectedConsultation(consultation)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    {consultation.type} Consultation
                  </Typography>
                  <IconButton size="small">
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={consultation.status}
                    size="small"
                    color={getTimelineDotColor(consultation.status, consultation.severity)}
                  />
                  {consultation.severity === 'severe' && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Severe"
                      size="small"
                      color="error"
                    />
                  )}
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Symptoms:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {consultation.symptoms.map((symptom, index) => (
                      <Chip
                        key={index}
                        label={symptom}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {consultation.aiDiagnosis || consultation.diagnosis}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      <Dialog
        open={Boolean(selectedConsultation)}
        onClose={() => setSelectedConsultation(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedConsultation && (
          <ConsultationDetail
            consultation={selectedConsultation}
            onClose={() => setSelectedConsultation(null)}
          />
        )}
      </Dialog>
    </Paper>
  );
}

export default ConsultationTimeline; 