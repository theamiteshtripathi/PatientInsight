import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createPatient } from '../../services/patientApi';

const steps = [
  'Personal Information',
  'Contact Details',
  'Medical History',
  'Emergency Contact',
  'Preferences'
];

const PatientOnboardingForm = ({ open, onClose, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Get user_id from localStorage when component mounts
    user_id: JSON.parse(localStorage.getItem('user'))?.id || null,
    // Rest of your form fields...
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    // ... other fields
  });
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // Return early if already submitting to prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Check if profile already exists by making an API call
      const checkResponse = await fetch(`http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/patient-profile/${user.id}`);
      if (checkResponse.ok) {
        throw new Error('Profile already exists');
      }

      const formattedDate = formData.dateOfBirth ? 
        formData.dateOfBirth.format('YYYY-MM-DD') : null;

      // Validate required fields before submission
      if (!formData.firstName || !formData.lastName || !formattedDate) {
        throw new Error('Please fill in all required fields');
      }

      const patientData = {
        user_id: user.id,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        date_of_birth: formattedDate,
        gender: formData.gender.trim(),
        phone_number: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
        blood_type: formData.bloodType?.trim() || '',
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        medical_conditions: formData.medicalConditions?.trim() || '',
        allergies: formData.allergies?.trim() || '',
        emergency_contact_name: formData.emergencyName?.trim() || '',
        emergency_contact_relationship: formData.emergencyRelationship?.trim() || '',
        emergency_contact_phone: formData.emergencyPhone?.trim() || '',
        notifications_enabled: Boolean(formData.enableNotifications),
        data_sharing_allowed: Boolean(formData.allowDataSharing)
      };

      // Filter out any empty string values as well as null/undefined
      const cleanedData = Object.fromEntries(
        Object.entries(patientData).filter(([_, value]) => 
          value != null && value !== ''
        )
      );

      console.log('Submitting patient data:', cleanedData);

      const response = await createPatient(cleanedData);
      
      if (response) {
        console.log('Patient created successfully:', response);
        const updatedUser = {
          ...user,
          hasProfile: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onSubmit(response);
        onClose();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(newValue) => {
                    setFormData({ ...formData, dateOfBirth: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleChange('gender')}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange('address')}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Type</InputLabel>
                <Select
                  value={formData.bloodType}
                  onChange={handleChange('bloodType')}
                  label="Blood Type"
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={handleChange('height')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange('weight')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Existing Medical Conditions"
                multiline
                rows={2}
                value={formData.medicalConditions}
                onChange={handleChange('medicalConditions')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                multiline
                rows={2}
                value={formData.allergies}
                onChange={handleChange('allergies')}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                value={formData.emergencyName}
                onChange={handleChange('emergencyName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.emergencyRelationship}
                onChange={handleChange('emergencyRelationship')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                value={formData.emergencyPhone}
                onChange={handleChange('emergencyPhone')}
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.enableNotifications}
                    onChange={handleCheckboxChange('enableNotifications')}
                  />
                }
                label="Enable Health Tips & Reminders"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.allowDataSharing}
                    onChange={handleCheckboxChange('allowDataSharing')}
                  />
                }
                label="Allow Doctors to Access My Records"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        Complete Your Profile
        <Typography variant="subtitle2" color="text.secondary">
          Help us personalize your experience
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        
        <Box sx={{ mt: 2, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Setup'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PatientOnboardingForm; 