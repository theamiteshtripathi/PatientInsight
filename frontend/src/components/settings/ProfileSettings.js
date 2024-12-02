import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    preferredDoctor: '',
    medicalHistory: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (field) => (event) => {
    setProfile({
      ...profile,
      [field]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Add your API call here to update profile
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to update profile. Please try again.' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Profile & Account Management
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

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={profile.name}
              onChange={handleChange('name')}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={profile.email}
              onChange={handleChange('email')}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={profile.phone}
              onChange={handleChange('phone')}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Preferred Doctor</InputLabel>
              <Select
                value={profile.preferredDoctor}
                onChange={handleChange('preferredDoctor')}
                label="Preferred Doctor"
                disabled={!isEditing}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="dr-smith">Dr. Smith</MenuItem>
                <MenuItem value="dr-johnson">Dr. Johnson</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Medical History"
              multiline
              rows={4}
              value={profile.medicalHistory}
              onChange={handleChange('medicalHistory')}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Change Password
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {/* Add password change logic */}}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
}

export default ProfileSettings; 