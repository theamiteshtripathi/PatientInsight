import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert
} from '@mui/material';
import DoctorSidebar from '../components/doctor/DoctorSidebar';

function DoctorSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    language: 'English'
  });

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: ''
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleProfileChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DoctorSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>Settings</Typography>

          {/* Profile Settings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Profile Settings</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="License Number"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleProfileChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary">
                Save Profile
              </Button>
            </Box>
          </Paper>

          {/* Application Settings */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Application Settings</Typography>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={() => handleSettingChange('notifications')}
                  />
                }
                label="Push Notifications"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                  />
                }
                label="Email Notifications"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={() => handleSettingChange('darkMode')}
                  />
                }
                label="Dark Mode"
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary">
                Save Settings
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default DoctorSettingsPage; 