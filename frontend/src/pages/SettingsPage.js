import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

function SettingsPage() {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);

        const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/patient-profile/${user.id}`);
        
        if (response.status === 404) {
          // Profile doesn't exist
          setProfileData(null);
          setError('No profile found');
          return;
        }
        
        const data = await response.json();
        
        if (response.ok) {
          // Only set profile data if it's not empty
          if (data && Object.keys(data).length > 0) {
            setProfileData(data);
          } else {
            setProfileData(null);
            setError('No profile data available');
          }
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/patient-profile/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value
    });
  };

  if (loading && !profileData) {
    return (
      <MainLayout>
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Profile Settings
            </Typography>
            <Button
              variant="contained"
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={isEditing ? handleSave : handleEdit}
              disabled={loading}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData?.first_name || ''}
                    onChange={handleChange('first_name')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData?.last_name || ''}
                    onChange={handleChange('last_name')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    value={profileData?.date_of_birth || ''}
                    onChange={handleChange('date_of_birth')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    value={profileData?.gender || ''}
                    onChange={handleChange('gender')}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData?.phone_number || ''}
                    onChange={handleChange('phone_number')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={profileData?.address || ''}
                    onChange={handleChange('address')}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Medical Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Blood Type"
                    value={profileData?.blood_type || ''}
                    onChange={handleChange('blood_type')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Height"
                    value={profileData?.height || ''}
                    onChange={handleChange('height')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Weight"
                    value={profileData?.weight || ''}
                    onChange={handleChange('weight')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Medical Conditions"
                    value={profileData?.medical_conditions || ''}
                    onChange={handleChange('medical_conditions')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Allergies"
                    value={profileData?.allergies || ''}
                    onChange={handleChange('allergies')}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Emergency Contact
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    value={profileData?.emergency_contact_name || ''}
                    onChange={handleChange('emergency_contact_name')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    value={profileData?.emergency_contact_relationship || ''}
                    onChange={handleChange('emergency_contact_relationship')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Phone"
                    value={profileData?.emergency_contact_phone || ''}
                    onChange={handleChange('emergency_contact_phone')}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </MainLayout>
  );
}

export default SettingsPage; 