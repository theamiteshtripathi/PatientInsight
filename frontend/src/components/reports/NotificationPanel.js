import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      type: 'report_review',
      title: 'New Doctor Review',
      message: 'Dr. Smith has reviewed your latest consultation',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'upload_reminder',
      title: 'Document Required',
      message: 'Please upload your latest blood test results',
      timestamp: '1 day ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'follow_up',
      title: 'Follow-up Reminder',
      message: 'Schedule your follow-up appointment',
      timestamp: '2 days ago',
      priority: 'low'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'report_review':
        return <AssignmentIcon color="primary" />;
      case 'upload_reminder':
        return <UpdateIcon color="warning" />;
      case 'follow_up':
        return <WarningIcon color="error" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {notification.title}
                    <Chip
                      label={notification.priority}
                      size="small"
                      color={getPriorityColor(notification.priority)}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {notification.timestamp}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default NotificationPanel; 