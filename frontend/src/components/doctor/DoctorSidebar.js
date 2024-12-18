import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PeopleAlt as PatientsIcon,
  EventNote as ScheduleIcon,
  Description as ReportsIcon,
  Message as MessagesIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


// Import doctor components
import DoctorAppointmentsPage from '../../pages/DoctorAppointmentsPage';
import MedicalReports from './MedicalReports';
import DoctorChat from './DoctorChat';
import PatientsPage from '../../pages/PatientsPage';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    width: drawerWidth,
    position: 'fixed',
    height: '100vh',
    zIndex: theme.zIndex.drawer,
  }
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  background: active ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' : 'transparent',
  color: active ? '#fff' : theme.palette.text.primary,
  '&:hover': {
    background: active 
      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
      : 'rgba(33, 150, 243, 0.1)',
  }
}));

function DoctorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor/dashboard' },
    { text: 'Patients', icon: <PatientsIcon />, path: '/doctor/patients' },
    { text: 'Appointments', icon: <CalendarTodayIcon />, path: '/doctor/appointments' },
    { text: 'Medical Reports', icon: <ReportsIcon />, path: '/doctor/medical-reports' },
    { text: 'Chat', icon: <MessagesIcon />, path: '/doctor/chat' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/doctor/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 3, mt: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Doctor Portal
        </Typography>
      </Box>
      
      <Divider sx={{ mx: 2 }} />

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <StyledListItem
            button
            key={item.text}
            active={location.pathname === item.path ? 1 : 0}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? '#fff' : 'inherit',
              minWidth: 40 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <List sx={{ mb: 2 }}>
        <StyledListItem
          button
          onClick={handleLogout}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </StyledListItem>
      </List>
    </StyledDrawer>
  );
}

export default DoctorSidebar; 