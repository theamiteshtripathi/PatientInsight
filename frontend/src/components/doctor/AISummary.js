import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AISummary = () => {
  const [showPdf, setShowPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Use a sample PDF URL that we know works
  const samplePdfUrl = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">AI-Generated Summary</Typography>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => {
              setShowPdf(!showPdf);
              setLoading(true);
            }}
            color="primary"
          >
            {showPdf ? 'Hide PDF' : 'View PDF Summary'}
          </Button>
        </Box>

        {showPdf ? (
          <Box 
            sx={{ 
              mt: 2, 
              border: '1px solid #ccc', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              '& .react-pdf__Document': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }
            }}
          >
            {loading && <CircularProgress sx={{ my: 2 }} />}
            
            <Document
              file={samplePdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onLoadError}
              loading={<CircularProgress />}
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>

            {numPages && (
              <Typography sx={{ mt: 2 }}>
                Page {pageNumber} of {numPages}
              </Typography>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outlined"
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                Next
              </Button>
            </Box>

            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => {
                console.log('Saving edited PDF...');
              }}
            >
              Save Changes
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Click the "View PDF Summary" button to view and edit the AI-generated summary in PDF format.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AISummary; 