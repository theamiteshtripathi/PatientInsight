import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import SymptomCategories from '../components/symptomChecker/SymptomCategories';
import AIChat from '../components/symptomChecker/AIChat';
import SymptomHistory from '../components/symptomChecker/SymptomHistory';
import RecommendationsPanel from '../components/symptomChecker/RecommendationsPanel';

function SymptomCheckerPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const startNewSession = () => {
    setSessionActive(true);
    setCurrentReport(null);
  };

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
          marginTop: '64px'
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Top Section - Start New Session */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Symptom Checker</Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={startNewSession}
                color="primary"
              >
                Start New Session
              </Button>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Left Column - Chat and Categories */}
            <Grid item xs={12} md={8}>
              {/* Symptom Categories */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Common Symptoms
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <SymptomCategories />
              </Paper>

              {/* AI Chat Interface */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  AI Health Assistant
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <AIChat sessionActive={sessionActive} />
              </Paper>
            </Grid>

            {/* Right Column - History and Recommendations */}
            <Grid item xs={12} md={4}>
              {/* Report Status */}
              {currentReport && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Current Session
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label="Doctor Visit Recommended"
                      color="error"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2">
                      Generating summary report...
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<UploadIcon />}
                  >
                    Upload Additional Documents
                  </Button>
                </Paper>
              )}

              {/* Recommendations Panel */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  AI Recommendations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <RecommendationsPanel />
              </Paper>

              {/* Symptom History */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Previous Sessions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <SymptomHistory />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default SymptomCheckerPage; 