import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Dashboard as DashboardIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  FitnessCenter as FitnessIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Symptom Checker', icon: <HealthAndSafetyIcon />, path: '/symptom-checker' },
    { text: 'Reports & History', icon: <AssignmentIcon />, path: '/reports' },
    { text: 'Consultation History', icon: <HistoryIcon />, path: '/consultations' },
    { text: 'Lifestyle Tips', icon: <FitnessIcon />, path: '/lifestyle' },
    { text: 'Appointments', icon: <ScheduleIcon />, path: '/appointments' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ height: theme.spacing(8) }} /> {/* Toolbar spacing */}
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
      </List>
    </StyledDrawer>
  );
}

export default Sidebar;