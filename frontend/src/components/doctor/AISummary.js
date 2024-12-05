import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const AISummary = ({ patient }) => {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => {
    if (patient?.id) {
      fetchReportsAndSummary();
    }
  }, [patient]);

  const fetchReportsAndSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/reports/${patient.id}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reports and summary');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setAiSummary(data);

      // If we have a latest report with PDF data
      if (data.reports && data.reports.length > 0 && data.reports[0].pdf_data) {
        const pdfBlob = new Blob(
          [Uint8Array.from(atob(data.reports[0].pdf_data), c => c.charCodeAt(0))],
          { type: 'application/pdf' }
        );
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* PDF Viewer Section */}
      {pdfUrl && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patient Report
          </Typography>
          <Box sx={{ height: '600px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Patient Report"
            />
          </Box>
        </Box>
      )}

      {/* AI Summary Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          AI Generated Summary
        </Typography>
        <Paper 
          sx={{ 
            p: 3, 
            bgcolor: 'grey.50',
            whiteSpace: 'pre-line'
          }}
        >
          <Typography>
            {aiSummary?.ai_summary || 'No AI summary available'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default AISummary; 