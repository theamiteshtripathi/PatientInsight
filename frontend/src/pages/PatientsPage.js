import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  IconButton,
  TextField,
  Badge,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  Dashboard as DashboardIcon,
  PeopleAlt as PatientsIcon,
  EventNote as ScheduleIcon,
  Description as ReportsIcon,
  Message as MessagesIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import StatusChip from '../components/common/StatusChip';
import MedicalHistory from '../components/patient/Medicalhistory';
import HealthRecommendations from '../components/patient/HealthRecommendations';
import AISummary from '../components/doctor/AISummary';
import DoctorLayout from '../components/layout/DoctorLayout';
import PdfViewer from '../components/PdfViewer';

const AISummaryReview = ({ patient, onSaveReview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorSummary, setDoctorSummary] = useState('');
  const [aiSummary] = useState(patient.aiSummary || '');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!patient?.reports?.[0]?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        
        // Add credentials and more specific headers
        const response = await fetch(
          `http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/report-pdf/${patient.reports[0].id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/pdf',
              'Content-Type': 'application/pdf',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: 'application/pdf' })
        );
        setPdfUrl(url);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(`Failed to load PDF: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    // Cleanup
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [patient]);

  const handleSaveReview = () => {
    onSaveReview({
      patientId: patient.id,
      originalAISummary: aiSummary,
      doctorSummary: doctorSummary,
      timestamp: new Date().toISOString(),
      status: 'Reviewed'
    });
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Patient Report
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.50', minHeight: '300px' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              style={{
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              title="Patient Report"
            />
          ) : (
            <Typography>No report available</Typography>
          )}
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          AI-Generated Summary
          <Chip 
            label="Pending Review" 
            color="warning" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography>{aiSummary}</Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Doctor's Review
          {!isEditing && (
            <IconButton onClick={() => setIsEditing(true)} sx={{ ml: 1 }}>
              <EditIcon />
            </IconButton>
          )}
        </Typography>
        
        {isEditing ? (
          <>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={doctorSummary}
              onChange={(e) => setDoctorSummary(e.target.value)}
              placeholder="Enter your review and modifications..."
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveReview}
              >
                Save Review
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Paper sx={{ p: 2, bgcolor: doctorSummary ? 'primary.50' : 'grey.100' }}>
            {doctorSummary ? (
              <Typography>{doctorSummary}</Typography>
            ) : (
              <Typography color="text.secondary">
                No review added yet. Click edit to add your review.
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Review History
          <IconButton size="small" sx={{ ml: 1 }}>
            <HistoryIcon />
          </IconButton>
        </Typography>
        {patient.reviewHistory?.map((review, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary">
              {new Date(review.timestamp).toLocaleString()}
            </Typography>
            <Typography>{review.doctorSummary}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfEditDialog, setPdfEditDialog] = useState(false);
  const [medication, setMedication] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [doctorPrescription, setDoctorPrescription] = useState('');
  const [medicineNotes, setMedicineNotes] = useState('');

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patients');
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        
        // Map the database data to match your UI structure
        const mappedPatients = data.map(patient => ({
          id: patient.id,
          name: `${patient.first_name} ${patient.last_name}`,
          age: calculateAge(patient.date_of_birth),
          condition: patient.medical_conditions || 'Not specified',
          lastVisit: new Date(patient.created_at).toLocaleDateString(),
          status: patient.status || 'Pending Review',
          contact: {
            email: patient.email || '',
            phone: patient.phone_number || ''
          }
        }));
        
        setPatients(mappedPatients);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle viewing patient details
  const handleViewDetails = async (patient) => {
    try {
      // First fetch patient details
      const detailsResponse = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/${patient.id}/details`);
      if (!detailsResponse.ok) {
        throw new Error(`Failed to fetch patient details: ${detailsResponse.statusText}`);
      }
      const detailsData = await detailsResponse.json();

      // Then fetch reports using the working endpoint from PatientsList.js
      const reportsResponse = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/${patient.id}/reports`);
      if (!reportsResponse.ok) {
        throw new Error(`Failed to fetch reports: ${reportsResponse.statusText}`);
      }
      const reportsData = await reportsResponse.json();
      
      // Combine the data
      const patientDetails = {
        ...patient,
        ...detailsData,
        reports: reportsData.map(report => ({
          id: report.id,
          name: report.report_name || 'Unnamed Report',
          type: report.report_type || 'General',
          date: report.created_at ? new Date(report.created_at).toLocaleDateString() : 'No date',
          status: report.status || 'Pending Review'
        }))
      };
      
      setSelectedPatient(patientDetails);
      setOpenDialog(true);
    } catch (err) {
      console.error('Detailed error in handleViewDetails:', err);
      setError(`Failed to load patient details: ${err.message}`);
    }
  };

  // Handle saving review
  const handleSaveReview = async (reviewData) => {
    try {
      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/patient/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Failed to save review');
      }

      // Update local state
      const updatedPatients = patients.map(p => {
        if (p.id === reviewData.patientId) {
          return { ...p, status: 'Reviewed' };
        }
        return p;
      });
      
      setPatients(updatedPatients);
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Failed to save review');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setCurrentTab(0);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  // Function to view/edit PDF
  const handleViewPdf = async (reportId) => {
    try {
      setPdfError(null);
      const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/report-pdf/${reportId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      
      // Create a blob URL from the PDF data
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedPdfUrl(url);
      
    } catch (err) {
      console.error('Error loading PDF:', err);
      setPdfError('Failed to load PDF file');
    }
  };

  // Function to edit and save PDF
  const handleSavePdf = async () => {
    try {
      // Load the existing PDF
      const existingPdfBytes = await selectedPdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      // Add a new page for doctor's notes
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;
      
      // Embed fonts first
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Add content to the new page
      page.drawText('Doctor\'s Prescription and Notes', {
        x: 50,
        y: height - 50,
        size: 16,
        font: helveticaBoldFont,
      });
      
      page.drawText('Medications:', {
        x: 50,
        y: height - 100,
        size: fontSize,
        font: helveticaFont,
      });
      
      // Add medication text with word wrap
      const medicationLines = medication.split('\n');
      let yPosition = height - 120;
      medicationLines.forEach(line => {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: helveticaFont,
        });
        yPosition -= 20;
      });
      
      page.drawText('Doctor\'s Notes:', {
        x: 50,
        y: yPosition - 20,
        size: fontSize,
        font: helveticaFont,
      });
      
      // Add doctor's notes with word wrap
      const notesLines = doctorNotes.split('\n');
      yPosition -= 40;
      notesLines.forEach(line => {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: helveticaFont,
        });
        yPosition -= 20;
      });
      
      // Add timestamp
      const timestamp = new Date().toLocaleString();
      page.drawText(`Generated on: ${timestamp}`, {
        x: 50,
        y: 50,
        size: 10,
        font: helveticaFont,
      });
      
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      
      // Create form data to send to server
      const formData = new FormData();
      formData.append('pdf', new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
      formData.append('user_id', selectedPatient.id);
      
      // Save to database
      const saveResponse = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/save-edited-report', {
        method: 'POST',
        body: formData,
      });
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save edited report');
      }
      
      setPdfEditDialog(false);
      setMedication('');
      setDoctorNotes('');
      // Optionally refresh the patient's reports list
      handleViewDetails(selectedPatient);
      
    } catch (err) {
      console.error('Error saving PDF:', err);
      setError('Failed to save edited PDF');
    }
  };

  // Update your PDF viewer component in the dialog
  const pdfViewerComponent = (
    <Box sx={{ width: '100%', height: '500px', mt: 2 }}>
      {pdfError ? (
        <Alert severity="error">{pdfError}</Alert>
      ) : selectedPdfUrl ? (
        <iframe
          src={selectedPdfUrl}
          width="100%"
          height="100%"
          title="Patient Report"
          style={{ border: 'none' }}
        />
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );

  // Clean up the blob URL when dialog closes
  useEffect(() => {
    return () => {
      if (selectedPdfUrl) {
        URL.revokeObjectURL(selectedPdfUrl);
      }
    };
  }, [selectedPdfUrl]);

  // Function to handle PDF viewing in AI Summary tab
  const handleViewPatientReport = async (patientId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/reports/${patientId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const reports = await response.json();
      
      if (reports && reports.length > 0) {
        const latestReport = reports[0];
        setSelectedReport(latestReport);
        setLoading(false);
      } else {
        setSelectedReport(null);
        setError('No reports available for this patient');
      }
    } catch (err) {
      console.error('Error loading report:', err);
      setError(`Failed to load patient report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update the TabPanel content for AI Summary
  const AISummaryContent = ({ patient }) => {
    if (!patient) return null;

    return (
      <Box>
        {/* PDF Viewer Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patient Report
          </Typography>
          {patient.latest_report_id ? (
            <PdfViewer reportId={patient.latest_report_id} />
          ) : (
            <Alert severity="info">No report available for this patient</Alert>
          )}
        </Box>

        {/* AI Summary Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            AI Generated Summary
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography>{patient.ai_summary || 'No AI summary available'}</Typography>
          </Paper>
        </Box>
      </Box>
    );
  };

  // Function to save edited notes
  const handleSaveNotes = async () => {
    try {
      const formData = new FormData();
      formData.append('notes', editedNotes);
      formData.append('report_id', selectedReport.id);
      formData.append('patient_id', selectedPatient.id);

      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/save-report-notes', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      // Reset editing state and refresh the report
      setIsEditing(false);
      setEditedNotes('');
      handleViewPatientReport(selectedPatient.id);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes');
    }
  };

  // Update useEffect to load report when patient is selected
  useEffect(() => {
    if (selectedPatient?.user_id && currentTab === 1) {
      handleViewPatientReport(selectedPatient.user_id);
    }
  }, [selectedPatient?.user_id, currentTab]);

  // Update the PDF viewer component
  const PdfViewer = ({ reportId }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadPdf = async () => {
        if (!reportId) {
          setError('No report available');
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/doctor/patient/report-pdf/${reportId}`, {
            method: 'GET',
            credentials: 'include', // Include credentials if needed
            headers: {
              'Accept': 'application/pdf',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setError(null);
        } catch (err) {
          console.error('Error loading PDF:', err);
          setError(`Failed to load PDF: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      loadPdf();

      return () => {
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }, [reportId]);

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }

    return (
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
    );
  };

  // Separate the notes form into its own component
  const DoctorNotesForm = React.memo(({ patientId, reportId }) => {
    const [doctorPrescription, setDoctorPrescription] = useState('');
    const [medicineNotes, setMedicineNotes] = useState('');
    const [saveStatus, setSaveStatus] = useState(null);
    const [existingNoteId, setExistingNoteId] = useState(null);


    useEffect(() => {
        const fetchExistingNotes = async () => {
            try {
                console.log('Fetching notes for:', { patientId, reportId }); // Debug log
                const response = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/notes/${patientId}?report_id=${reportId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.id) {
                        setExistingNoteId(data.id); // Store the note ID if it exists
                    }
                    setDoctorPrescription(data.prescription || '');
                    setMedicineNotes(data.medicine_notes || '');
                }
            } catch (error) {
                console.error('Error fetching existing notes:', error);
            }
        };

        if (patientId && reportId) {
            fetchExistingNotes();
        }
    }, [patientId, reportId]);

    const handleSaveNotes = async (e) => {
        e.preventDefault();
        try {
            setSaveStatus('saving');
            
            const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/notes/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: patientId,
                    report_id: reportId,
                    prescription: doctorPrescription,
                    medicine_notes: medicineNotes,
                    note_id: existingNoteId // Include the existing note ID if it exists
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save notes');
            }

            const data = await response.json();
            setExistingNoteId(data.notes_id); // Update the note ID after saving
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Error saving notes:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Doctor's Notes
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <form onSubmit={handleSaveNotes}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Prescription
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter prescription details..."
                value={doctorPrescription}
                onChange={(e) => setDoctorPrescription(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Medicine Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter medicine notes and instructions..."
                value={medicineNotes}
                onChange={(e) => setMedicineNotes(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>

            {saveStatus && (
              <Alert 
                severity={saveStatus === 'success' ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {saveStatus === 'success' 
                  ? 'Notes saved successfully!' 
                  : 'Failed to save notes. Please try again.'}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setDoctorPrescription('');
                  setMedicineNotes('');
                }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Notes'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    );
  });

  if (loading) {
    return <Box sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;
  }

  return (
    <DoctorLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Patients</Typography>
          <Badge badgeContent={patients.filter(p => p.status === 'Pending Review').length} color="warning">
            <Button startIcon={<NotificationIcon />} variant="contained">
              Pending Reviews
            </Button>
          </Badge>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Last Visit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow 
                  key={patient.id}
                  sx={{ 
                    backgroundColor: patient.status === 'Urgent' ? 'rgba(229, 115, 115, 0.1)' : 'inherit'
                  }}
                >
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={patient.status}
                      status={patient.status}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleViewDetails(patient)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleViewPdf(patient.latest_report_id)}
                    >
                      <AssignmentIcon />
                    </IconButton>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedPatient && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Patient Details
                  <IconButton onClick={handleCloseDialog}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
                  <Tab label="Overview" />
                  <Tab label="AI Summary" />
                  <Tab label="Medical History" />
                  <Tab label="Recommendations" />
                </Tabs>

                <TabPanel value={currentTab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Personal Information</Typography>
                      <Typography>Name: {selectedPatient.name}</Typography>
                      <Typography>Age: {selectedPatient.age}</Typography>
                      <Typography>Email: {selectedPatient.contact?.email}</Typography>
                      <Typography>Phone: {selectedPatient.contact?.phone}</Typography>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Patient Report
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', minHeight: '300px' }}>
                      {selectedPatient?.reports?.[0]?.id ? (
                        <iframe
                          src={`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/reports/view/${selectedPatient.reports[0].id}`}
                          width="100%"
                          height="500px"
                          style={{
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}
                          title="Patient Report"
                        />
                      ) : (
                        <Alert severity="info">No report available for this patient</Alert>
                      )}
                    </Paper>

                    {/* Doctor Notes Form */}
                    {selectedPatient && selectedPatient.reports && selectedPatient.reports[0] && (
                      <DoctorNotesForm 
                        patientId={selectedPatient.user_id}
                        reportId={selectedPatient.reports[0].id}  // Pass the report ID
                      />
                    )}
                  </Box>
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                  <MedicalHistory patient={selectedPatient} />
                </TabPanel>

                <TabPanel value={currentTab} index={3}>
                  <HealthRecommendations patient={selectedPatient} />
                </TabPanel>
              </DialogContent>
            </>
          )}
        </Dialog>

        <Dialog
          open={pdfEditDialog}
          onClose={() => setPdfEditDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Edit Patient Report
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Medications"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Doctor's Notes"
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              margin="normal"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSavePdf}
              >
                Save Changes
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setPdfEditDialog(false)}
              >
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </DoctorLayout>
  );
}

export default PatientsPage; 