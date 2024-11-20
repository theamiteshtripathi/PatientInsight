import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  const getChipColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending review':
        return 'warning';
      case 'reviewed':
        return 'success';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getChipColor(status)}
      size="small"
      sx={{ minWidth: 90 }}
    />
  );
};

export default StatusChip; 