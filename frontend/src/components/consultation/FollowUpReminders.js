import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Box,
  Divider,
  Chip
} from '@mui/material';
import {
  Event as ScheduleIcon,
  NotificationsNone as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

function FollowUpReminders() {
  const reminders = [
    {
      id: 1,
      consultationDate: '2024-03-15',
      followUpBy: '2024-03-22',
      reason: 'Check fever progression',
      severity: 'high',
      status: 'pending'
    },
    {
      id: 2,
      consultationDate: '2024-03-10',
      followUpBy: '2024-03-24',
      reason: 'Review medication effectiveness',
      severity: 'medium',
      status: 'scheduled'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NotificationsIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Follow-up Reminders
        </Typography>
      </Box>

      <List>
        {reminders.map((reminder, index) => (
          <React.Fragment key={reminder.id}>
            <ListItem
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <ListItemIcon>
                  {reminder.status === 'scheduled' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ScheduleIcon color="warning" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        Follow-up by {reminder.followUpBy}
                      </Typography>
                      <Chip
                        label={reminder.severity}
                        size="small"
                        color={getSeverityColor(reminder.severity)}
                      />
                    </Box>
                  }
                  secondary={`For consultation on ${reminder.consultationDate}`}
                />
              </Box>

              <Box sx={{ pl: 7, width: '100%' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reason: {reminder.reason}
                </Typography>
                
                {reminder.status === 'pending' && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ScheduleIcon />}
                    fullWidth
                  >
                    Schedule Follow-up
                  </Button>
                )}
              </Box>
            </ListItem>
            {index < reminders.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>

      {reminders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="text.secondary">
            No follow-up reminders
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default FollowUpReminders; 