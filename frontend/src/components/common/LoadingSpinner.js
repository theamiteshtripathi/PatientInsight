import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const SpinnerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}));

function LoadingSpinner() {
  return (
    <SpinnerWrapper>
      <CircularProgress />
    </SpinnerWrapper>
  );
}

export default LoadingSpinner;
