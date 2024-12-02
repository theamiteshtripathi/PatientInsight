import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper
} from '@mui/material';

function NotificationSettings() {
  const [settings, setSettings] = useState({
    upcomingConsultations: true,
    followUpReminders: true,
    reportUpdates: true,
    healthTips: false,
    emailNotifications: true,
    pushNotifications: true
  });
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
    // Add API call to save settings
    setSaveStatus({ 
      type: 'success', 
      message: 'Notification preferences updated!' 
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>

      {saveStatus && (
        <Alert 
          severity={saveStatus.type}
          sx={{ mb: 2 }}
          onClose={() => setSaveStatus(null)}
        >
          {saveStatus.message}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="Consultation Reminders"
              secondary="Get notified about upcoming consultations"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.upcomingConsultations}
                onChange={handleSettingChange('upcomingConsultations')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Follow-up Reminders"
              secondary="Receive reminders for follow-up appointments"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.followUpReminders}
                onChange={handleSettingChange('followUpReminders')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Report Updates"
              secondary="Get notified when new reports are available"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.reportUpdates}
                onChange={handleSettingChange('reportUpdates')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Health Tips"
              secondary="Receive personalized health tips and recommendations"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.healthTips}
                onChange={handleSettingChange('healthTips')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        Notification Channels
      </Typography>

      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive notifications via email"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={handleSettingChange('emailNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive notifications in your browser"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.pushNotifications}
                onChange={handleSettingChange('pushNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default NotificationSettings; 