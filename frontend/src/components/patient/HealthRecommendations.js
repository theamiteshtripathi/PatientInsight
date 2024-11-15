import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  LocalHospital,
  Opacity
} from '@mui/icons-material';

function HealthRecommendations() {
  const recommendations = [
    {
      id: 1,
      type: 'Exercise',
      description: '30 minutes of moderate exercise daily',
      icon: <FitnessCenter />,
      priority: 'High'
    },
    {
      id: 2,
      type: 'Diet',
      description: 'Increase water intake to 8 glasses per day',
      icon: <Opacity />,
      priority: 'Medium'
    },
    {
      id: 3,
      type: 'Medication',
      description: 'Take prescribed medications as scheduled',
      icon: <LocalHospital />,
      priority: 'High'
    },
    {
      id: 4,
      type: 'Nutrition',
      description: 'Include more fruits and vegetables in diet',
      icon: <Restaurant />,
      priority: 'Medium'
    }
  ];

  return (
    <Box>
      <List>
        {recommendations.map((rec) => (
          <Paper
            key={rec.id}
            elevation={1}
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <ListItem>
              <ListItemIcon>
                {rec.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {rec.type}
                    <Chip
                      label={rec.priority}
                      size="small"
                      color={rec.priority === 'High' ? 'error' : 'primary'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {rec.description}
                  </Typography>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
}

export default HealthRecommendations; 