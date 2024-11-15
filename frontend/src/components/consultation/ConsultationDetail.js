import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Alert
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

function ConsultationDetail({ consultation, onClose }) {
  const {
    date,
    type,
    status,
    severity,
    symptoms,
    aiDiagnosis,
    aiQuestions,
    recommendations,
    doctorFeedback,
    followUpNeeded
  } = consultation;

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Consultation Details
          </Typography>
          <Chip
            label={status}
            color={status === 'Pending Review' ? 'warning' : 'success'}
            size="small"
          />
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          {date} - {type} Consultation
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Severity Alert */}
        {severity === 'severe' && (
          <Alert 
            severity="error" 
            icon={<WarningIcon />}
            sx={{ mb: 2 }}
          >
            This consultation was marked as requiring immediate attention
          </Alert>
        )}

        {/* Symptoms Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Reported Symptoms
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {symptoms.map((symptom, index) => (
              <Chip
                key={index}
                label={symptom}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* AI Conversation */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            AI Assessment
          </Typography>
          <List dense>
            {aiQuestions.map((qa, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body2" color="primary">
                  Q: {qa.question}
                </Typography>
                <Typography variant="body2" sx={{ pl: 2 }}>
                  A: {qa.answer}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">AI Diagnosis:</Typography>
          <Typography variant="body2" paragraph>
            {aiDiagnosis}
          </Typography>
        </Paper>

        {/* Recommendations */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Recommendations
          </Typography>
          <List dense>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemText primary={rec} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Doctor's Feedback */}
        {doctorFeedback && (
          <Paper 
            variant="outlined" 
            sx={{ p: 2, mb: 3, bgcolor: 'success.light' }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Doctor's Review
            </Typography>
            <Typography variant="body2">
              {doctorFeedback}
            </Typography>
          </Paper>
        )}

        {/* Follow-up Notice */}
        {followUpNeeded && (
          <Alert 
            severity="info"
            icon={<ScheduleIcon />}
          >
            A follow-up consultation is recommended. Please schedule an appointment.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          startIcon={<DownloadIcon />}
          variant="outlined"
        >
          Download Summary
        </Button>
        <Button
          startIcon={<ShareIcon />}
          variant="outlined"
        >
          Share
        </Button>
        {followUpNeeded && (
          <Button
            startIcon={<ScheduleIcon />}
            variant="contained"
            color="primary"
          >
            Schedule Follow-up
          </Button>
        )}
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </>
  );
}

export default ConsultationDetail; 