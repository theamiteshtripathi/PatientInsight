import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  HealthAndSafety as HealthIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import ChatInterface from '../components/patient/ChatInterface';
import PatientOnboardingForm from '../components/onboarding/PatientOnboardingForm';

function DashboardPage() {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingSubmit = async (formData) => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  return (
    <MainLayout>
      <PatientOnboardingForm
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSubmit={handleOnboardingSubmit}
      />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #1976d2 0%, #0f4c81 100%)',
                borderRadius: '20px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '2px solid white'
                  }}
                >
                  <HealthIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Welcome Back, [Patient Name]
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Let's take care of your health today
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Chat Interface */}
        <Grid container>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                height: 'auto', 
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                bgcolor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #0f4c81 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  AI Health Assistant
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <ChatInterface />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default DashboardPage;
