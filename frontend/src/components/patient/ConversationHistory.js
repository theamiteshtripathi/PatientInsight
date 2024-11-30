import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

function ConversationHistory() {
  const conversations = [
    {
      id: 1,
      date: '2024-03-15',
      topic: 'Flu-like symptoms',
      status: 'Doctor Visit Recommended',
      summary: 'Reported fever, cough, and fatigue'
    },
    {
      id: 2,
      date: '2024-03-10',
      topic: 'Follow-up Check',
      status: 'Completed',
      summary: 'Recovery progress review'
    }
  ];

  return (
    <List>
      {conversations.map((conv) => (
        <ListItem 
          key={conv.id}
          button
          sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          <ListItemIcon>
            <ChatIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{conv.topic}</Typography>
                <Chip 
                  label={conv.status} 
                  size="small"
                  color={conv.status === 'Doctor Visit Recommended' ? 'error' : 'default'}
                />
              </Box>
            }
            secondary={
              <>
                <Typography variant="body2" color="textSecondary">
                  {conv.date}
                </Typography>
                <Typography variant="body2">
                  {conv.summary}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ConversationHistory; 