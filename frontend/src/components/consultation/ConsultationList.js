import React, { useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  Collapse,
  Button,
  Rating,
  Dialog
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import ConsultationDetail from './ConsultationDetail';

function ConsultationList({ searchQuery, filters }) {
  const [expandedId, setExpandedId] = useState(null);
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
      aiQuestions: [
        { question: 'When did the symptoms start?', answer: 'Yesterday evening' },
        { question: 'Have you taken any medication?', answer: 'Only paracetamol' }
      ],
      recommendations: ['Rest', 'Stay hydrated', 'Monitor temperature'],
      doctorFeedback: null,
      rating: 4,
      followUpNeeded: true
    },
    // Add more consultation examples...
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review': return 'warning';
      case 'Completed': return 'success';
      case 'Follow-up Required': return 'error';
      default: return 'default';
    }
  };

  const handleConsultationClick = (consultation) => {
    setSelectedConsultation(consultation);
  };

  const handleRatingChange = (consultationId, newValue) => {
    // Update rating in your state management system
    console.log(`Rating updated for consultation ${consultationId}: ${newValue}`);
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        consultation.symptoms.some(s => s.toLowerCase().includes(query)) ||
        consultation.aiDiagnosis.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.type !== 'all' && consultation.type !== filters.type) return false;
    if (filters.severity !== 'all' && consultation.severity !== filters.severity) return false;
    if (filters.status !== 'all' && consultation.status !== filters.status) return false;

    return true;
  });

  return (
    <>
      <List>
        {filteredConsultations.map((consultation) => (
          <Paper 
            key={consultation.id} 
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <ListItem 
              button 
              onClick={() => handleConsultationClick(consultation)}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                      Consultation on {consultation.date}
                    </Typography>
                    <Chip
                      label={consultation.status}
                      color={getStatusColor(consultation.status)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {consultation.type}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                }
              />
            </ListItem>

            <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
              <Rating
                value={consultation.rating}
                onChange={(event, newValue) => 
                  handleRatingChange(consultation.id, newValue)
                }
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
                <Button
                  size="small"
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
                {consultation.followUpNeeded && (
                  <Button
                    size="small"
                    startIcon={<ScheduleIcon />}
                    color="primary"
                  >
                    Schedule Follow-up
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        ))}
      </List>

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
    </>
  );
}

export default ConsultationList; 