import React from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function ConsultationFilters({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="AI">AI Consultation</MenuItem>
              <MenuItem value="Doctor">Doctor Review</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Pending Review">Pending Review</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Follow-up Required">Follow-up Required</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Severity</InputLabel>
            <Select
              value={filters.severity}
              label="Severity"
              onChange={(e) => handleChange('severity', e.target.value)}
            >
              <MenuItem value="all">All Severity</MenuItem>
              <MenuItem value="mild">Mild</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="severe">Severe</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date From"
              value={filters.dateFrom}
              onChange={(newValue) => handleChange('dateFrom', newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth />
              )}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Active Filters */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
        {Object.entries(filters).map(([key, value]) => {
          if (value && value !== 'all') {
            return (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                onDelete={() => handleChange(key, 'all')}
                size="small"
              />
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
}

export default ConsultationFilters; 