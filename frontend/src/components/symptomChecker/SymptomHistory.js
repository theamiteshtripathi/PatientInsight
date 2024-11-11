import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip
} from '@mui/material';
import { 
  Visibility as VisibilityIcon 
} from '@mui/icons-material';

function SymptomHistory() {
  const history = [
    {
      id: 1,
      date: '2024-03-15',
      symptoms: 'Headache, Fever',
      status: 'Completed',
      recommendation: 'Rest and hydration'
    },
    {
      id: 2,
      date: '2024-03-10',
      symptoms: 'Cough, Fatigue',
      status: 'Doctor Visit',
      recommendation: 'Schedule appointment'
    }
  ];

  return (
    <List>
      {history.map((session) => (
        <ListItem key={session.id} divider>
          <ListItemText
            primary={
              <Typography variant="subtitle2">
                {session.symptoms}
                <Chip
                  label={session.status}
                  size="small"
                  color={session.status === 'Doctor Visit' ? 'error' : 'default'}
                  sx={{ ml: 1 }}
                />
              </Typography>
            }
            secondary={
              <>
                <Typography variant="caption" display="block">
                  {session.date}
                </Typography>
                <Typography variant="body2">
                  {session.recommendation}
                </Typography>
              </>
            }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" size="small">
              <VisibilityIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default SymptomHistory; 