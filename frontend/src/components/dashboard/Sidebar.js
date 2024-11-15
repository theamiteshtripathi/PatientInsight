import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  useTheme,
  Toolbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext'; 
import { 
  Dashboard as DashboardIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  FitnessCenter as FitnessIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  SelfImprovement as LifestyleIcon,
  CalendarMonth as AppointmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Symptom Checker', icon: <HealthAndSafetyIcon />, path: '/symptom-checker' },
    { text: 'Reports & History', icon: <AssignmentIcon />, path: '/reports' },
    { text: 'Consultation History', icon: <HistoryIcon />, path: '/consultation-history' },
    { text: 'Lifestyle Tips', icon: <LifestyleIcon />, path: '/lifestyle-tips' },
    { text: 'Appointments', icon: <AppointmentIcon />, path: '/appointments' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
    >
      <Toolbar /> {/* This creates space for the header */}
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                }
              }}
            />
          </ListItem>
        ))}
        <ListItem
          button
          component={Link}
          to="/settings"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
        
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} /> {/* This pushes the logout button to the bottom */}
      <List sx={{ marginTop: 'auto' }}>
        <ListItem
          button
          onClick={handleLogout}
          size="large"
          sx={{ mt: 2 }}
          // sx={{
          //   color: 'error.main',
          //   '&:hover': {
          //     backgroundColor: 'error.light',
          //     color: '.dark',
          //   },
          // }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </StyledDrawer>
  );
}

export default Sidebar;