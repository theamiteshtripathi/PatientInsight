import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import DailyTipsCarousel from '../components/lifestyle/DailyTipsCarousel';
import PersonalizedRecommendations from '../components/lifestyle/PersonalizedRecommendations';
import HealthChallenges from '../components/lifestyle/HealthChallenges';
import GoalsTracker from '../components/lifestyle/GoalsTracker';
import ResourceLibrary from '../components/lifestyle/ResourceLibrary';
import SavedTips from '../components/lifestyle/SavedTips';
import ActiveChallenges from '../components/lifestyle/ActiveChallenges';
import GoalsSummary from '../components/lifestyle/GoalsSummary';

function LifestyleTipsPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Your Lifestyle Tips
              </Typography>
              
              {/* Daily Tips Carousel */}
              <Box sx={{ mb: 4 }}>
                <DailyTipsCarousel />
              </Box>

              {/* Tab Navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab label="Recommendations" />
                  <Tab label="Challenges" />
                  <Tab label="Goals" />
                  <Tab label="Resources" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ mt: 3 }}>
                {currentTab === 0 && <PersonalizedRecommendations />}
                {currentTab === 1 && <HealthChallenges />}
                {currentTab === 2 && <GoalsTracker />}
                {currentTab === 3 && <ResourceLibrary />}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Quick Actions & Progress */}
          <Grid item xs={12} md={4}>
            <SavedTips />
            <ActiveChallenges />
            <GoalsSummary />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default LifestyleTipsPage; 