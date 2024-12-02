import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  VideoCall as VideoIcon,
  Person as PersonIcon,
  Schedule as RescheduleIcon,
  Cancel as CancelIcon,
  Description as NotesIcon
} from '@mui/icons-material';

function AppointmentsList() {
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const appointments = [
    {
      id: 1,
      date: '2024-03-20',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      specialty: 'Cardiologist',
      type: 'virtual',
      status: 'confirmed',
      notes: 'Follow-up consultation for heart condition',
      location: 'Video Call'
    },
    // Add more appointments...
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuClick = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
      completed: 'default'
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Upcoming" />
        <Tab label="Past" />
        <Tab label="Cancelled" />
      </Tabs>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    {appointment.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.time}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    {appointment.doctor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.specialty}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={appointment.type === 'virtual' ? <VideoIcon /> : <PersonIcon />}
                    label={appointment.type}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    size="small"
                    color={getStatusColor(appointment.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, appointment)}
                  >
                    <MoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          setOpenDetailsDialog(true);
          handleMenuClose();
        }}>
          <NotesIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <RescheduleIcon sx={{ mr: 1 }} /> Reschedule
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <CancelIcon sx={{ mr: 1 }} /> Cancel
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Appointment Details
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Date & Time
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedAppointment.date} at {selectedAppointment.time}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Doctor
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedAppointment.doctor} ({selectedAppointment.specialty})
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Location
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedAppointment.location}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedAppointment.notes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>
            Close
          </Button>
          {selectedAppointment?.type === 'virtual' && (
            <Button
              variant="contained"
              startIcon={<VideoIcon />}
            >
              Join Call
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AppointmentsList; 