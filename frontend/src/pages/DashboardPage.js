import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Grid,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  HealthAndSafety as HealthIcon,
  Chat as ChatIcon,
  HealthAndSafety as SymptomsIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import PatientOnboardingForm from '../components/onboarding/PatientOnboardingForm';
import ChatInterface from '../components/patient/ChatInterface';

function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState(null);
  const [chatKey, setChatKey] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User data from localStorage:', user);
    setUserData(user);

    // Show onboarding form if user doesn't have a profile
    if (user && !user.hasProfile) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingSubmit = async (formData) => {
    try {
      // Add user_id to the form data
      const dataWithUserId = {
        ...formData,
        user_id: userData.id
      };

      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/patientsonboardingform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithUserId),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Update user data in localStorage to reflect profile completion
      const updatedUser = {
        ...userData,
        hasProfile: true
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setShowOnboarding(false);

    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCardClick = (type) => {
    if (type === 'chat') {
      setShowChat(true);
      setChatKey(prev => prev + 1);
    } else if (type === 'symptoms') {
      navigate('/symptom-checker');
    }
  };

  if (showChat) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', py: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: '#0066cc',
            p: 2,
            borderRadius: '20px',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HealthIcon sx={{ 
                fontSize: 45, 
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                p: 1,
                borderRadius: '50%'
              }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                  Welcome Back, {userData ? `${userData.first_name} ${userData.last_name}` : 'Guest'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', opacity: 0.9 }}>
                  Let's take care of your health today
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                sx={{ color: '#ffffff' }}
                onClick={() => setShowChat(false)}
              >
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: '#ffffff' }}>
                <SettingsIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
          <ChatInterface key={chatKey} />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PatientOnboardingForm
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSubmit={handleOnboardingSubmit}
      />
      
      <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', py: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: '#0066cc',
          p: 2,
          borderRadius: '20px',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HealthIcon sx={{ 
              fontSize: 45, 
              color: '#ffffff',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              p: 1,
              borderRadius: '50%'
            }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Welcome Back, {userData ? `${userData.first_name} ${userData.last_name}` : 'Guest'}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', opacity: 0.9 }}>
                Let's take care of your health today
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: '#ffffff' }}>
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton size="small" sx={{ color: '#ffffff' }}>
              <SettingsIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '300px',
                borderRadius: '20px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleCardClick('chat')}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 2
                }}>
                  <ChatIcon sx={{ fontSize: 60, color: '#0066cc' }} />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    AI Health Assistant
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Chat with our AI assistant about your health concerns
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '300px',
                borderRadius: '20px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleCardClick('symptoms')}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 2
                }}>
                  <SymptomsIcon sx={{ fontSize: 60, color: '#0066cc' }} />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    Symptoms Checker
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Check your symptoms and get instant health insights
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default DashboardPage;
