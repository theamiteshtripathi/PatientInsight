import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions 
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

const handleSaveNotes = async (reportId, notes) => {
  try {
    const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/save-report-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report_id: reportId,
        notes: notes
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save notes');
    }

    const data = await response.json();
    console.log('Notes saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error saving notes:', error);
    throw error;
  }
};

const PdfViewer = ({ reportId, onSave }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadPdf();
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [reportId]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/report-pdf/${reportId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/pdf',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(`Failed to load PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await handleSaveNotes(reportId, notes);
      setEditDialogOpen(false);
      if (onSave) {
        onSave(notes);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      // Handle error (show error message to user)
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          startIcon={<EditIcon />}
          onClick={() => setEditDialogOpen(true)}
          variant="contained"
          color="primary"
        >
          Edit Report
        </Button>
      </Box>

      <iframe
        src={pdfUrl}
        width="100%"
        height="600px"
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
        title="Patient Report"
      />

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Report Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PdfViewer; 