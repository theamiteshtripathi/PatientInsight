import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  History as HistoryIcon
} from '@mui/icons-material';

function ConsultationSettings() {
  const [settings, setSettings] = useState({
    autoSaveReports: true,
    saveAIHistory: true
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
    // Add API call to save settings
    setSaveStatus({ 
      type: 'success', 
      message: 'Setting updated successfully!' 
    });
  };

  const handleClearHistory = async () => {
    try {
      // Add API call to clear history
      setOpenDialog(false);
      setSaveStatus({ 
        type: 'success', 
        message: 'AI chat history cleared successfully!' 
      });
    } catch (error) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to clear history. Please try again.' 
      });
    }
  };

  const handleDownloadReports = async () => {
    try {
      // Add API call to download reports
      setSaveStatus({ 
        type: 'success', 
        message: 'Reports download started!' 
      });
    } catch (error) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to download reports. Please try again.' 
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Consultation & Report Settings
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

      <List>
        <ListItem>
          <ListItemText
            primary="Auto-save Reports"
            secondary="Automatically save AI and doctor consultation reports"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={settings.autoSaveReports}
              onChange={handleSettingChange('autoSaveReports')}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Save AI Chat History"
            secondary="Keep record of your interactions with AI"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={settings.saveAIHistory}
              onChange={handleSettingChange('saveAIHistory')}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          AI Interaction History
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Clear AI Chat History
        </Button>

        <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
          Report Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReports}
        >
          Download All Reports (PDF)
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          Clear AI Chat History?
        </DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. All your previous AI chat interactions will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleClearHistory}
            color="error"
            variant="contained"
          >
            Clear History
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ConsultationSettings; 