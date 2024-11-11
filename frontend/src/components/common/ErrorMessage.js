import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2)
}));

function ErrorMessage({ message, open, handleClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <StyledAlert 
        onClose={handleClose} 
        severity="error"
        sx={{ width: '100%' }}
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
}

export default ErrorMessage;
