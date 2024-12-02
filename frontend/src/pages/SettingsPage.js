import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Person as ProfileIcon,
  Chat as ConsultationIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import ProfileSettings from '../components/settings/ProfileSettings';
import ConsultationSettings from '../components/settings/ConsultationSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';

function SettingsPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return <ProfileSettings />;
      case 1:
        return <ConsultationSettings />;
      case 2:
        return <NotificationSettings />;
      case 3:
        return <SecuritySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        
        <Grid container spacing={3}>
          {/* Settings Navigation */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ width: '100%' }}>
              <List component="nav">
                <ListItem
                  button
                  selected={currentTab === 0}
                  onClick={(e) => handleTabChange(e, 0)}
                >
                  <ListItemIcon>
                    <ProfileIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile & Account" />
                </ListItem>
                
                <ListItem
                  button
                  selected={currentTab === 1}
                  onClick={(e) => handleTabChange(e, 1)}
                >
                  <ListItemIcon>
                    <ConsultationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Consultation & Reports" />
                </ListItem>
                
                <ListItem
                  button
                  selected={currentTab === 2}
                  onClick={(e) => handleTabChange(e, 2)}
                >
                  <ListItemIcon>
                    <NotificationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItem>
                
                <ListItem
                  button
                  selected={currentTab === 3}
                  onClick={(e) => handleTabChange(e, 3)}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Security & Activity" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Settings Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              {renderContent()}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default SettingsPage; 