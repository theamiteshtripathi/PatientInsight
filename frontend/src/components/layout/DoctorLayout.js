import React from 'react';
import { Box, Container } from '@mui/material';
import DoctorSidebar from '../doctor/DoctorSidebar';

function DoctorLayout({ children }) {
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default DoctorLayout; 