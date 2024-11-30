import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  SmartToy as AIIcon,
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
  Warning as UrgentIcon
} from '@mui/icons-material';

function AIRecommendations() {
  const recommendations = [
    {
      id: 1,
      type: 'follow-up',
      message: 'Based on your recent consultation, a follow-up appointment is recommended within 7 days.',
      specialty: 'Cardiologist',
      urgency: 'high',
      reason: 'Monitor blood pressure changes'
    },
    {
      id: 2,
      type: 'specialist',
      message: 'Consider scheduling an appointment with a nutritionist for dietary guidance.',
      specialty: 'Nutritionist',
      urgency: 'medium',
      reason: 'Support heart health management'
    }
  ];

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[urgency] || 'default';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AIIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          AI Recommendations
        </Typography>
      </Box>

      {recommendations.length > 0 ? (
        <List>
          {recommendations.map((rec, index) => (
            <React.Fragment key={rec.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  {rec.type === 'follow-up' ? (
                    <ScheduleIcon color="primary" />
                  ) : (
                    <HospitalIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2">
                        {rec.specialty}
                      </Typography>
                      {rec.urgency === 'high' && (
                        <Chip
                          icon={<UrgentIcon />}
                          label="Urgent"
                          size="small"
                          color={getUrgencyColor(rec.urgency)}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        {rec.message}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        Reason: {rec.reason}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ScheduleIcon />}
                        sx={{ mt: 1 }}
                      >
                        Schedule Now
                      </Button>
                    </>
                  }
                />
              </ListItem>
              {index < recommendations.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          No recommendations at this time. We'll notify you when new recommendations are available.
        </Alert>
      )}
    </Paper>
  );
}

export default AIRecommendations; 