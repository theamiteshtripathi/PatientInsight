import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Chip,
  Typography,
  Autocomplete
} from '@mui/material';

const commonSymptoms = [
  'Fever',
  'Headache',
  'Cough',
  'Fatigue',
  'Nausea',
  'Sore throat',
  'Body ache',
  'Dizziness'
];

function SymptomEntry() {
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');

  const handleAddSymptom = (event, newValue) => {
    setSymptoms(newValue);
  };

  const handleSubmit = () => {
    const symptomData = {
      symptoms,
      description
    };
    console.log('Submitting symptoms:', symptomData);
    // Add API call here to submit symptoms
  };

  return (
    <Box>
      <Autocomplete
        multiple
        options={commonSymptoms}
        value={symptoms}
        onChange={handleAddSymptom}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select Symptoms"
            placeholder="Type or select symptoms"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              color="primary"
              variant="outlined"
            />
          ))
        }
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Describe your symptoms in detail"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Submit Symptoms
      </Button>
    </Box>
  );
}

export default SymptomEntry; 