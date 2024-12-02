import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  FitnessCenter as ExerciseIcon,
  Restaurant as NutritionIcon,
  LocalDrink as HydrationIcon,
  Bedtime as SleepIcon,
  SelfImprovement as WellnessIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

function SavedTips() {
  const [savedTips] = React.useState([
    {
      id: 1,
      title: 'Morning Stretch Routine',
      category: 'exercise',
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Healthy Snack Options',
      category: 'nutrition',
      date: '2024-03-14'
    },
    {
      id: 3,
      title: 'Meditation Basics',
      category: 'wellness',
      date: '2024-03-13'
    }
  ]);

  const getCategoryIcon = (category) => {
    const icons = {
      exercise: <ExerciseIcon color="success" />,
      nutrition: <NutritionIcon color="primary" />,
      hydration: <HydrationIcon color="info" />,
      sleep: <SleepIcon color="secondary" />,
      wellness: <WellnessIcon color="warning" />
    };
    return icons[category] || <WellnessIcon />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      exercise: 'success',
      nutrition: 'primary',
      hydration: 'info',
      sleep: 'secondary',
      wellness: 'warning'
    };
    return colors[category] || 'default';
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Saved Tips
      </Typography>
      <List>
        {savedTips.map((tip, index) => (
          <React.Fragment key={tip.id}>
            <ListItem>
              <ListItemIcon>
                {getCategoryIcon(tip.category)}
              </ListItemIcon>
              <ListItemText
                primary={tip.title}
                secondary={
                  <Chip
                    label={tip.category}
                    size="small"
                    color={getCategoryColor(tip.category)}
                    sx={{ mt: 1 }}
                  />
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < savedTips.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default SavedTips; 