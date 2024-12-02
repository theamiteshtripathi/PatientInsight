import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

function Header({ drawerWidth }) {
  return (
    <AppBar 
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, color: 'primary.main', display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 500
          }}
        >
          Patient Insight
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;