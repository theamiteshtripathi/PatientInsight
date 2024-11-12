import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  Upload as UploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

function UploadedDocuments() {
  const [documents] = useState([
    {
      id: 1,
      name: 'Blood Test Results.pdf',
      type: 'PDF',
      date: '2024-03-15',
      size: '2.4 MB',
      category: 'Lab Results'
    },
    {
      id: 2,
      name: 'X-Ray Image.jpg',
      type: 'Image',
      date: '2024-03-10',
      size: '1.8 MB',
      category: 'Radiology'
    }
  ]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <PdfIcon color="error" />;
      case 'Image':
        return <ImageIcon color="primary" />;
      default:
        return <FileIcon />;
    }
  };

  const handleUpload = () => {
    // Implement file upload logic
    console.log('Uploading new document');
  };

  const handleDelete = (documentId) => {
    // Implement delete logic
    console.log('Deleting document:', documentId);
  };

  const handleDownload = (documentId) => {
    // Implement download logic
    console.log('Downloading document:', documentId);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Uploaded Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleUpload}
        >
          Upload New
        </Button>
      </Box>

      <List>
        {documents.map((doc) => (
          <ListItem
            key={doc.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1
            }}
          >
            <ListItemIcon>
              {getFileIcon(doc.type)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {doc.name}
                  <Chip
                    label={doc.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="caption" display="block">
                    Uploaded: {doc.date}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {doc.size}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleDownload(doc.id)}
                sx={{ mr: 1 }}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(doc.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default UploadedDocuments; 