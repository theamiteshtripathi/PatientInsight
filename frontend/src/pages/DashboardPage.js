import React from 'react';
import { 
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Import components
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import ChatInterface from '../components/patient/ChatInterface';
import ReportView from '../components/patient/ReportView';
import HealthRecommendations from '../components/patient/HealthRecommendations';
import MedicalHistory from '../components/patient/MedicalHistory';
import ConversationHistory from '../components/patient/ConversationHistory';

function DashboardPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          padding: 3,
          marginTop: '64px' // Add top margin to account for header
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5">Welcome Back, [Patient Name]</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last login: {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <IconButton><NotificationsIcon /></IconButton>
                  <IconButton><SettingsIcon /></IconButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Left Column - AI Chat Interface */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">AI Health Assistant</Typography>
                  <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    size="small"
                  >
                    New Session
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <ChatInterface />
              </Paper>

              {/* Previous Conversations */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Conversations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ConversationHistory />
              </Paper>
            </Grid>

            {/* Right Column - Reports & Recommendations */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Health Reports</Typography>
                  <IconButton color="primary" size="small">
                    <UploadIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <ReportView />
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <HealthRecommendations />
              </Paper>
            </Grid>

            {/* Bottom Section - Medical History */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Medical History Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <MedicalHistory />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardPage;
