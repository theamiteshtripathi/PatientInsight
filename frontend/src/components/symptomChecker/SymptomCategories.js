import React from 'react';
import {
  Box,
  Chip,
  Typography
} from '@mui/material';

const categories = [
  { id: 1, label: 'Headache', type: 'head' },
  { id: 2, label: 'Stomach Pain', type: 'digestive' },
  { id: 3, label: 'Fever', type: 'general' },
  { id: 4, label: 'Cough', type: 'respiratory' },
  { id: 5, label: 'Fatigue', type: 'general' },
  { id: 6, label: 'Joint Pain', type: 'musculoskeletal' },
  { id: 7, label: 'Skin Issues', type: 'dermatological' },
  { id: 8, label: 'Anxiety', type: 'mental' }
];

function SymptomCategories() {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Select common symptoms to help guide the conversation
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            onClick={() => {}}
            variant="outlined"
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default SymptomCategories; 