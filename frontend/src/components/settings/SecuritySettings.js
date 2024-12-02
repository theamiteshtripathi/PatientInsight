import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Lock as LockIcon,
  DeviceHub as DeviceIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

function SecuritySettings() {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Mock login activity data
  const loginActivity = [
    {
      id: 1,
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, CA',
      date: '2024-03-15 14:30',
      status: 'Current Session'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      date: '2024-03-14 09:15',
      status: 'Active'
    }
  ];

  const handlePasswordChange = (field) => (event) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleChangePassword = async () => {
    try {
      // Add API call to change password
      setSaveStatus({ 
        type: 'success', 
        message: 'Password changed successfully!' 
      });
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to change password. Please try again.' 
      });
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      // Add API call to logout all devices
      setSaveStatus({ 
        type: 'success', 
        message: 'Logged out of all devices successfully!' 
      });
      setOpenLogoutDialog(false);
    } catch (error) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to logout from all devices. Please try again.' 
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security & Activity
      </Typography>

      {saveStatus && (
        <Alert 
          severity={saveStatus.type}
          sx={{ mb: 2 }}
          onClose={() => setSaveStatus(null)}
        >
          {saveStatus.message}
        </Alert>
      )}

      {/* Quick Actions */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setOpenPasswordDialog(true)}
          >
            Change Password
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => setOpenLogoutDialog(true)}
          >
            Logout All Devices
          </Button>
        </Box>
      </Paper>

      {/* Login Activity */}
      <Paper sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ p: 2, pb: 1 }}>
          Recent Login Activity
        </Typography>
        <List>
          {loginActivity.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DeviceIcon fontSize="small" />
                      {activity.device}
                      {activity.status === 'Current Session' && (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: 'success.light',
                            color: 'success.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            ml: 1
                          }}
                        >
                          Current Session
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {activity.location}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.date}
                      </Typography>
                    </>
                  }
                />
                {activity.status !== 'Current Session' && (
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      color="error"
                      onClick={() => {/* Add logout logic */}}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {index < loginActivity.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    edge="end"
                  >
                    {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SecuritySettings; 