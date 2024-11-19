import React from 'react';
import { Box, Toolbar, Container } from '@mui/material';

import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';

// Define the drawer width constant
const drawerWidth = 0;

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px', // Height of the header
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout; 