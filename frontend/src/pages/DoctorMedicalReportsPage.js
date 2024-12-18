import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf,
  Description,
  LocalHospital
} from '@mui/icons-material';
import DoctorSidebar from '../components/doctor/DoctorSidebar';

function DoctorMedicalReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  // Dummy data
  const reports = [
    {
      id: 1,
      patient_name: 'John Doe',
      type: 'Blood Test',
      date: '2024-03-15',
      status: 'Completed',
      doctor: 'Dr. Smith',
      details: {
        hemoglobin: '14.5 g/dL',
        wbc: '7.5 x10^9/L',
        platelets: '250 x10^9/L',
        glucose: '95 mg/dL'
      }
    },
    {
      id: 2,
      patient_name: 'Jane Smith',
      type: 'X-Ray',
      date: '2024-03-14',
      status: 'Pending',
      doctor: 'Dr. Johnson',
      details: {
        region: 'Chest',
        findings: 'Normal chest radiograph',
        impression: 'No acute cardiopulmonary disease'
      }
    },
    {
      id: 3,
      patient_name: 'Mike Wilson',
      type: 'MRI',
      date: '2024-03-13',
      status: 'Completed',
      doctor: 'Dr. Brown',
      details: {
        region: 'Brain',
        contrast: 'With and without',
        findings: 'Normal brain MRI'
      }
    }
  ];

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getReportIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'blood test':
        return <LocalHospital color="error" />;
      case 'x-ray':
        return <PictureAsPdf color="primary" />;
      case 'mri':
        return <Description color="secondary" />;
      default:
        return <Description />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DoctorSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Medical Reports</Typography>
            <Button variant="contained" color="primary">
              Generate New Report
            </Button>
          </Box>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    sx={{ minWidth: 120 }}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                  >
                    Sort
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getReportIcon(report.type)}
                          {report.type}
                        </Box>
                      </TableCell>
                      <TableCell>{report.patient_name}</TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.doctor}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          color={getStatusChipColor(report.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleViewReport(report)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <IconButton size="small" onClick={handleMenuClick}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Report Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Report Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedReport && (
            <Box>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="Details" />
                <Tab label="History" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {currentTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Patient Name</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport.patient_name}</Typography>

                      <Typography variant="subtitle2">Report Type</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport.type}</Typography>

                      <Typography variant="subtitle2">Date</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport.date}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Doctor</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport.doctor}</Typography>

                      <Typography variant="subtitle2">Status</Typography>
                      <Chip
                        label={selectedReport.status}
                        color={getStatusChipColor(selectedReport.status)}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                )}

                {currentTab === 1 && (
                  <Box>
                    {Object.entries(selectedReport.details).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {key.replace('_', ' ')}
                        </Typography>
                        <Typography variant="body1">{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {currentTab === 2 && (
                  <Typography>Report history will be displayed here</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" color="primary">Download PDF</Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print</MenuItem>
      </Menu>
    </Box>
  );
}

export default DoctorMedicalReportsPage; 