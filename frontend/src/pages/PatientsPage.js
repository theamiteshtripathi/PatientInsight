import React, { useState } from 'react';
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
  Alert
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
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import StatusChip from '../components/common/StatusChip';
import MedicalHistory from '../components/patient/Medicalhistory';
import HealthRecommendations from '../components/patient/HealthRecommendations';
import AISummary from '../components/doctor/AISummary';

const AISummaryReview = ({ patient, onSaveReview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorSummary, setDoctorSummary] = useState('');
  const [aiSummary] = useState(patient.aiSummary || '');

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
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      condition: 'Diabetes',
      lastVisit: '2024-03-15',
      status: 'Pending Review',
      aiSummary: 'Patient reports increased thirst and fatigue...',
      contact: {
        email: 'john.doe@email.com',
        phone: '123-456-7890'
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      condition: 'Hypertension',
      lastVisit: '2024-03-14',
      status: 'Urgent',
      aiSummary: 'Blood pressure readings consistently high...',
      contact: {
        email: 'jane.smith@email.com',
        phone: '098-765-4321'
      }
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setCurrentTab(0);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
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
                  <IconButton color="primary">
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
                    <Typography>Email: {selectedPatient.contact.email}</Typography>
                    <Typography>Phone: {selectedPatient.contact.phone}</Typography>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <AISummary />
                
                <Box sx={{ mt: 4 }}>
                  <AISummaryReview 
                    patient={selectedPatient}
                    onSaveReview={(reviewData) => {
                      console.log('Saving review:', reviewData);
                      setPatients(prevPatients => 
                        prevPatients.map(p => 
                          p.id === reviewData.patientId 
                            ? {
                                ...p,
                                status: 'Reviewed',
                                reviewHistory: [...(p.reviewHistory || []), reviewData]
                              }
                            : p
                        )
                      );
                    }}
                  />
                </Box>
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <MedicalHistory />
              </TabPanel>

              <TabPanel value={currentTab} index={3}>
                <HealthRecommendations />
              </TabPanel>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default PatientsPage; 